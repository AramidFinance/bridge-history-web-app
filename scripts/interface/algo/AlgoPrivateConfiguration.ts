import { Account } from './Account';
import { NodeConfiguration } from './NodeConfiguration';

export type AlgoPrivateConfiguration = {
  type: string;
  algod: NodeConfiguration;
  indexer: NodeConfiguration;
};
