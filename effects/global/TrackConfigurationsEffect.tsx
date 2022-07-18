import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import DefaultChainSetup from './DefaultChainSetupEffect';
import SourceChainConfiguration from './SourceChainConfigurationEffect';
import SourceTokenConfiguration from './SourceTokenConfigurationEffect';
import DestinationChainConfiguration from './DestinationChainConfigurationEffect';
import DestinationTokenConfiguration from './DestinationTokenConfigurationEffect';

const TrackConfigurationsEffect = () => {
  const appData = useContext(AppContext);

  return (
    <>
      <DefaultChainSetup />
      <SourceChainConfiguration />
      <SourceTokenConfiguration />
      <DestinationChainConfiguration />
      <DestinationTokenConfiguration />
    </>
  );
};
export default TrackConfigurationsEffect;
