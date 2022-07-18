import ChainId2ChainItem from '../interface/mapping/ChainId2ChainItem';
import getPublicConfiguration from './getPublicConfiguration';

const getChains = async (): Promise<ChainId2ChainItem> => {
  const publicConfiguration = await getPublicConfiguration(false);
  return publicConfiguration.chains;
};
export default getChains;
