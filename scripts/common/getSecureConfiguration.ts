/**
 * To generate secure key and iv, use openssl rand -hex 16
 */
import getAppConfiguration from './getAppConfiguration';
import CryptoJS from 'crypto-js';
import StorageConfiguration, { StorageConfigurationTypeEnum } from '../interface/configuration/StorageConfiguration';
import SecureConfiguration from '../interface/configuration/SecureConfiguration';
import getLogger from './getLogger';
let currentConfiguration: SecureConfiguration = null;
const getSecureConfiguration = async (): Promise<SecureConfiguration> => {
  const logger = await getLogger();
  try {
    if (currentConfiguration !== null) return currentConfiguration;
    const appConfig = await getAppConfiguration();
    const ivStr: string = process.env.IV;
    const fileStorage: SecureConfiguration = require('../../env/secure.json');
    currentConfiguration = fileStorage;
    return fileStorage;
  } catch (e) {
    logger.error('Error reading secure configuration', e);
    return null;
  }
};
export default getSecureConfiguration;
