import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import getSecureConfiguration from '../common/getSecureConfiguration';
import { EthPrivateConfiguration } from '../interface/eth/EthPrivateConfiguration';
import getIndexerClientByChainId from './getIndexerClientByChainId';

const getAlgoAccountTokenBalance = async (chainId: number, accountAddress: string, asa: number): Promise<BigNumber> => {
  const secureConfiguration = await getSecureConfiguration();
  if (!secureConfiguration.chains || !secureConfiguration.chains[chainId]) return null;
  const indexer = await getIndexerClientByChainId(chainId);
  const account = await indexer.lookupAccountByID(accountAddress).do();
  if (!account || !account.account) return new BigNumber('0');
  if (asa == 0) {
    return account.account.amount;
  }
  if (!account.account.assets) return new BigNumber('0');
  const asaItem = account.account.assets.find((a: any) => a['asset-id'] == asa);
  if (!asaItem) return new BigNumber('0');
  const ret = new BigNumber(asaItem.amount);
  console.log('account.amount', ret.toFixed(0, 1));
  return ret;
};
export default getAlgoAccountTokenBalance;
