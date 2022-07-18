/**
 * this tests that the entered hash *could be a valid hash, not if it exists on chain
 * @param hash
 * @returns
 */
const validAlgoTxHash = (hash: string) => {
  return /^([A-Z0-9]{52})$/.test(hash); // every capital letter and number
};
export default validAlgoTxHash;
