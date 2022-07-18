export const useContext = true;

/*
THIS FILE IS OBSOLETE IN FAVOR OF Context based state management to ensure type safety state

import WalletConnect from '@walletconnect/client';
import { IAssetData } from './algorand/types';
import { ChainType } from './algorand/api';
import TokenItem from '../scripts/interface/mapping/TokenItem';

interface IResult {
  method: string;
  body: Array<
    Array<{
      txID: string;
      signingfrom?: string;
      signature: string;
    } | null>
  >;
}

interface TokenBalance {
  [key: string]: string; // in base units
}

type StateType = {
  sourceProvider?: any;
  sourceWeb3Provider?: any;
  destinationProvider?: any;
  destinationWeb3Provider?: any;

  sourceChain?: number; // currently selected chain
  sourceToken?: TokenItem; // currently selected token.
  sourceAddress?: string; // sender address

  destinationChain?: number; // currently selected network
  destinationAddress?: string; // receiver address
  destinationToken?: TokenItem; //currently selected token.

  tokenBalance?: TokenBalance; // balance of user tokens
  destTokenBalance?: TokenBalance;
  approvedBalance?: TokenBalance; // balance of tokens approved to be used by the bridge contract

  amount?: number | bigint | string; // amount to send
  destinationAddressConfirmed?: boolean;
  networksAndDestinationAddressConfirmed?: boolean; // enable/disable NetworkSelect element
  assetAndAmountConfirmed?: boolean; // enable/disable AssetSelect element
  transferApproved?: boolean;
  assetLocked?: boolean;
  assetClaimed?: boolean;
  approvingAndSendingAsset?: boolean; // enable/disable Send element
  approvalTxHash?: string;
  lockAssetHash?: string;
  claimTxHash?: string;

  // In Case of Algorand Network Selected //
  sourceAlgoConnector?: WalletConnect | null;
  destinationAlgoConnector?: WalletConnect | null;
  algoFetching?: boolean;
  sourceAlgoConnected?: boolean;
  destinationAlgoConnected?: boolean;
  algoShowModal?: boolean;
  algoPendingRequest?: boolean;
  algoSignedTxns?: Uint8Array[][] | null;
  algoPendingSubmissions?: Array<number | Error>;
  algoUri?: string;
  algoAccounts?: string[];
  algoBridgeAddress?: string;
  algoResult?: IResult | null;
  algoChain?: ChainType;
  algoAssets?: IAssetData[];
  destAlgoAssets?: IAssetData[];
};

type ActionType =
  | {
      type: 'SET_SOURCE_WEB3_PROVIDER';
      sourceProvider?: StateType['sourceProvider'];
      sourceWeb3Provider?: StateType['sourceWeb3Provider'];
      sourceAddress?: StateType['sourceAddress'];
      sourceChainId?: StateType['sourceChainId'];
      sourceBlockExplorer?: StateType['sourceBlockExplorer'];
    }
  | {
      type: 'SET_DESTINATION_WEB3_PROVIDER';
      destinationProvider?: StateType['destinationProvider'];
      destinationWeb3Provider?: StateType['destinationWeb3Provider'];
      destinationAddress?: StateType['destinationAddress'];
      destinationChainId?: StateType['destinationChainId'];
      destinationBlockExplorer?: StateType['destinationBlockExplorer'];
    }
  | {
      type: 'SET_SOURCE_ADDRESS';
      sourceAddress?: StateType['sourceAddress'];
    }
  | {
      type: 'SET_SOURCE_NETWORK';
      sourceNetwork?: StateType['sourceNetwork'];
    }
  | {
      type: 'SET_SOURCE_TOKEN';
      sourceToken?: StateType['sourceToken'];
    }
  | {
      type: 'SET_SOURCE_CHAIN_ID';
      sourceChainId?: StateType['sourceChainId'];
    }
  | {
      type: 'SET_DESTINATION_CHAIN_ID';
      destinationChainId?: StateType['destinationChainId'];
    }
  | {
      type: 'SET_DESTINATION_NETWORK';
      destinationNetwork?: StateType['destinationNetwork'];
    }
  | {
      type: 'SET_CLAIM_NETWORK';
      claimNetwork?: StateType['claimNetwork'];
    }
  | {
      type: 'SET_DESTINATION_TOKEN';
      destinationToken?: StateType['destinationToken'];
    }
  | {
      type: 'SET_DESTINATION_ADDRESS';
      destinationAddress?: StateType['destinationAddress'];
    }
  | {
      type: 'SET_AMOUNT';
      amount?: StateType['amount'];
    }
  | {
      type: 'SET_TOKEN_BALANCE';
      tokenBalance?: StateType['tokenBalance'];
    }
  | {
      type: 'SET_DEST_TOKEN_BALANCE';
      destTokenBalance?: StateType['destTokenBalance'];
    }
  | {
      type: 'SET_APPROVED_BALANCE';
      approvedBalance?: StateType['approvedBalance'];
    }
  | {
      type: 'CONFIRM_DESTINATION_ADDRESS';
      destinationAddressConfirmed?: StateType['destinationAddressConfirmed'];
    }
  | {
      type: 'CONFIRM_NETWORKS_AND_DESTINATION_ADDRESS';
      networksAndDestinationAddressConfirmed?: StateType['networksAndDestinationAddressConfirmed'];
    }
  | {
      type: 'SET_APPROVING_AND_SENDING_ASSET';
      approvingAndSendingAsset?: StateType['approvingAndSendingAsset'];
    }
  | {
      type: 'CONFIRM_ASSET_AND_AMOUNT';
      assetAndAmountConfirmed?: StateType['assetAndAmountConfirmed'];
    }
  | {
      type: 'APPROVE_TRANSFER';
      transferApproved?: StateType['transferApproved'];
    }
  | {
      type: 'LOCK_ASSET';
      assetLocked?: StateType['assetLocked'];
    }
  | {
      type: 'CLAIM_ASSET';
      assetClaimed?: StateType['assetClaimed'];
    }
  | {
      type: 'SET_APPROVAL_TX_HASH';
      approvalTxHash?: StateType['approvalTxHash'];
    }
  | {
      type: 'SET_LOCK_ASSET_HASH';
      lockAssetHash?: StateType['lockAssetHash'];
    }
  | {
      type: 'SET_CLAIM_TX_HASH';
      claimTxHash?: StateType['claimTxHash'];
    }
  | {
      type: 'RESET_INPUTS';
      amount?: StateType['amount'];
      tokenBalance?: StateType['tokenBalance'];
      sourceToken?: StateType['sourceToken'];
      destinationToken?: StateType['destinationToken'];
      destinationAddress?: StateType['destinationAddress'];
      destinationAddressConfirmed?: StateType['destinationAddressConfirmed'];
      assetAndAmountConfirmed?: StateType['assetAndAmountConfirmed'];
      transferApproved?: StateType['transferApproved'];
      assetLocked?: StateType['assetLocked'];
      approvalTxHash?: StateType['approvalTxHash'];
      lockAssetHash?: StateType['lockAssetHash'];
    }
  | {
      type: 'RESET_SOURCE_WEB3_PROVIDER';
    }
  | {
      type: 'RESET_DESTINATION_WEB3_PROVIDER';
    }
  | {
      type: 'SET_SOURCE_ALGO_CONNECTOR';
      sourceAlgoConnector: StateType['sourceAlgoConnector'];
    }
  | {
      type: 'SET_DESTINATION_ALGO_CONNECTOR';
      destinationAlgoConnector: StateType['destinationAlgoConnector'];
    }
  | {
      type: 'SET_SOURCE_ALGO_CONNECTED';
      sourceAlgoConnected: StateType['sourceAlgoConnected'];
    }
  | {
      type: 'SET_DESTINATION_ALGO_CONNECTED';
      destinationAlgoConnected: StateType['destinationAlgoConnected'];
    }
  | { type: 'SET_ALGO_ACCOUNTS'; algoAccounts: StateType['algoAccounts'] }
  | { type: 'SET_ALGO_CHAINTYPE'; algoChain: StateType['algoChain'] }
  | { type: 'RESET_INITIAL_STATE' }
  | { type: 'SET_ALGO_FETCHING'; algoFetching: StateType['algoFetching'] }
  | {
      type: 'SET_ALGO_ASSETS';
      algoAssets: StateType['algoAssets'];
    }
  | {
      type: 'SET_DEST_ALGO_ASSETS';
      destAlgoAssets: StateType['destAlgoAssets'];
    }
  | {
      type: 'SHOW_ALGO_MODAL';
      algoShowModal?: StateType['algoShowModal'];
      algoPendingSubmissions?: StateType['algoPendingSubmissions'];
    }
  | {
      type: 'SET_ALGO_PENDING_REQUEST';
      algoPendingRequest: StateType['algoPendingRequest'];
    }
  | {
      type: 'SET_ALGO_SIGNED_TXNS';
      sourceAlgoConnector: StateType['sourceAlgoConnector'];
      algoPendingRequest: StateType['algoPendingRequest'];
      algoSignedTxns: StateType['algoSignedTxns'];
    }
  | {
      type: 'SET_ALGO_RESULT';
      algoResult: StateType['algoResult'];
    }
  | {
      type: 'SET_ALGO_PENDING_SUBMISSIONS';
      algoPendingSubmissions: StateType['algoPendingSubmissions'];
    }
  | {
      type: 'SOFT_DISCONNECT';
    }
  | { type: 'SET_SOURCE_BLOCK_EXPLORER'; sourceBlockExplorer: StateType['sourceBlockExplorer'] }
  | { type: 'SET_DESTINATION_BLOCK_EXPLORER'; destinationBlockExplorer: StateType['destinationBlockExplorer'] };

const initialState: StateType = {
  sourceProvider: null,
  sourceWeb3Provider: null,
  destinationProvider: null,
  destinationWeb3Provider: null,
  sourceNetwork: 4,
  sourceAddress: '',
  sourceToken: null,
  destinationToken: null,
  sourceChainId: null as number,
  destinationChainId: null as number,
  sourceBlockExplorer: 'https://etherscan.io/tx/' as string,
  destinationBlockExplorer: 'https://etherscan.io/tx/' as string,
  amount: 0,
  tokenBalance: {},
  destTokenBalance: {},
  destinationAddress: '',
  destinationNetwork: '101001',
  claimNetwork: undefined,
  destinationAddressConfirmed: false,
  networksAndDestinationAddressConfirmed: false,
  assetAndAmountConfirmed: false,
  approvingAndSendingAsset: false,
  transferApproved: false,
  assetLocked: false,
  approvalTxHash: '',
  lockAssetHash: '',
  claimTxHash: '',
  assetClaimed: false,
  // Algorand
  sourceAlgoConnector: null,
  destinationAlgoConnector: null,
  algoFetching: false,
  sourceAlgoConnected: false,
  destinationAlgoConnected: false,
  algoShowModal: false,
  algoPendingRequest: false,
  algoSignedTxns: null,
  algoPendingSubmissions: [],
  algoUri: '',
  algoAccounts: [],
  algoBridgeAddress: '',
  algoResult: null,
  algoChain: ChainType.TestNet,
  algoAssets: [],
  destAlgoAssets: [],
};

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_SOURCE_WEB3_PROVIDER':
      return {
        ...state,
        sourceProvider: action.sourceProvider,
        sourceWeb3Provider: action.sourceWeb3Provider,
        sourceAddress: action.sourceAddress,
        sourceChainId: action.sourceChainId,
        sourceBlockExplorer: action.sourceBlockExplorer,
      };
    case 'SET_DESTINATION_WEB3_PROVIDER':
      return {
        ...state,
        destinationProvider: action.destinationProvider,
        destinationWeb3Provider: action.destinationWeb3Provider,
        destinationAddress: action.destinationAddress,
        destinationChainId: action.destinationChainId,
        destinationBlockExplorer: action.destinationBlockExplorer,
      };
    case 'SET_SOURCE_ADDRESS':
      return {
        ...state,
        sourceAddress: action.sourceAddress,
      };
    case 'SET_SOURCE_NETWORK':
      return {
        ...state,
        sourceNetwork: action.sourceNetwork,
      };
    case 'SET_SOURCE_CHAIN_ID':
      return {
        ...state,
        sourceChainId: action.sourceChainId,
      };
    case 'SET_DESTINATION_CHAIN_ID':
      return {
        ...state,
        destinationChainId: action.destinationChainId,
      };
    case 'SET_DESTINATION_ADDRESS':
      return {
        ...state,
        destinationAddress: action.destinationAddress,
      };
    case 'SET_DESTINATION_NETWORK':
      return {
        ...state,
        destinationNetwork: action.destinationNetwork,
      };
    case 'SET_CLAIM_NETWORK':
      return {
        ...state,
        claimNetwork: action.claimNetwork,
      };
    case 'SET_DESTINATION_TOKEN':
      return {
        ...state,
        destinationToken: action.destinationToken,
      };
    case 'SET_SOURCE_TOKEN':
      return {
        ...state,
        sourceToken: action.sourceToken,
      };
    case 'SET_AMOUNT':
      return {
        ...state,
        amount: action.amount,
      };
    case 'SET_TOKEN_BALANCE':
      return {
        ...state,
        tokenBalance: action.tokenBalance,
      };
    case 'SET_DEST_TOKEN_BALANCE':
      return {
        ...state,
        destTokenBalance: action.destTokenBalance,
      };
    case 'SET_APPROVED_BALANCE':
      return {
        ...state,
        approvedBalance: action.approvedBalance,
      };
    case 'CONFIRM_DESTINATION_ADDRESS': // NetworkSelect element is in viewOnly when dest address is confirmed
      return {
        ...state,
        destinationAddressConfirmed: action.destinationAddressConfirmed,
      };
    case 'CONFIRM_NETWORKS_AND_DESTINATION_ADDRESS': // NetworkSelect element is in viewOnly when dest address is confirmed
      return {
        ...state,
        networksAndDestinationAddressConfirmed: action.networksAndDestinationAddressConfirmed,
      };
    case 'CONFIRM_ASSET_AND_AMOUNT':
      return {
        ...state,
        assetAndAmountConfirmed: action.assetAndAmountConfirmed,
      };
    case 'APPROVE_TRANSFER':
      return {
        ...state,
        transferApproved: action.transferApproved,
      };
    case 'SET_APPROVING_AND_SENDING_ASSET':
      return {
        ...state,
        approvingAndSendingAsset: action.approvingAndSendingAsset,
      };
    case 'LOCK_ASSET':
      return {
        ...state,
        assetLocked: action.assetLocked,
      };
    case 'CLAIM_ASSET':
      return {
        ...state,
        assetClaimed: action.assetClaimed,
      };
    case 'SET_APPROVAL_TX_HASH':
      return {
        ...state,
        approvalTxHash: action.approvalTxHash,
      };
    case 'SET_LOCK_ASSET_HASH':
      return {
        ...state,
        lockAssetHash: action.lockAssetHash,
      };
    case 'SET_CLAIM_TX_HASH':
      return {
        ...state,
        claimTxHash: action.claimTxHash,
      };
    case 'RESET_INPUTS':
      return {
        ...state,
        amount: 0,
        sourceToken: null,
        destinationToken: null,
        tokenBalance: {},
        destinationAddress: '',
        destinationAddressConfirmed: false,
        assetAndAmountConfirmed: false,
        transferApproved: false,
        assetLocked: false,
        approvalTxHash: '',
        lockAssetHash: '',
      };
    case 'RESET_SOURCE_WEB3_PROVIDER':
      return {
        ...state,
        sourceProvider: null,
        sourceWeb3Provider: null,
        sourceAddress: '',
        sourceChainId: null,
        sourceBlockExplorer: 'https://etherscan.io/tx/' as string,
      };
    case 'RESET_DESTINATION_WEB3_PROVIDER':
      return {
        ...state,
        destinationProvider: null,
        destinationWeb3Provider: null,
        destinationAddress: '',
        destinationChainId: null,
        destinationBlockExplorer: 'https://etherscan.io/tx/' as string,
      };
    case 'SET_SOURCE_ALGO_CONNECTOR':
      return {
        ...state,
        sourceAlgoConnector: action.sourceAlgoConnector,
      };
    case 'SET_DESTINATION_ALGO_CONNECTOR':
      return {
        ...state,
        destinationAlgoConnector: action.destinationAlgoConnector,
      };
    case 'SET_SOURCE_ALGO_CONNECTED':
      return { ...state, sourceAlgoConnected: action.sourceAlgoConnected };
    case 'SET_DESTINATION_ALGO_CONNECTED':
      return { ...state, destinationAlgoConnected: action.destinationAlgoConnected };
    case 'SET_ALGO_ACCOUNTS':
      return { ...state, algoAccounts: action.algoAccounts };
    case 'SET_ALGO_CHAINTYPE':
      return { ...state, algoChain: action.algoChain };
    case 'RESET_INITIAL_STATE':
      return initialState;
    case 'SET_ALGO_FETCHING':
      return { ...state, algoFetching: action.algoFetching };
    case 'SET_ALGO_ASSETS':
      return {
        ...state,
        algoAssets: action.algoAssets,
      };
    case 'SET_DEST_ALGO_ASSETS':
      return {
        ...state,
        destAlgoAssets: action.destAlgoAssets,
      };
    case 'SHOW_ALGO_MODAL':
      return {
        ...state,
        algoShowModal: action.algoShowModal,
        algoPendingSubmissions: [],
      };
    case 'SET_ALGO_PENDING_REQUEST':
      return {
        ...state,
        algoPendingRequest: action.algoPendingRequest,
      };

    case 'SET_ALGO_SIGNED_TXNS':
      return {
        ...state,
        sourceAlgoConnector: action.sourceAlgoConnector,
        algoPendingRequest: action.algoPendingRequest,
        algoSignedTxns: action.algoSignedTxns,
      };
    case 'SET_ALGO_RESULT':
      return {
        ...state,
        algoResult: action.algoResult,
      };
    case 'SET_ALGO_PENDING_SUBMISSIONS':
      return {
        ...state,
        algoPendingSubmissions: action.algoPendingSubmissions,
      };
    case 'SET_SOURCE_BLOCK_EXPLORER':
      return {
        ...state,
        sourceBlockExplorer: action.sourceBlockExplorer,
      };
    case 'SET_DESTINATION_BLOCK_EXPLORER':
      return {
        ...state,
        destinationBlockExplorer: action.destinationBlockExplorer,
      };
    case 'SOFT_DISCONNECT':
      return {
        ...state,
        sourceWeb3Provider: null,
        sourceAlgoConnector: null,
        destinationWeb3Provider: null,
        destinationAlgoConnector: null,
      };
    default:
      throw new Error();
  }
}

export { initialState, reducer };
export type { TokenBalance, StateType, ActionType };
*/
