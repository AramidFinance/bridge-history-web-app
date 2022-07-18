import IProof from './aramid/IProof';

export enum StateTypeEnum {
  Processed = 'processed',
  Submitting = 'submitting',
}

type PayloadState = {
  state: StateTypeEnum;
  time: Date;
  proof: IProof;
};
export default PayloadState;
