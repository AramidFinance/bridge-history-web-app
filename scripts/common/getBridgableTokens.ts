import getPublicConfiguration from './getPublicConfiguration';

const getBridgableTokens = async () => {
  const publicConfiguration = await getPublicConfiguration(false);
  return publicConfiguration.chains2tokens;
};
export default getBridgableTokens;
