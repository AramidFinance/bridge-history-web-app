import PublicConfigurationRoot from '../interface/mapping/PublicConfigurationRoot';
import getPublicConfiguration from './getPublicConfiguration';

const getBridgeContractAddress = (chainId: number, publicConfiguration: PublicConfigurationRoot): string => {
  if (!publicConfiguration) return null;
  if (!publicConfiguration.chains) return null;
  if (!publicConfiguration.chains[chainId]) return null;

  return publicConfiguration.chains[chainId].address;
};
export default getBridgeContractAddress;
