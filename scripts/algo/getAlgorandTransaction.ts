import asyncdelay from '../common/asyncDelay';
import getIndexerClientByChainId from './getIndexerClientByChainId';

/**
 * Loads algorand transaction from the network
 * @param txId Transaction ID
 * @param chainId Algorand chain
 */
const getAlgorandTransaction = async (txId: string, chainId: number) => {
  try {
    let tries = 5;
    while (tries > 0) {
      tries--;
      try {
        const indexer = await getIndexerClientByChainId(chainId);
        await asyncdelay(100);
        return await indexer.lookupTransactionByID(txId).do();
      } catch (e) {
        await asyncdelay(5000);
        if (tries <= 0) {
          throw e;
        }
      }
      throw `Too many attempts to load tx ${txId}`;
    }
  } catch (e) {
    console.error(`Unable to load tx from algo chain ${chainId} ${txId}`, e);
    return null;
  }
};
export default getAlgorandTransaction;
