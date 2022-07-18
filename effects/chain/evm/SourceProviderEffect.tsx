import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../../context/AppContext';

const SourceProviderEffect = () => {
  const appData = useContext(AppContext);

  const disconnectSourceEth = useCallback(
    async function () {
      console.debug('useCallback disconnectSourceEth');
      try {
        if (appData.sourceProvider) {
          appData.sourceProvider.disconnect();
        }
        console.log('reset.sourceProvider from disconnect s eth');
        appData.sourceProvider = null;
        appData.sourceWeb3Provider = null;
        appData.sourceAddress = '';
        appData.connectedSourceChain = null;
        appData.setAppData(appData);
      } catch (err) {
        // console.log('error disconnecting: ', err);
      }
    },
    [appData]
  ); // disconnects from eth wallet

  const handleSourceChainChanged = (_hexChainId: string) => {
    // window.location.reload(); // reload page on chain change
    // commented out because I don't want it to reload, but is it a security risk?
    // wormhole/portal bridge doesn't reload their page on chain change, but I'm not sure if they do something else different.
    // reading material: https://docs.ethers.io/v5/concepts/best-practices/
    console.log('_hexChainId', _hexChainId);
    const newChainId = parseInt(_hexChainId, 16);
    console.log(`set.connectedSourceChain from handleChainChanged ${newChainId}`);
    if (appData.isBridgeTabOpen) {
      console.log('handleChainChanged: switched to source network');
      appData.connectedSourceChain = newChainId;
      appData.setAppData(appData);
    }
  };

  /**
   * This effect sets the EVM source provider events
   */
  useEffect(() => {
    if (!appData.appConfiguration) return;
    console.debug('index effect 02');
    // handles eth account or network changing, or disconnecting
    if (appData.sourceProvider && appData.sourceProvider?.on) {
      const handleAccountsChanged = async (accounts: string[]) => {
        console.log('accounts changed', accounts);
        appData.sourceAddress = accounts[0];
        appData.setAppData(appData);
      };

      const handleDisconnect = (disc: { code: number; message: string }) => {
        console.log('disconnect', disc);
        disconnectSourceEth();
      };

      appData.sourceProvider.on('accountsChanged', handleAccountsChanged);
      appData.sourceProvider.on('chainChanged', handleSourceChainChanged);
      appData.sourceProvider.on('disconnect', handleDisconnect);

      return () => {
        if (appData.sourceProvider && appData.sourceProvider.removeListener) {
          appData.sourceProvider.removeListener('accountsChanged', handleAccountsChanged);
          appData.sourceProvider.removeListener('chainChanged', handleSourceChainChanged);
          appData.sourceProvider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [appData]);
  return <></>;
};
export default SourceProviderEffect;
