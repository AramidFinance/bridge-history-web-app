import { AlgoPrivateConfiguration } from '../algo/AlgoPrivateConfiguration';
import { EthPrivateConfiguration } from '../eth/EthPrivateConfiguration';

interface NetworksPrivateConfiguration {
  [key: number]: AlgoPrivateConfiguration | EthPrivateConfiguration;
}
export default NetworksPrivateConfiguration;
