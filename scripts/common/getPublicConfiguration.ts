import getAlgorandConfigTransaction from '../algo/getAlgorandConfigTransaction';
import IConfig from '../interface/aramid/IConfig';
import PublicConfigurationRoot from '../interface/mapping/PublicConfigurationRoot';
import getAppConfiguration from './getAppConfiguration';
const fileMapping: PublicConfigurationRoot = require('../../env/public-configuration.ipfs.json');
import CryptoJS from 'crypto-js';
import getLogger from './getLogger';
import loadIPFSFile from '../ipfs/loadFile';

let currentMapping: PublicConfigurationRoot = null;
const getPublicConfiguration = async (reload: boolean): Promise<PublicConfigurationRoot> => {
  const logger = await getLogger();
  try {
    if (!reload) {
      if (currentMapping !== null) return currentMapping;
    }
    const appConfiguration = await getAppConfiguration();
    console.log('appConfiguration', appConfiguration);
    if (appConfiguration.useFilesystemPublicConfiguration) {
      const copy = { ...fileMapping };
      copy.hash = CryptoJS.SHA256(JSON.stringify(fileMapping)).toString();
      logger.info(`${new Date()} Loaded configuration from localstorage. Hash: ${copy.hash}`);
      currentMapping = copy;
      return currentMapping;
    }
    const controlTx = await getAlgorandConfigTransaction(appConfiguration.mainToken, appConfiguration.mainNetwork, appConfiguration.configurationAddress);
    if (!controlTx) {
      throw 'Unable to load configuration';
    }
    let note = Buffer.from(controlTx.note, 'base64').toString('utf-8');
    if (!note.startsWith('aramid-config/v1:j')) {
      throw 'Unable to load configuration';
    }
    note = note.replace('aramid-config/v1:j', '');
    const configMessage: IConfig = JSON.parse(note);
    const web = `https://ipfs.infura.io/ipfs/${configMessage.ipfsHash}`;
    const data = await loadIPFSFile(configMessage.ipfsHash);
    const mappingFromWeb: PublicConfigurationRoot = data;
    mappingFromWeb.hash = CryptoJS.SHA256(JSON.stringify(mappingFromWeb)).toString();
    currentMapping = mappingFromWeb;
    logger.info(`${new Date()} Loaded configuration from ${web}. Hash: ${mappingFromWeb.hash}`);
    console.log('loaded configuration from ipfs:', currentMapping);
    return mappingFromWeb;
  } catch (e) {
    logger.error('error loading mapping', e);
  }
};
export default getPublicConfiguration;
