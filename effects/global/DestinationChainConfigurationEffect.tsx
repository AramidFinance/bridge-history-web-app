import getToken from '../../scripts/common/getToken';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const DestinationChainConfigurationEffect = () => {
  const appData = useContext(AppContext);
  /**
   * This effects makes sure that appData.destinationChainConfiguration is loaded correctly
   */
  useEffect(() => {
    if (appData.destinationChainConfiguration && appData.destinationChainConfiguration.chainId == appData.destinationChain) return;
    if (!appData.destinationChainConfiguration && !appData.destinationChain) return;
    console.log('tc effect 03');

    if (!appData.chainConfigs) return;
    if (appData.destinationChain) {
      const conf = appData.chainConfigs[appData.destinationChain.toString()];
      console.log('appData.sourceChain->sourceChainConfiguration', conf, appData);
      appData.destinationChainConfiguration = conf;
      appData.setAppData(appData);
    } else {
      appData.destinationChainConfiguration = null;
      appData.setAppData(appData);
    }
  }, [appData.destinationChain, appData.destinationChainConfiguration, appData.chainConfigs]);

  return <></>;
};
export default DestinationChainConfigurationEffect;
