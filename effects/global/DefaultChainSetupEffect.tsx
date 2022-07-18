import getToken from '../../scripts/common/getToken';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const DefaultChainSetupEffect = () => {
  const appData = useContext(AppContext);
  /**
   * This effects loads the initial chains from configuration when source or destination chain is empty
   */
  useEffect(() => {
    if (!appData.chainConfigs) return;
    if (!appData.publicConfiguration) return;
    if (!appData.appConfiguration) return;
    if (appData.sourceChain && appData.destinationChain) return;
    console.log('tc effect 01');
    const appConfiguration = appData.appConfiguration;
    console.log('default chains being set appConfig:', appConfiguration);
    const from = appConfiguration.initChainFrom;
    const to = appConfiguration.initChainTo;

    console.debug('tc effect 01 toupdate');
    if (!appData.sourceChain) {
      const conf = appData.chainConfigs[from.toString()];
      appData.sourceChain = from;
      appData.sourceChainConfiguration = conf;
      console.debug(`tc effect 01.set.sourceChain ${appData.sourceChain}`);
    }
    if (!appData.destinationChain) {
      const conf2 = appData.chainConfigs[to.toString()];
      appData.destinationChain = to;
      appData.destinationChainConfiguration = conf2;
      console.debug(`tc effect 01.set.destinationChain ${appData.destinationChain}`);
    }

    if (appConfiguration.initTokenFrom && !appData.sourceToken) {
      console.log('set.sourceToken from init');
      appData.sourceToken = appConfiguration.initTokenFrom;
      appData.feeToken = appConfiguration.initTokenFrom;
      const conf = getToken(appData.sourceChain, appData.sourceToken, appData.publicConfiguration);
      appData.sourceTokenConfiguration = conf;
      appData.feeTokenConfiguration = conf;
      console.debug(`tc effect 01.set.sourceToken ${appData.sourceToken}`);
    }

    if (appConfiguration.initTokenTo && !appData.destinationToken) {
      console.log('set.destinationToken from init');
      appData.destinationToken = appConfiguration.initTokenTo;
      const conf = getToken(appData.destinationChain, appData.destinationToken, appData.publicConfiguration);
      appData.destinationTokenConfiguration = conf;
      console.debug(`tc effect 01.set.destinationToken ${appData.destinationToken}`);
    }

    appData.setAppData(appData);
  }, [appData.chainConfigs, appData.sourceChain, appData.destinationChain, appData.publicConfiguration, appData.appConfiguration]);

  return <></>;
};
export default DefaultChainSetupEffect;
