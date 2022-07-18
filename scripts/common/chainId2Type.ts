import ChainTypeEnum from '../interface/mapping/ChainTypeEnum';
import getPublicConfiguration from './getPublicConfiguration';

/**
 * Converts a chain ID to a type of blockchain: e.g., "eth" for EVM, algo for AVM.
 * @param {number | string} chainId - The chain id (EVM standardized + Algorand chains id)
 * @returns - Type of chain: e.g., "eth" for EVM, algo for AVM.
 */
const chainId2Type = async (chainId: number): Promise<ChainTypeEnum> => {
  const publicConfiguration = await getPublicConfiguration(false);
  if (!publicConfiguration.chains[chainId]) return null;
  return publicConfiguration.chains[chainId].type;
};
export default chainId2Type;
