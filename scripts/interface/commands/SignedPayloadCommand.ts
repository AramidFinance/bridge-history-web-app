import Payload from '../Payload';

type SignedPayload = {
  command: string;
  payload: Payload;
};

export default SignedPayload;
