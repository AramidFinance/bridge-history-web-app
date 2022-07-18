import { EntrySequence } from './EntrySequence';
import PayloadEthSignatures from './PayloadEthSignatures';

type Payload = {
  sourceRound: number;
  destinationRound: number;
  feeToken: string;
  sourceChainId: number;
  sourceToken: string;
  sourceTransactionId: string;
  sourceAmount: string;
  sourceAddress: string;
  destinationChainId: number;
  destinationAddress: string;
  destinationAmount: string;
  destinationToken: string;
  signedMessage: string;
  note: string;
  signatures: PayloadEthSignatures;
  entrySequence: EntrySequence;
  time: Date;
};

export default Payload;
