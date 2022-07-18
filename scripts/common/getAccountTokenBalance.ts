import BigNumber from 'bignumber.js';
import getAlgoAccountTokenBalance from '../algo/getAlgoAccountTokenBalance';
import getEthAccountTokenBalance from '../eth/getEthAccountTokenBalance';
import getChainType from './getChainTypeAsync';
import moment from 'moment';
interface CacheItem {
  time: string;
  value: string;
}

const getAccountTokenBalance = async (chain: number, account: string, token: string): Promise<BigNumber> => {
  const cacheKey = `${chain}-${account}-${token}`;
  try {
    const localCacheStr = localStorage.getItem(cacheKey);
    const localCache: CacheItem = JSON.parse(localCacheStr);
    console.log('fetching balance, to cache value:', localCache, token);
    if (localCache && moment(localCache.time) > moment().subtract(10, 'second') && !isNaN(+localCache.value) && localCache.value) {
      return new BigNumber(localCache.value);
    }
    const type = await getChainType(chain);
    let ret: BigNumber;
    console.log(`chain:${chain}:${type}`);
    switch (type) {
      case 'eth':
        ret = await getEthAccountTokenBalance(chain, account, token);
        break;
      case 'algo':
        ret = await getAlgoAccountTokenBalance(chain, account, +token);
        break;
    }
    if (!ret && ret != new BigNumber(0)) return; // non-zero false value means something went wrong during the API call
    const toCache: CacheItem = { time: moment().toISOString(), value: ret.toFixed(0, 1) };
    console.log('toCache', toCache);
    localStorage.setItem(cacheKey, JSON.stringify(toCache));
    return ret;
  } catch (e) {
    console.error('error fetching balance:', e);
    const localCacheStr = localStorage.getItem(cacheKey);
    if (localCacheStr) {
      const localCache: CacheItem = JSON.parse(localCacheStr);
      return new BigNumber(localCache.value);
    }
    return null;
  }
};
export default getAccountTokenBalance;
