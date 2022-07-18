import getPublicConfiguration from '../common/getPublicConfiguration';

let cache: Array<number> = null;
const getEthChains = async () => {
  if (cache !== null) return cache;
  const publicConfiguration = await getPublicConfiguration(false);
  const ret = [];
  for (const chain of Object.keys(publicConfiguration.chains)) {
    if (publicConfiguration.chains[chain].type == 'eth') {
      ret.push(parseInt(chain));
    }
  }
  cache = ret;
  return cache;
};
export default getEthChains;
