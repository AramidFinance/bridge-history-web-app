/**
 * this tests that the entered hash *could be a valid hash, not if it exists on chain
 * @param hash
 * @returns
 */
const validEthTxHash = (hash: string) => {
  return /^0x([A-Fa-f0-9]{64})$/.test(hash); // hexadecimal
};
export default validEthTxHash;
