import { CovalentLogEventTransaction, CovalentTransaction } from "../scripts/eth/CovalentTransaction";
import { useEffect, useState } from "react";
import { StaticImageData } from "next/image";
import Image from "next/image";
import ChainId2ChainItem from "../scripts/interface/mapping/ChainId2ChainItem";
import ethLogo from '../assets/logos/chains/ethereum.png';
import algoLogo from '../assets/logos/chains/algorand.png';
import auroraLogo from '../assets/logos/chains/aurora.svg';
import maticLogo from '../assets/logos/chains/polygon-matic-logo.png';
import circle from '../assets/circle.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import getChainConfiguration from "../scripts/common/getChainConfiguration";
import { BigNumber } from "ethers";

export const HistoryTransaction = (props: {transaction: CovalentTransaction}): JSX.Element => {
  const { transaction } = props;
  const [chains, setChains] = useState<ChainId2ChainItem>({})
  const [token, setToken] = useState('');
  const [amount, setAmount] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [hash, setHash] = useState(transaction.tx_hash);
  const [chainLogo, setChainLogo] = useState<StaticImageData>(circle);
  const [tokenLogo, setTokenLogo] = useState<StaticImageData>(circle);
  const [blockExplorer, setBlockExplorer] = useState('https://etherscan.io/tx/');
  const [amountLengthDiff, setAmountLengthDiff] = useState(0);

  const formatBaseAmount = (amount: string, decimals: number): string => {
    const amount1 = parseInt(amount) / 10 ** decimals;
    const amount2 = parseFloat(amount1.toString());
    const strAmount = amount2.toString();
    if (strAmount.length > 7) {
      return strAmount.substring(0, 6) + '…';
    } else {
      return strAmount;
    }
  };  

  const shortenHash = (hash: string): string => {
    return hash.substring(0, 6) + '...' + hash.substring(hash.length - 6, hash.length);
  };

  const getLogo = (chainId: number): StaticImageData => {
    if (chainId === 1 || chainId === 3 || chainId === 4 || chainId === 42 ) {
      return ethLogo;
    } else if (chainId === 137 || chainId === 80001) {
      return maticLogo;
    } else if (chainId === 100101) {
      return algoLogo;
    } else if (chainId === 1313161554 || chainId === 1313161555) {
      return auroraLogo;
    }
  }

  useEffect(() => {
    setChainLogo(getLogo(transaction.chain_id));
    const time = new Date(transaction.block_signed_at);
    setFormattedTime(time.toLocaleTimeString(Intl.DateTimeFormat().resolvedOptions().locale, {timeZoneName: "short"}));
    setFormattedDate(time.toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {year:'numeric', month: 'long', day:'numeric'}));
    getChainConfiguration(transaction.chain_id).then(config => {
      setBlockExplorer(config.blockExplorers[0]);
    });
    const logEvents: Array<CovalentLogEventTransaction> = transaction.log_events;
    for (let i = 0; i < logEvents.length; i++) {
      const currEvent = logEvents[i];
      if (currEvent.decoded !== null && currEvent.decoded.name === 'Transfer') {
        const unformattedAmount = BigNumber.from(currEvent.raw_log_data);
        const formattedAmount = formatBaseAmount(unformattedAmount.toString(), currEvent.sender_contract_decimals);
        setAmount(formattedAmount);
        setToken(currEvent.sender_contract_ticker_symbol);
      }
    }
  }, []);

  return (
    <div className="my-2 mx-3 rounded-full bg-history-tx py-1 px-2 flex justify-between">
      <div
        className={`bg-gradient-[97deg] from-network-img-tl to-network-img-br shadow-history-network w-[44px] h-[44px] rounded-full p-2 mr-2.5`}
      >
        <Image src={chainLogo} width={'30px'} height={'30px'} />
      </div>
      <a className="flex self-center hover:cursor-pointer hover:text-slate-400 font-mono select-none transition ease-in-out duration-100" href={`${blockExplorer}${hash}`} target='_blank' rel="noreferrer">
        {shortenHash(transaction.tx_hash)}
        <FontAwesomeIcon icon={faExternalLinkAlt as IconProp} className="ml-2 h-4 w-4 self-center font-thin"/>
      </a>
      <div
        className={`bg-gradient-[97deg] from-token-img-tl to-network-img-br shadow-token-default rounded-full p-2 py-auto mx-2.5 my-0.5 text-lg text-center font-mono w-1/4`}
      >
        {amount + ' ' + token}
      </div>
      <div className="flex flex-col text-base w-1/4">
        <div>{formattedDate}</div>
        <div>{formattedTime}</div>
      </div>
    </div>
  )
}