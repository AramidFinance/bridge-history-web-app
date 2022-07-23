import { createContext, SetStateAction } from 'react';
import TokenItem from '../scripts/interface/mapping/TokenItem';
import WalletConnect from '@walletconnect/client';
import { IAssetData, IResult } from '../utils/algorand/types';
import ChainItem from '../scripts/interface/mapping/ChainItem';
import TokenBalance from '../scripts/interface/TokenBalance';
import IEthIPFSData from '../scripts/interface/aramid/IEthIPFSData';
import { providers } from 'ethers';
import ChainId2ChainItem from '../scripts/interface/mapping/ChainId2ChainItem';
import AppConfiguration from '../scripts/interface/configuration/AppConfiguration';
import SecureConfiguration from '../scripts/interface/configuration/SecureConfiguration';
import PublicConfigurationRoot from '../scripts/interface/mapping/PublicConfigurationRoot';
import MappingItem from '../scripts/interface/mapping/MappingItem';
import { CovalentTransactionItem } from '../scripts/interface/CovalentTransaction';

export interface IState {
  // Configurations

  appConfiguration: AppConfiguration;
  publicConfiguration: PublicConfigurationRoot;
  secureConfiguration: SecureConfiguration;
  // Interface

  isBridgeTabOpen: boolean;
  isReviewTabOpen: boolean;
  isClaimTabOpen: boolean;
  isMintScreen: boolean;
  requestDestinationTokenBalanceRefresh: boolean;
  bridgeErrorMessage?: string;

  chainConfigs?: ChainId2ChainItem;
  routeConfig?: MappingItem;

  // app

  sourceProvider?: any;
  sourceWeb3Provider?: providers.Web3Provider;
  destinationProvider?: any;
  destinationWeb3Provider?: providers.Web3Provider;

  sourceAddress?: string; // sender address
  sourceChain?: number; // currently selected chain
  sourceChainConfiguration?: ChainItem; // currently selected network
  sourceToken?: string; // currently selected token.
  sourceTokenConfiguration?: TokenItem; // currently selected token.
  connectedSourceChain?: number;
  sourceAmount: string; //base source amount
  sourceAmountFormatted: string; //formatted source amount

  feeToken?: string; // token selected to pay fee with
  feeTokenConfiguration?: TokenItem; // token selected to pay fee with

  destinationAddress?: string; // receiver address
  destinationChain?: number; // currently selected network
  destinationChainConfiguration?: ChainItem; // currently selected network
  destinationToken?: string; //currently selected token.
  destinationTokenConfiguration?: TokenItem; // currently selected network
  destinationAmount: string; //base destination amount
  destinationAmountFormatted: string; //formatted destination amount

  feeAmount: string; //base fee amount
  feeAmountFormatted: string; //formatted fee amount

  connectedDestinationChain?: number;

  sourceAddressBalance?: string; // balance of tokens at the source account

  approvedBalance?: string; // balance of approved source token to be used by the bridge contract

  escrowBalanceIsSufficient?: boolean;
  escrowBalanceIsSufficient10x?: boolean;

  destinationAddressConfirmed?: boolean;
  networksAndDestinationAddressConfirmed?: boolean; // enable/disable NetworkSelect element
  assetAndAmountConfirmed?: boolean; // enable/disable AssetSelect element
  transferApproved?: boolean;
  assetLocked?: boolean;
  assetClaimed?: boolean;
  approvingAndSendingAsset?: boolean; // enable/disable Send element
  approvalTxHash?: string;
  lockAssetHash?: string;
  claimTxHash?: string; // tx hash of claiming the tokens from eth network
  claimDataTxHash?: string; // tx from algo network with IClaim data
  claimData?: IEthIPFSData; // data loaded from ipfs

  // In Case of Algorand Network Selected //
  sourceAlgoConnector?: WalletConnect | null;
  destinationAlgoConnector?: WalletConnect | null;
  algoFetching?: boolean;
  sourceAlgoConnected?: boolean;
  destinationAlgoConnected?: boolean;
  destinationAccountOptedIn?: boolean;
  algoShowModal?: boolean;
  algoPendingRequest?: boolean;
  algoSignedTxns?: Uint8Array[][] | null;
  algoPendingSubmissions?: Array<string | Error>;
  algoUri?: string;
  algoAccounts?: string[];
  algoBridgeAddress?: string;
  algoResult?: IResult | null;
  algoAssets?: IAssetData[];
  destAlgoAssets?: IAssetData[];

  bridgeUserAccounts?: Array<string>;
  bridgeUserOutwardTransactions?: { [key: string]: Array<CovalentTransactionItem> };
  bridgeUserInwardTransactions?: { [key: string]: Array<CovalentTransactionItem> };

  setAppData?: (data: Partial<IState>) => void;
}

export const defaultData: IState = {
  appConfiguration: null,
  publicConfiguration: null,
  secureConfiguration: null,

  isBridgeTabOpen: true,
  isClaimTabOpen: false,
  isReviewTabOpen: false,
  escrowBalanceIsSufficient: true,
  chainConfigs: {},
  isMintScreen: false,
  requestDestinationTokenBalanceRefresh: false,
  sourceAmount: '0',
  sourceAmountFormatted: '0',
  destinationAmount: '0',
  destinationAmountFormatted: '0',
  feeAmount: '0',
  feeAmountFormatted: '0',
};

export const AppContext = createContext<IState>({ ...defaultData });
