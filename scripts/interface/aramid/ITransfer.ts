type ITransfer = {
  destinationNetwork: number;
  destinationAddress: string;
  destinationToken: number | string;
  feeAmount: number;
  sourceAmount: number;
  destinationAmount: number;
  note: string;
};
export default ITransfer;
