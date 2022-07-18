import getToken from '../../scripts/common/getToken';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const SourceChainConfigurationEffect = () => {
  const appData = useContext(AppContext);
  /**
   * This effects makes sure that appData.sourceChainConfiguration is loaded correctly
   */
  useEffect(() => {
    if (!appData.chainConfigs) return;
    if (appData.sourceChainConfiguration && appData.sourceChainConfiguration.chainId == appData.sourceChain) return;
    if (!appData.sourceChainConfiguration && !appData.sourceChain) return;
    console.log('tc effect 02');

    if (appData.sourceChain) {
      const conf = appData.chainConfigs[appData.sourceChain.toString()];
      console.log('appData.sourceChain->sourceChainConfiguration', conf, appData);
      appData.sourceChainConfiguration = conf;
      appData.setAppData(appData);
    } else {
      appData.sourceChainConfiguration = null;
      appData.setAppData(appData);
    }
  }, [appData.sourceChain, appData.sourceChainConfiguration, appData.chainConfigs]);

  return <></>;
};
export default SourceChainConfigurationEffect;
