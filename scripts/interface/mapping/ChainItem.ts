import ChainTypeEnum from './ChainTypeEnum';
import SoldierByRoundItem from './SoldierByRoundItem';
import TokenId2TokenItem from './TokenId2TokenItem';

type ChainItem = {
  chainId: number;
  name: string;
  type: ChainTypeEnum;
  logo: string;
  folder: string;
  address: string;
  tokens: TokenId2TokenItem;
  blockExplorers: Array<string>;
  soldiersByRound: Array<SoldierByRoundItem>;
};
export default ChainItem;
