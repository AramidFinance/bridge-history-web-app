import AddressesPublicConfiguration from './AddressesPublicConfiguration';
import ChainId2ChainItem from './ChainId2ChainItem';
import SourceChain2DestinationChain from './SourceChain2DestinationChain';

interface PublicConfigurationRoot {
  hash?: string;
  addresses: AddressesPublicConfiguration;
  chains: ChainId2ChainItem;
  chains2tokens: SourceChain2DestinationChain;
}
export default PublicConfigurationRoot;
