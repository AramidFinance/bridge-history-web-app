import algosdk from 'algosdk';
import { CustomTokenHeader } from 'algosdk/dist/types/src/client/urlTokenBaseHTTPClient';
import getLogger from '../common/getLogger';
import chainId2Type from '../common/chainId2Type';
import getSecureConfiguration from '../common/getSecureConfiguration';
import { AlgoPrivateConfiguration } from '../interface/algo/AlgoPrivateConfiguration';

interface ChainId2Indexer {
  [key: number]: algosdk.Indexer;
}

const indexerClientRef: ChainId2Indexer = {};

/**
 * Creates or grabs from memory an instance of an Algorand Indexer client
 * @param {string} chainId - ChainId
 * @returns - An indexer client object.
 */
const getIndexerClientByChainId = async (chainId: number) => {
  const logger = await getLogger();
  if (indexerClientRef[chainId] == undefined) {
    const secureConfiguration = await getSecureConfiguration();
    const config = secureConfiguration.chains[chainId] as AlgoPrivateConfiguration;
    if (!config || !config.indexer) {
      logger.error(`Algo indexer for chain ${chainId} not configured`);
      return null;
    }
    let tokenHeader = 'X-Algo-API-Token';
    if (config.indexer.header) {
      tokenHeader = config.indexer.header;
    }
    const auth: CustomTokenHeader = {};
    auth[tokenHeader] = config.indexer.token;
    logger.debug(`indexerClient root ${config.indexer.host}, ${config.indexer.port}`);
    indexerClientRef[chainId] = new algosdk.Indexer(auth, config.indexer.host, config.indexer.port);
  }
  return indexerClientRef[chainId];
};

export default getIndexerClientByChainId;
