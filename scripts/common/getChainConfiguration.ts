import getPublicConfiguration from './getPublicConfiguration';

const getChainConfiguration = async (chain: number) => {
  if (!chain) return null;
  const publicConfiguration = await getPublicConfiguration(false);
  // console.log(`publicConfiguration ${chain}`, publicConfiguration);
  return publicConfiguration.chains[chain];
};
export default getChainConfiguration;
