import { ethers } from 'ethers';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../../context/AppContext';

const ConnectSourceChainEffect = () => {
  const appData = useContext(AppContext);

  /**
   * This effect should check the valid connected eth source chain to the source chain user setting for review page
   */
  useEffect(() => {
    if (!appData.publicConfiguration) return;
    if (!appData.isBridgeTabOpen) return;
    console.debug('index effect 07', appData);
    if (appData.sourceChainConfiguration && appData.sourceChainConfiguration.type == 'eth' && ethers.utils.isAddress(appData.sourceAddress) && appData.connectedSourceChain != appData.sourceChain) {
      console.log(`attempting to switch to source network (${appData.sourceChain}) from current network (${appData.connectedSourceChain})`, {
        isBridgeTabOpen: appData.isBridgeTabOpen,
        isReviewTabOpen: appData.isReviewTabOpen,
        isClaimTabOpen: appData.isClaimTabOpen,
        isMintScreen: appData.isMintScreen,
      });
      try {
        const request = {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${appData.sourceChain.toString(16)}` }],
        };
        console.log('requesting network change for review process:', request);
        appData.sourceProvider.request(request);
        // appData.sourceChain = appData.sourceChain;
        // appData.setAppData(appData);
      } catch (err) {
        console.log('error switching networks:', err);
      }
      // reconnect
    }
  }, [
    appData.sourceChainConfiguration,
    appData.connectedSourceChain,
    appData.sourceAddress,
    appData.sourceChain,
    appData.connectedDestinationChain,
    appData.destinationChain,
    appData.sourceProvider,
    appData.transferApproved,
    appData.assetLocked,
    appData.lockAssetHash,
    appData.approvalTxHash,
    appData.isBridgeTabOpen,
    appData.publicConfiguration,
  ]);
  return <></>;
};
export default ConnectSourceChainEffect;
