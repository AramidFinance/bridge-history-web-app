type IProof = {
  sourceNetwork: number;
  sourceTransaction: string;
  sourceAmount: string;
  sourceToken: string;
  sourceAddress: string;

  destinationNetwork: number;
  destinationTransaction: string;
  destinationAmount: string;
  destinationToken: string;
  destinationAddress: string;

  claimNetwork: number;
  claimTransaction: string;

  gasFees: number;
};
export default IProof;
