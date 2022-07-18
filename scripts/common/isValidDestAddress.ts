import algosdk from 'algosdk';
import { utils } from 'ethers';
import { IState } from '../../context/AppContext';

const isValidDestAddress = (appData: IState, toValidate?: string): boolean => {
  const toCheck = toValidate ? toValidate : appData.destinationAddress;
  // address is address to be checked for the destination address purpose
  console.debug('isValidDestAddress.1', appData.destinationChainConfiguration, toCheck);
  if (!appData.destinationChainConfiguration) return false;
  // checks if destination address is valid
  if (appData.destinationChainConfiguration.type == 'algo') {
    const ret = algosdk.isValidAddress(toCheck);
    console.debug(`dest address is valid algo address: ${ret}`);
    return ret;
  }
  if (appData.destinationChainConfiguration.type == 'eth') {
    const ret = utils.isAddress(toCheck);
    console.debug(`dest address is valid eth address: ${toCheck}: ${ret}`);
    return ret;
  }
  return false;
};
export default isValidDestAddress;
