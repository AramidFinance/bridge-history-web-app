import algosdk from 'algosdk';
import { CustomTokenHeader } from 'algosdk/dist/types/src/client/urlTokenBaseHTTPClient';
import getLogger from '../common/getLogger';
import getSecureConfiguration from '../common/getSecureConfiguration';
import { AlgoPrivateConfiguration } from '../interface/algo/AlgoPrivateConfiguration';

interface ChainId2Algodv2 {
  [key: number]: algosdk.Algodv2;
}

const algodClientRef: ChainId2Algodv2 = {};

/**
 * Instantiates or grabs from memory an algorand client instance.
 * @param {string} type - "root" or "destination"
 * @returns - An algorand client instance
 */
const getAlgodClientByChainId = async (chainId: number) => {
  const logger = getLogger();
  if (algodClientRef[chainId] == undefined) {
    // init
    let tokenHeader = 'X-Algo-API-Token';
    const secureConfiguration = await getSecureConfiguration();
    const config = secureConfiguration.chains[chainId] as AlgoPrivateConfiguration;
    if (!config || !config.algod) {
      console.error('Algod not configured properly');
      return null;
    }
    if (config.algod.header) {
      tokenHeader = config.algod.header;
    }
    const auth: CustomTokenHeader = {};
    auth[tokenHeader] = config.algod.token;
    logger.debug('algodClient root', config.algod.host, config.algod.port);
    algodClientRef[chainId] = new algosdk.Algodv2(auth, config.algod.host, config.algod.port);
  }
  return algodClientRef[chainId];
};
export default getAlgodClientByChainId;
