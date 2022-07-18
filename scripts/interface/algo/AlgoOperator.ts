type AlgoOperator = {
  sourceTransactionId: string;
  sourceToken: string;
  sourceAmount: string;
  sourceAddress: string;
  sourceRound: number;
  destinationAddress: string;
  destinationAmount: string;
  destinationToken: string;
  note: string;
};
export default AlgoOperator;
