import axios from 'axios';
import AppConfiguration from '../interface/configuration/AppConfiguration';

let config: AppConfiguration = null;

const getAppConfiguration = async () => {
  if (config !== null) return config;
  const response = await axios.get('/config.json');
  if (response.status !== 200) {
    console.error(`Request to /config.json did not returned status 200 (${response.status})`);
    return null;
  }
  config = response.data as AppConfiguration;
  return config;
};
export default getAppConfiguration;
