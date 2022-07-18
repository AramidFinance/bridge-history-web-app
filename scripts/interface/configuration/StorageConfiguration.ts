export enum StorageConfigurationTypeEnum {
  base64Aes256KeyAppIVEnv = 'base64Aes256KeyAppIVEnv',
  plain = 'plain',
}
type StorageConfiguration = {
  encryption: StorageConfigurationTypeEnum;
  data: string;
};
export default StorageConfiguration;
