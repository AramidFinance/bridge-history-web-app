import PublicConfigurationRoot from '../interface/mapping/PublicConfigurationRoot';
import getPublicConfiguration from './getPublicConfiguration';
/**
 * returns eth|algo
 *
 * @param chain
 * @returns eth|algo
 */
const getChainType = (chain: number, publicConfiguration: PublicConfigurationRoot): string => {
  if (chain <= 0) return null;
  if (chain < 101000) return 'eth';
  if (chain > 102000) return 'eth';
  if (chain <= 101002) return 'algo';
  return null;
};
export default getChainType;
