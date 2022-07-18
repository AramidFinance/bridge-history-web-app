import algosdk from 'algosdk';
import { apiGetTxnParams } from './api';

export interface ITxn {
  txn: algosdk.Transaction;
  signers?: string[];
  authAddr?: string;
  message?: string;
}

export type TxnReturnType = ITxn[][];

export type Txn = (chain: number, from: string, note: string, bridgeAddress: string, amount: number, assetId?: number) => Promise<TxnReturnType>;

export const singlePayTxn: Txn = async (chain: number, from: string, note: string, bridgeAddress: string, amount: number): Promise<TxnReturnType> => {
  const suggestedParams = await apiGetTxnParams(chain);

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: from,
    to: bridgeAddress,
    amount: amount,
    note: new Uint8Array(Buffer.from(note)),
    suggestedParams,
  });

  const txnsToSign = [
    {
      txn,
      message: `This is a payment transaction that sends ${amount} to Bridge Account ${bridgeAddress}, and note ${note} will receive ${amount}.`,
    },
  ];
  return [txnsToSign];
};

export const zerobridgeAsaTransfer: Txn = async (chain: number, from: string, note: string, bridgeAddress: string, amount: number, assetId: number): Promise<TxnReturnType> => {
  console.log('zerobridge asa transfer:', chain, from, note, bridgeAddress, amount, assetId);
  const suggestedParams = await apiGetTxnParams(chain);
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: from,
    to: bridgeAddress,
    amount: amount,
    note: new Uint8Array(Buffer.from(note)),
    assetIndex: assetId,
    suggestedParams,
  });

  const txnsToSign = [
    {
      txn,
      message: `This is a payment transaction that sends ${amount} to Bridge Account ${bridgeAddress}, and note ${note} will receive ${amount}.`,
    },
  ];
  return [txnsToSign];
};
