import algosdk from 'algosdk';
import getAlgodClientByChainId from '../../scripts/algo/getAlgodClientByChainId';
import getIndexerClientByChainId from '../../scripts/algo/getIndexerClientByChainId';
import { IAssetData } from './types';

export async function apiGetAccountAssets(chain: number, address: string): Promise<IAssetData[]> {
  // console.log(`apiGetAccountAssets ${chain} ${address}`)
  const client = await getIndexerClientByChainId(chain);
  const accountInfo = await client.lookupAccountByID(address).setIntDecoding(algosdk.IntDecoding.BIGINT).do();

  const algoBalance = accountInfo.account.amount as bigint;
  // console.log("accountInfo.assets",accountInfo.account.assets)
  const assetsFromRes: Array<{
    'asset-id': bigint;
    amount: bigint;
    'is-frozen': boolean;
    deleted: boolean;
    'opted-in-at-round': bigint;
  }> = accountInfo.account.assets;

  const assets: IAssetData[] = assetsFromRes.map(({ 'asset-id': id, amount, 'is-frozen': frozen }) => ({
    id: Number(id),
    amount,
    frozen,
    decimals: 0,
  }));

  assets.sort((a, b) => a.id - b.id);

  await Promise.all(
    assets.map(async asset => {
      let fetchedAsset = null;
      const cacheKey = `asset-${asset.id}`;
      const cacheItem = localStorage.getItem(cacheKey);
      if (cacheItem) {
        try {
          fetchedAsset = JSON.parse(cacheItem);
        } catch (e) {
          console.error(e);
        }
      }
      if (!fetchedAsset) {
        fetchedAsset = await client.lookupAssetByID(asset.id).do();
        localStorage.setItem(cacheKey, JSON.stringify(fetchedAsset));
      }
      // console.log("fetchedAsset",fetchedAsset)
      asset.name = fetchedAsset.asset.params.name;
      asset.unitName = fetchedAsset.asset.params['unit-name'];
      asset.url = fetchedAsset.asset.params.url;
      asset.decimals = fetchedAsset.asset.params.decimals;
    })
  );

  assets.unshift({
    id: 0,
    amount: algoBalance,
    frozen: false,
    decimals: 6,
    name: 'Algo',
    unitName: 'Algo',
  });
  // console.log("apiGetAccountAssets.assets",assets)
  return assets;
}

export async function apiGetTxnParams(chain: number): Promise<algosdk.SuggestedParams> {
  const client = await getAlgodClientByChainId(chain);
  const params = await client.getTransactionParams().do();
  return params;
}

export async function apiSubmitTransactions(chain: number, stxns: Uint8Array[]): Promise<string> {
  const client = await getAlgodClientByChainId(chain);
  const { txId } = await client.sendRawTransaction(stxns).do();
  await waitForTransaction(chain, txId);
  return txId;
}

async function waitForTransaction(chain: number, txId: string): Promise<number> {
  const client = await getAlgodClientByChainId(chain);

  let lastStatus = await client.status().do();
  let lastRound = lastStatus['last-round'];
  while (true) {
    const status = await client.pendingTransactionInformation(txId).do();
    if (status['pool-error']) {
      throw new Error(`Transaction Pool Error: ${status['pool-error']}`);
    }
    if (status['confirmed-round']) {
      return status['confirmed-round'];
    }
    lastStatus = await client.statusAfterBlock(lastRound + 1).do();
    lastRound = lastStatus['last-round'];
  }
}
