import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import getSecureConfiguration from '../common/getSecureConfiguration';
import { EthPrivateConfiguration } from '../interface/eth/EthPrivateConfiguration';
import erc20abi from '../../utils/ethereum/erc20abi';
import { AbiItem } from 'web3-utils';

const getEthAccountTokenBalance = async (chainId: number, walletAddress: string, tokenAddress: string): Promise<BigNumber> => {
  const secureConfiguration = await getSecureConfiguration();
  if (!secureConfiguration.chains || !secureConfiguration.chains[chainId]) return null;
  const config = secureConfiguration.chains[chainId] as EthPrivateConfiguration;
  if (!config || config.type !== 'eth') {
    console.error('wrong configuration', config);
    return null;
  }

  console.log('fetching balance on eth of', tokenAddress, 'for', walletAddress, 'on chain', chainId);

  const web3 = new Web3(config.providerUrl);
  let balance: string;

  if (/^0x([0-1]{40})$/.test(tokenAddress)) { // native token
    try {
      balance = await web3.eth.getBalance(walletAddress);
      if (balance === undefined || balance === null) {
        throw 'undefined or null balance';
      }
    } catch (e) {
      console.log('error fetching balance:', e);
      try {
        if (balance === undefined || balance === null || balance === 'NaN') {
          console.log('trying secondary RPC')
          balance = await new Web3(config.providerUrl2).eth.getBalance(walletAddress);
        }
      } catch (e) {
        console.log('error fetching balance from secondary RPC:', e);
        try {
          if (balance === undefined || balance === null || balance === 'NaN') {
            console.log('trying tertiary RPC')
            balance = await new Web3(config.providerUrl3).eth.getBalance(walletAddress);
          }  
        } catch (e) {
          console.log('error fetching balance from tertiary RPC:', e);
          balance = null;
        }
      }
    }
  } else {
    // The minimum ABI to get ERC20 Token balance
    const abi: AbiItem = JSON.parse(JSON.stringify(erc20abi));
    
    let contract = new web3.eth.Contract(abi, tokenAddress);
    try {
      balance = await contract.methods.balanceOf(walletAddress).call();
      if (balance === undefined || balance === null) {
        throw 'undefined or null balance';
      }
    } catch (error) {
      console.log('error fetching balance from primary RPC:', config.providerUrl, error, balance);
      try {
        if (balance === undefined || balance === null) {
          console.log('trying secondary RPC:', config.providerUrl2);
          contract = new new Web3(config.providerUrl2).eth.Contract(abi, tokenAddress);
          balance = await contract.methods.balanceOf(walletAddress).call();
        }
      } catch (err) {
        console.log('error fetching from secondary RPC:', err);
        try {
          if (balance === undefined || balance === null || balance === 'NaN') {
            console.log('trying tertiary RPC:', config.providerUrl3);
            contract = new new Web3(config.providerUrl3).eth.Contract(abi, tokenAddress)
            balance = await contract.methods.balanceOf(walletAddress).call();
          }  
        } catch (e) {
          console.log('error fetching balance from tertiary RPC:', e);
          balance = null;
        }
        balance = null;
      }
    }
  }

  console.log('eth.balance', balance, new BigNumber(balance));
  return new BigNumber(balance);
};

export default getEthAccountTokenBalance;
