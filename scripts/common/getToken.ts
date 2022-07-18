import PublicConfigurationRoot from '../interface/mapping/PublicConfigurationRoot';
import TokenItem from '../interface/mapping/TokenItem';
import getPublicConfiguration from './getPublicConfiguration';

const getToken = (chain: number, token: string, publicConfiguration: PublicConfigurationRoot): TokenItem => {
  if (!publicConfiguration) return null;
  if (!publicConfiguration.chains) return null;
  if (!publicConfiguration.chains[chain]) return null;
  if (!publicConfiguration.chains[chain].tokens) return null;

  return publicConfiguration.chains[chain].tokens[token];
};
export default getToken;
