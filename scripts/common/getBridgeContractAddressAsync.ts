import getBridgeContractAddress from './getBridgeContractAddress';
import getPublicConfiguration from './getPublicConfiguration';

const getBridgeContractAddressAsync = async (chainId: number) => {
  const publicConfiguration = await getPublicConfiguration(false);
  return getBridgeContractAddress(chainId, publicConfiguration);
};
export default getBridgeContractAddressAsync;
