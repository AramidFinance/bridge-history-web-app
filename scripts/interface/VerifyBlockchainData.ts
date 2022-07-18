type VerifyBlockchainData = {
  destinationNetwork: number;
  destinationAddress: string;
  destinationToken: string;
  feeAmount: number;
  sourceAmount: string;
  destinationAmount: string;
  note: string;
  destinationNote: string;
  sourceNetwork: number;
  sourceToken: string;
};
export default VerifyBlockchainData;
