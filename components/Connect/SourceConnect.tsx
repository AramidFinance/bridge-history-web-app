import { useState, useCallback, useEffect, useContext } from 'react';
import { connect as connectAlgoWalletConnect, disconnect as disconnectAlgoWalletConnect } from './AlgoConnectors/WalletConnect';
import { providers } from 'ethers';
import { IInternalEvent } from '@walletconnect/types';
import walletConnectLogo from '../../assets/walletconnect-circle-white.png';
import peraLogo from '../../assets/peralogo.png';
import Wallet from './Wallet';
import { AppContext } from '../../context/AppContext';
import getWeb3Modal from '../../scripts/eth/getWeb3Modal';
import shortenAddress from '../../scripts/common/shortenAddress';
import getChainType from '../../scripts/common/getChainType';

const SourceConnect = (): JSX.Element => {
  const appData = useContext(AppContext);
  const [connected, setConnected] = useState(false);
  const [connectingAlgo, setConnectingAlgo] = useState(false);

  const web3Modal = getWeb3Modal(typeof window !== 'undefined' ? window : null);
  useEffect(() => {
    console.debug('srcconn effect 01');
    // on component load, if either of these are defined then the wallet has already been connected
    // this is useful when the "edit" or the "reset" button are pressed on the Review page
    if (!!appData.sourceAlgoConnector || !!appData.sourceWeb3Provider) {
      setConnected(true);
    }
  }, [appData.sourceAlgoConnector, appData.sourceWeb3Provider]);

  useEffect(() => {
    setConnected(appData.connectedSourceChain && appData.connectedSourceChain == appData.sourceChain);
  }, [appData.connectedSourceChain, appData.sourceChain]);

  useEffect(() => {
    console.debug('srcconn effect 02');
    if (appData.sourceAddress == '') {
      try {
        web3Modal.clearCachedProvider();
      } catch (e) {
        console.log('error clearing cached provider:', e);
      }
    }
  }, [appData.sourceAddress]);

  const setEth = async (provider: any) => {
    if (provider == null) return;
    const web3Provider = new providers.Web3Provider(provider, 'any');
    const signer = web3Provider.getSigner();
    const sourceAddress = await signer.getAddress();
    const network = await web3Provider.getNetwork();
    console.log('set.sourceProvider from setEth');
    appData.sourceProvider = provider;
    appData.sourceWeb3Provider = web3Provider;
    appData.sourceAddress = sourceAddress;
    appData.connectedSourceChain = network.chainId;
    appData.setAppData(appData);
  };

  const connectEth = useCallback(
    async function () {
      console.debug('useCallback connectEth');
      // connects to web3 wallet
      let provider;
      try {
        provider = await web3Modal.connect();
        appData.connectedSourceChain = appData.sourceChain;
        appData.sourceWeb3Provider = provider;
        appData.setAppData(appData);
      } catch (error) {
        console.log('error connecting: ', error);
        // reset source network if something goes awry with connecting to wallet
        return null;
      }
      return provider;
    },
    [appData]
  );

  const disconnectEth = useCallback(async function () {
    try {
      console.debug('useCallback disconnectEth');
      web3Modal.clearCachedProvider();
      return true;
    } catch (err) {
      console.log('error disconnecting: ', err);
      return false;
    }
  }, []);
  /**
   * Subscribes to events from the Wallet Connect instance
   */
  const subscribeToEvents = async (connector: any) => {
    const connectorInstance = connector;
    if (!connectorInstance) {
      throw new Error('There is no connector instance');
    }

    connectorInstance.on('session_update', async (error: Error | null, payload: any | null) => {
      console.log(`connectorInstance.on("session_update")`);

      if (error) {
        throw error;
      }

      const { accounts } = payload.params[0];
      onSessionUpdate(accounts);
    });

    connectorInstance.on('connect', (error: Error | null, payload: any | null) => {
      console.log(`connectorInstance.on("connect")`, payload);

      if (error) {
        throw error;
      }

      onConnect(payload);
    });

    connectorInstance.on('disconnect', (error: Error | null, payload: any | null) => {
      console.log(`connectorInstance.on("disconnect")`);

      if (error) {
        throw error;
      }

      // onDisconnect();
    });

    if (connectorInstance.connected) {
      console.log('Algo Connected');
      const { accounts } = connectorInstance;

      onSessionUpdate(accounts);
    }
  };

  /**
   * Function called upon connection of Wallet Connect instance. Populates fields of the component state: sourceAddress, algoConnected and algoAccounts.
   * @param {IInternalEvent} payload - The event emitted by the Wallet connect bridge.
   */
  const onConnect = async (payload: IInternalEvent) => {
    const { accounts } = payload.params[0];
    const address = accounts[0];
    console.log('onConnect.connectedSourceChain.set', appData.sourceChain);
    appData.sourceAddress = address;
    appData.algoAccounts = accounts;
    appData.connectedSourceChain = appData.sourceChain;
    appData.setAppData(appData);
    return;
    // getAccountAssets(sourceAlgorandAddress);
  };

  /**
   * Function called upon session update from Wallet Connect.
   * @param accounts - Accounts linked to Algorand wallet connected to WC.
   */
  const onSessionUpdate = async (accounts: string[]) => {
    const address = accounts[0];
    appData.sourceAddress = address;
    appData.algoAccounts = accounts;
    appData.connectedSourceChain = appData.sourceChain;
    appData.setAppData(appData);

    return;
    // await getAccountAssets(sourceAlgorandAddress);
  };

  const setAlgo = async (connector: any) => {
    if (!!connector) {
      if (connector.accounts && connector.accounts.length > 0) {
        appData.sourceAddress = connector.accounts[0];
      }
      appData.sourceAlgoConnector = connector;
      appData.sourceAlgoConnected = true;
      appData.algoAccounts = connector.accounts;
      appData.setAppData(appData);
    }
  };

  const connectAlgo = () => {
    connectAlgoWalletConnect().then((connector: any) => {
      setAlgo(connector);
      subscribeToEvents(connector);
      setConnectingAlgo(false);
    });
  };

  const connect = () => {
    if (appData.sourceChainConfiguration && appData.sourceChainConfiguration.type === 'eth') {
      connectEth().then((provider: any) => {
        setEth(provider);
      });
    } else if (appData.sourceChainConfiguration && appData.sourceChainConfiguration.type === 'algo') {
      /*connectAlgoWalletConnect().then((connector: any) => {
        setAlgo(connector);
        subscribeToEvents(connector);
      });*/
      setConnectingAlgo(true);
    }
  };

  /**
   * This effect disconnects the source chain if user selects different type of chain.. eg if user connected to eth and selects algo chain
   */
  useEffect(() => {
    if (!appData.publicConfiguration) return;
    if (!appData.connectedSourceChain) return; // do not disconnect if we are not connected
    if (appData.connectedSourceChain == appData.sourceChain) return;
    const connectedType = getChainType(appData.connectedSourceChain, appData.publicConfiguration);
    const selectedType = getChainType(appData.sourceChain, appData.publicConfiguration);
    if (connectedType == selectedType) return;
    console.debug(`Disconnect because chain types are different Selected:${appData.sourceChain}=${selectedType} Connected:${appData.connectedSourceChain}=${connectedType}`);
    disconnect();
  }, [appData.connectedSourceChain, appData.sourceChain, appData.publicConfiguration]);

  const disconnect = () => {
    if (appData.sourceChainConfiguration && appData.sourceChainConfiguration.type === 'eth') {
      disconnectEth().then((discStatus: Boolean) => {
        if (discStatus) {
          console.log('reset.sourceChain disconnect');
          appData.sourceProvider = null;
          appData.sourceWeb3Provider = null;
          appData.sourceAddress = null;
          appData.connectedSourceChain = null;
          appData.setAppData(appData);
        }
      });
    } else if (appData.sourceChainConfiguration && appData.sourceChainConfiguration.type === 'algo') {
      disconnectAlgoWalletConnect(appData.sourceAlgoConnector).then((connector: any) => {
        // console.log(connector);
      });
      appData.sourceAlgoConnected = false;
      appData.setAppData(appData);
    }
  };

  const buttonAction = () => {
    const walletConnectCache = localStorage.getItem('walletconnect');
    // localStorage.clear();
    localStorage.removeItem('walletconnect');
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div>
      <div
        className={`
                    m-auto bg-connect-purple select-none ease-in-out duration-100 hover:bg-connect-purple-hover hover:cursor-pointer 
                    w-[210px] 3xl:w-[294px] 4xl:w-[412px] 
                    h-[35px] 3xl:h-[49px] 4xl:h-[69px] 
                    rounded-[32px] 3xl:rounded-[45px] 4xl:rounded-[63px]
                    text-lg 3xl:text-xl 4xl:text-3xl
                    text-center text-connect-text flex flex-col justify-center mt-2 border border-connect-border
                  `}
        onClick={() => buttonAction()}
      >
        {!connected ? 'connect' : `disconnect ${shortenAddress(appData.sourceAddress, 4)}`}
      </div>
      <div className={`fixed top-0 left-0 w-full h-full backdrop-blur-sm ${!connectingAlgo ? 'hidden' : ''} z-[100]`} onClick={() => setConnectingAlgo(false)}></div>{' '}
      {/* backdrop when setting address */}
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col ${!connectingAlgo ? 'hidden' : ''} z-[101]`}>
        {' '}
        {/* menu of networks */}
        <ul className="bg-gradient-to-r from-topleft-purple to-bottomright-purple drop-shadow-menu-default rounded-[26px] p-3 text-center flex flex-col justify-center ease-in-out duration-100 hover:cursor-pointer">
          <div className="mx-2 mt-1 text-xl w-max text-center m-auto">Connect wallet</div> {/* title of network select */}
          <Wallet logo={peraLogo} name="PeraWallet" connect={connectAlgo} />
        </ul>
      </div>
    </div>
  );
};

export default SourceConnect;
