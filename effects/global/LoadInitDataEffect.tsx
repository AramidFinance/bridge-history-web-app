import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import getAppConfiguration from '../../scripts/common/getAppConfiguration';
import getPublicConfiguration from '../../scripts/common/getPublicConfiguration';
import getSecureConfiguration from '../../scripts/common/getSecureConfiguration';
import getChains from '../../scripts/common/getChains';
import ChainId2ChainItem from '../../scripts/interface/mapping/ChainId2ChainItem';
import getChainConfiguration from '../../scripts/common/getChainConfiguration';

const LoadInitDataEffect = () => {
  const appData = useContext(AppContext);

  /**
   * Initial configuration load
   */
  useEffect(() => {
    console.debug('index effect 01');

    const exec = async () => {
      appData.appConfiguration = await getAppConfiguration();
      appData.publicConfiguration = await getPublicConfiguration(false);
      appData.secureConfiguration = await getSecureConfiguration();

      const chains = await getChains();
      const chainConfigs: ChainId2ChainItem = {};
      const chainIds = Object.keys(chains);
      for (let chain of chainIds) {
        const chainId = parseInt(chain);
        const chainConfig = await getChainConfiguration(chainId);
        chainConfigs[chainId] = chainConfig;
      }
      appData.chainConfigs = chainConfigs;
      appData.setAppData(appData);
    };
    exec().catch(console.error);
  }, []);
  return <></>;
};
export default LoadInitDataEffect;
