import axios, { AxiosResponse } from "axios";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { CovalentSupportedNetworks, CovalentReturn, CovalentTransaction, CovalentLogEventTransaction } from "../scripts/eth/CovalentTransaction";
import { utils } from "ethers";
import { HistoryTransaction } from "./HistoryTransaction";

export const History = () => {
  const appData = useContext(AppContext);

  const getCovalentAccountTxs = async (chainId: number | string, address: string): Promise<AxiosResponse<CovalentReturn>> => {
    return await axios.get(`https://api.covalenthq.com/v1/${chainId}/address/${address}/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&page-size=1000&key=ckey_2f90828f3f194472a78fab5d931`)
  }

  const ethAddressCompare = (address1: string, address2: string) => {
    return address1.toLowerCase().slice(-40) === address2.toLowerCase().slice(-40);
  }

  const getCovalentAccountBridgeTxs = async (chainId: number | string, address: string) => {
    const covalentReturn = await getCovalentAccountTxs(chainId, address);
    const transactions = covalentReturn.data.data.items;
    // not sure if there's a better way to do case-insensitive string comparisons?
    const userAddress = appData.sourceAddress.toLowerCase();
    const bridgeAddress = appData.chainConfigs[chainId].address.toLowerCase();
    const bridgeTransactions: Array<CovalentTransaction> = [];
    for (let tx of transactions) {
      if (tx.to_address === bridgeAddress) {
        bridgeTransactions.push(tx);
      }
    }
    console.log(`bridge transactions for ${userAddress} on ${chainId}:`, bridgeTransactions);
    const inwardTransactions: Array<CovalentTransaction> = [];
    const outwardTransactions: Array<CovalentTransaction> = [];    
    for (let tx of bridgeTransactions) {     
      for (let i = 0; i < tx.log_events.length; i++) { 
        // each transaction contains "log events" which are basically "microtransactions" that make up the full transaction (not the EA kind)
        // and in an event of tokens being bridged or tokens being claimed, a "Transfer" method will be called as some ERC-20 token would be transferred.
        const logItem: CovalentLogEventTransaction = tx.log_events[i];
        if (logItem.decoded !== null && logItem.decoded.name && logItem.decoded.name.toLowerCase() === "transfer") {
          // the transfer method takes 3 parameters, a "from" address, a "to" address, and a "value" which i'm actually not sure what it does (it isn't amount transferred)
          // index 2 is the "to" address, and if that goes to the user address, it's a self-claim, if it goes the bridge address then it's a token bridge
          // it's indexed where 0 seems to be what the method is referred to, 1 is the "from" address, and 2 is the "to" address
          // and raw_log_data tells us the amount of tokens transferred, confusing but this seems to match all observations
          // the third scenario where it goes to a different address, then it's a claim on behalf of another user, and it won't be included as a transaction  
          const toAddress = logItem.raw_log_topics[2].toLowerCase();
          const chain_id = +chainId;
          const txWithChainId = { ...tx, chain_id }; // adding chain id to each transaction item so we know which chain it's on when displaying in UI
          if (ethAddressCompare(toAddress, userAddress)) {
            inwardTransactions.push(txWithChainId);
          } else if (ethAddressCompare(toAddress, bridgeAddress)) {
            outwardTransactions.push(txWithChainId);
          }
        }
      }
    }
    // console.log(`inward transactions for ${userAddress} on ${chainId}:`, inwardTransactions);
    // console.log(`outward transactions for ${userAddress} on ${chainId}:`, outwardTransactions);
    // console.log('outward:', appData.bridgeUserOutwardTransactions, 'inward:', appData.bridgeUserInwardTransactions)
    if (appData.bridgeUserInwardTransactions === undefined || appData.bridgeUserInwardTransactions === null || appData.bridgeUserInwardTransactions === []) {
      // if there are no transactions then just set it to current transactions
      appData.bridgeUserInwardTransactions = inwardTransactions;
    } else {
      // insert all transactions in reverse chronological order
      // note that i can't just call array.sort since i'm sorting by block signing time and not some value
      let currIndex = 0;
      const appDataInwardTransactions = [...appData.bridgeUserInwardTransactions];
      for (let tx of inwardTransactions) {
        // console.log(tx.block_signed_at, appDataInwardTransactions[currIndex].block_signed_at, tx.block_signed_at > appDataInwardTransactions[currIndex].block_signed_at);
        while (currIndex < appDataInwardTransactions.length && tx.block_signed_at < appDataInwardTransactions[currIndex].block_signed_at) {
          currIndex++;
        };

        if (currIndex < appDataInwardTransactions.length && tx.tx_hash === appDataInwardTransactions[currIndex].tx_hash) {
          return; // if an identical transaction exists then this network was already processed
        } else if (currIndex >= appDataInwardTransactions.length) {
          appDataInwardTransactions.push(tx);
          currIndex = appDataInwardTransactions.length;
        } else {
          // splice doesn't seem to run in O(n) from testing, so this is pretty fast
          // definitely faster than me writing my own sorting algorithm, even if i implement my own timsort
          appDataInwardTransactions.splice(currIndex, 0, tx);          
        }
      }
      console.log('inward transactions:', appDataInwardTransactions);
      appData.bridgeUserInwardTransactions = appDataInwardTransactions;
    }

    // same thing as inward but for outward
    // should've wrote a method for this but i only realized i would need it twice *after i finished writing the first one oops
    if (appData.bridgeUserOutwardTransactions === undefined || appData.bridgeUserOutwardTransactions === null || appData.bridgeUserOutwardTransactions === []) {
      appData.bridgeUserOutwardTransactions = outwardTransactions;
    } else {
      let currIndex = 0;
      const appDataOutwardTransactions = [...appData.bridgeUserOutwardTransactions];
      for (let tx of outwardTransactions) {
        // console.log(tx.block_signed_at, appDataOutwardTransactions[currIndex].block_signed_at, tx.block_signed_at > appDataOutwardTransactions[currIndex].block_signed_at);
        while (currIndex < appDataOutwardTransactions.length && tx.block_signed_at < appDataOutwardTransactions[currIndex].block_signed_at) {
          currIndex++;
        };

        if (currIndex < appDataOutwardTransactions.length && tx.tx_hash === appDataOutwardTransactions[currIndex].tx_hash) {
          return;
        } else if (currIndex >= appDataOutwardTransactions.length) {
          appDataOutwardTransactions.push(tx);
          currIndex = appDataOutwardTransactions.length;
        } else {
          appDataOutwardTransactions.splice(currIndex, 0, tx);
        }
      } 
      console.log('outward transactions:', appDataOutwardTransactions);
      appData.bridgeUserOutwardTransactions = appDataOutwardTransactions;
    }
    appData.setAppData(appData);
  }

  useEffect(() => {
    if (!appData.sourceAddress) return;
    console.log('get covalent with address:', appData.sourceAddress);
    for (let network of Object.keys(appData.chainConfigs)) {
      if (CovalentSupportedNetworks.includes(+network)) {
        console.log('get covalent data for network', network);
        getCovalentAccountBridgeTxs(network, appData.sourceAddress);
      }
    }
  }, [appData.sourceAddress])

  return (
    <div className="flex flex-col my-4 md:w-[600px] 3xl:w-[840px] 4xl:w-[1176px] rounded-[60px] 3xl:rounded-[84px] 4xl:rounded-[118px] 3xl:rounded-[84px] 4xl:rounded-[118px] bg-background-card backdrop-blur border border-dark-elevation border-b border-[#F6F6F61A] justify-center pb-10 self-center drop-shadow-menu-default drop-shadow-menu-2">
      <div className={`self-center flex flex-col text-center mx-6 mt-3 gap-2 text-base 3xl:text-xl 4xl:text-3xl`}>
        <div className="flex text-base font-medium justify-center items-center 3xl:text-2xl 4xl:text-4xl">
          <div
            className={`text-center py-4 3xl:py-8 4xl:py-12 text-xl`}
          >
            Transaction History
          </div>
        </div>
      </div>
      <div>
        <div className="justify-around h-[509px] 3xl:h-[713px] 4xl:h-[997.64px] px-2 overflow-auto scrollbar-thin scrollbar-thumb-history-scrollbar-thumb scrollbar-track-history-scrollbar scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {appData.bridgeUserOutwardTransactions.map((tx) => (
            <div key={tx.tx_hash}>
              <HistoryTransaction transaction={tx} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}