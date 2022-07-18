import algosdk from 'algosdk';
import { utils } from 'ethers';
import { IState } from '../../context/AppContext';

const isValidSourceAddress = (appData: IState): boolean => {
  if (!appData.sourceChainConfiguration) return false;
  // checks if source address is valid
  return (
    (appData.sourceChainConfiguration && appData.sourceChainConfiguration.type == 'algo' && algosdk.isValidAddress(appData.sourceAddress)) ||
    (appData.sourceChainConfiguration && appData.sourceChainConfiguration.type == 'eth' && utils.isAddress(appData.sourceAddress))
  );
};
export default isValidSourceAddress;
