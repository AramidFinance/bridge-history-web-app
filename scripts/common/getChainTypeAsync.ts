import getChainType from './getChainType';
import getPublicConfiguration from './getPublicConfiguration';
/**
 * returns eth|algo
 *
 * @param chain
 * @returns eth|algo
 */
const getChainTypeAsync = async (chain: number): Promise<string> => {
  const publicConfiguration = await getPublicConfiguration(false);
  return getChainType(chain, publicConfiguration);
};
export default getChainTypeAsync;
