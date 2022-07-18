import ChainInfo from './ChainInfo';

type IEthIPFSData = {
  destinationChainData: ChainInfo; 
  destinationRound: number;
  maxClaimRound: number;
  note: string;
  signatures: Array<string>;
  sourceChainData: ChainInfo;
  sourceRound: number;
  sourceTransactionId: string;
};
export default IEthIPFSData;
