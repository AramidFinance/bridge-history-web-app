import getToken from '../../scripts/common/getToken';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const SourceTokenConfigurationEffect = () => {
  const appData = useContext(AppContext);
  /**
   * This effects makes sure that appData.sourceTokenConfiguration is loaded correctly
   */
  useEffect(() => {
    if (!appData.publicConfiguration) return;
    if (appData.sourceTokenConfiguration && appData.sourceTokenConfiguration.tokenId == appData.sourceToken) return;
    if (!appData.sourceTokenConfiguration && !appData.sourceToken) return;
    console.debug('tc effect 04');
    if (appData.sourceChain && appData.sourceToken) {
      const conf = getToken(appData.sourceChain, appData.sourceToken, appData.publicConfiguration);
      console.log('appData.sourceChain,sourceToken->sourceTokenConfiguration', conf);
      appData.sourceTokenConfiguration = conf;
      appData.feeToken = appData.sourceToken;
      appData.feeTokenConfiguration = conf;
      appData.setAppData(appData);
    } else {
      appData.sourceTokenConfiguration = null;
      appData.setAppData(appData);
    }
  }, [appData.sourceChain, appData.sourceToken, appData.publicConfiguration]);
  return <></>;
};
export default SourceTokenConfigurationEffect;
