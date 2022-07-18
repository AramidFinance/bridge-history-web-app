import algosdk from 'algosdk';
import { utils } from 'ethers';
import { IState } from '../../context/AppContext';

export const isValidAddress = (address: string, appData: IState): Boolean => {
  if (!appData.sourceChainConfiguration) return false;
  return (appData.sourceChainConfiguration.type === 'algo' && algosdk.isValidAddress(address)) || (appData.sourceChainConfiguration.type === 'eth' && utils.isAddress(address));
};
