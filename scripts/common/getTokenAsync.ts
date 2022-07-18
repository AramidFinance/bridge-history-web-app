import TokenItem from '../interface/mapping/TokenItem';
import getPublicConfiguration from './getPublicConfiguration';

const getTokenAsync = async (chain: number, token: string): Promise<TokenItem> => {
  const publicConfiguration = getPublicConfiguration(false);
  return (await publicConfiguration).chains[chain].tokens[token];
};
export default getTokenAsync;
