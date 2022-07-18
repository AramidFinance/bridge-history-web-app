type AppConfiguration = {
  debug: boolean;
  soldierId: string;
  mainNetwork: number;
  mainToken: number;
  configurationAddress: string;
  useFilesystemPublicConfiguration: boolean;
  environment: string;
  encryptionKey: string;
  initChainFrom: number;
  initChainTo: number;
  initTokenFrom: string;
  initTokenTo: string;
};
export default AppConfiguration;
