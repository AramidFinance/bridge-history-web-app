export interface DecodedCovalentLog {
  name: string;
  signature: string;
  params: Array<any>;
}

export interface CovalentLogEventTransaction {
  block_signed_at: string;
  block_height: number;
  tx_offset: number;
  log_offset: number;
  tx_hash: string;
  raw_log_topics: Array<string>;
  sender_contract_decimals: number;
  sender_name: string;
  sender_contract_ticker_symbol: string;
  sender_address: string;
  sender_address_label: string;
  sender_logo_url: string;
  raw_log_data: string;
  decoded: DecodedCovalentLog;
}

export interface CovalentTransactionItem {
  block_signed_at: string;
  block_height: number;
  tx_hash: string;
  tx_offset: number;
  successful: boolean;
  from_address: string;
  from_address_label: string | null;
  to_address: string;
  to_address_label: string | null;
  value: string;
  value_quote: number;
  gas_offered: number;
  gas_spent: number,
  gas_price: number,
  fees_paid: string,
  gas_quote: number | null,
  gas_quote_rate: number | null,
  log_events: Array<CovalentLogEventTransaction>;
}

export interface CovalentTransaction {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: Array<CovalentTransactionItem>;
}