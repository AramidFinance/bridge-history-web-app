import getPublicConfiguration from './getPublicConfiguration';

const getAssetAsync = async (chain: number, token: string) => {
  const publicConfiguration = await getPublicConfiguration(false);
  return publicConfiguration.chains[chain].tokens[token];
};
export default getAssetAsync;
