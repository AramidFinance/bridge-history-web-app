import getToken from '../../scripts/common/getToken';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const DestinationTokenConfigurationEffect = () => {
  // const appData = useContext(AppContext);
  /**
   * This effects makes sure that appData.destinationTokenConfiguration is loaded correctly
   */
  /*useEffect(() => {
    if (!appData.publicConfiguration) return;
    if (appData.destinationTokenConfiguration && appData.destinationTokenConfiguration.tokenId == appData.destinationToken) return;
    if (!appData.destinationTokenConfiguration && !appData.destinationToken) return;
    console.debug('tc effect 05');
    if (appData.destinationChain && appData.destinationToken) {
      const conf = getToken(appData.destinationChain, appData.destinationToken, appData.publicConfiguration);
      console.log('appData.destinationChain,destinationToken->destinationTokenConfiguration', conf);
      appData.destinationTokenConfiguration = conf;
      appData.setAppData(appData);
    } else {
      appData.destinationTokenConfiguration = null;
      appData.setAppData(appData);
    }
  }, [appData.destinationChain, appData.destinationToken, appData.publicConfiguration]);*/

  return <></>;
};
export default DestinationTokenConfigurationEffect;
