import { NextPage } from 'next';
import Head from 'next/head';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { providers } from 'ethers';
import LoadInitDataEffect from '../effects/global/LoadInitDataEffect';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import { IInternalEvent } from '@walletconnect/types';
import { AppContext, defaultData } from '../context/AppContext';
import getWeb3Modal from '../scripts/eth/getWeb3Modal';
import Header from '../components/Header';
import TrackConfigurationsEffect from '../effects/global/TrackConfigurationsEffect';
import ConnectSourceChainEffect from '../effects/chain/evm/ConnectSourceChainEffect';
import SourceProviderEffect from '../effects/chain/evm/SourceProviderEffect';

const defaultErrorMessage = ' ';

const Home: NextPage = () => {
  const appData = useContext(AppContext);

  const [selectingAsset, setSelectingAsset] = useState(false);
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage);
  const [networkErrorMessage, setNetworkErrorMessage] = useState(defaultErrorMessage);

  const web3Modal = getWeb3Modal(typeof window !== 'undefined' ? window : null);

  const connectEth = useCallback(
    async function () {
      console.debug('useCallback connectEth');
      // connects to web3 wallet
      let provider;
      try {
        provider = await web3Modal.connect();
      } catch (error) {
        console.log(`set.sourceChain remove from mint on error ${error}`);
        appData.sourceChain = null;
        appData.setAppData(appData);
        console.log('error connecting: ', error);
        // reset source network if something goes awry with connecting to wallet
        return;
      }
      const web3Provider = new providers.Web3Provider(provider, 'any');
      const signer = web3Provider.getSigner();
      const sourceAddress = await signer.getAddress();
      const network = await web3Provider.getNetwork();
      console.log(provider, web3Provider);
      console.log(`set.sourceChain remove from mint.connectEth ${network.chainId}`);
      appData.sourceProvider = provider;
      appData.sourceWeb3Provider = web3Provider;
      appData.sourceAddress = sourceAddress;
      appData.sourceChain = network.chainId;
      appData.setAppData(appData);
    },
    [appData]
  );

  const disconnectEth = useCallback(
    async function () {
      console.debug('useCallback disconnectEth');
      try {
        appData.sourceProvider.disconnect();
      } catch (err) {
        // console.log('error disconnecting: ', err);
      }
      console.log(`set.sourceChain remove from mint.disconnectEth`);
      appData.sourceProvider = null;
      appData.sourceWeb3Provider = null;
      appData.sourceAddress = null;
      appData.sourceChain = null;
      appData.setAppData(appData);
    },
    [appData]
  ); // disconnects from eth wallet

  useEffect(() => {
    if (!appData.appConfiguration) return;

    console.debug('mint effect 03');

    // handles eth account or network changing, or disconnecting
    if (appData.sourceProvider?.on) {
      const handleAccountsChanged = async (accounts: string[]) => {
        console.log('accounts changed', accounts);
        appData.sourceAddress = accounts[0];
        appData.setAppData(appData);
      };

      const handleSourceChainChanged = (_hexChainId: string) => {
        // window.location.reload(); // reload page on chain change
        const newChainId = parseInt(_hexChainId, 16);
        appData.connectedSourceChain = newChainId;
        appData.setAppData(appData);
        console.log(`set.sourceChain remove from mint.sourceProvider update ${newChainId}`);
        setNetworkErrorMessage(defaultErrorMessage);
      };

      const handleDisconnect = (disc: { code: number; message: string }) => {
        console.log('disconnect', disc);
        disconnectEth();
      };

      appData.sourceProvider.on('accountsChanged', handleAccountsChanged);
      appData.sourceProvider.on('chainChanged', handleSourceChainChanged);
      appData.sourceProvider.on('disconnect', handleDisconnect);

      return () => {
        if (appData.sourceProvider && appData.sourceProvider.removeListener) {
          appData.sourceProvider.removeListener('accountsChanged', handleAccountsChanged);
          appData.sourceProvider.removeListener('chainChanged', handleSourceChainChanged);
          appData.sourceProvider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [appData.sourceProvider, disconnectEth]);

  // Algorand Part of the Widget

  /**
   * Initializes a Wallet Connect instance for Algorand
   */
  const connectAlgo = async () => {
    // bridge url
    const bridge = 'https://bridge.walletconnect.org';

    // create new connector
    const connector = new WalletConnect({
      bridge,
      qrcodeModal: QRCodeModal,
    });
    appData.sourceAlgoConnector = connector;
    appData.setAppData(appData);

    // check if already connected
    if (!connector.connected) {
      // create new session
      await connector.createSession();
    }
    if (connector.accounts && connector.accounts.length > 0) {
      appData.sourceAddress = connector.accounts[0];
    }
    appData.sourceAlgoConnector = connector;
    appData.setAppData(appData);

    await subscribeToEvents(connector);

    // subscribe to events
  };

  /**
   * Subscribes to events from the Wallet Connect instance
   */
  const subscribeToEvents = async (connector: WalletConnect | null) => {
    const connectorInstance = appData.sourceAlgoConnector || connector;
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
      console.log(`connectorInstance.on("connect")`);
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
      onDisconnect();
    });

    if (connectorInstance.connected) {
      console.log('Algo Connected');
      const { accounts } = connectorInstance;
      onSessionUpdate(accounts);
    }
  };

  /**
   * Kills the connected instance of Wallet Connect, resets initial
   */
  const disconnectAlgo = async () => {
    if (appData.sourceAlgoConnector) {
      appData.sourceAlgoConnector.killSession();
    }
    resetApp();
  };

  /**
   * Resets initial state of the react component.
   */
  const resetApp = async () => {
    appData.setAppData(defaultData);
  };

  /**
   * Function called upon connection of Wallet Connect instance. Populates fields of the component state: sourceAddress, algoConnected and algoAccounts.
   * @param {IInternalEvent} payload - The event emitted by the Wallet connect bridge.
   */
  const onConnect = async (payload: IInternalEvent) => {
    const { accounts } = payload.params[0];
    const sourceAlgorandAddress = accounts[0];
    appData.sourceAddress = sourceAlgorandAddress;
    appData.sourceAlgoConnected = true;
    appData.algoAccounts = accounts;
    appData.setAppData(appData);

    // getAccountAssets(sourceAlgorandAddress);
  };

  /**
   * Function called upon disconnect from Wallet Connect. Resets to initial
   */
  const onDisconnect = async () => {
    resetApp();
  };

  /**
   * Function called upon session update from Wallet Connect.
   * @param accounts - Accounts linked to Algorand wallet connected to WC.
   */
  const onSessionUpdate = async (accounts: string[]) => {
    const sourceAlgorandAddress = accounts[0];
    appData.sourceAddress = sourceAlgorandAddress;
    appData.sourceAlgoConnected = true;
    appData.algoAccounts = accounts;
    appData.setAppData(appData);

    // await getAccountAssets(sourceAlgorandAddress);
  };

  const networkConnect = (): void => {
    if (!appData.sourceChainConfiguration) return;
    if (appData.sourceChainConfiguration.type == 'eth') {
      connectEth();
      setErrorMessage(defaultErrorMessage);
    } else if (appData.sourceChainConfiguration.type == 'algo') {
      connectAlgo();
    } else {
      setErrorMessage(`A network must be selected before connecting. ChainId: ${appData.sourceChain}`);
    }
  };

  const networkDisconnect = (): void => {
    if (appData.sourceChainConfiguration.type == 'eth') {
      disconnectEth();
    } else if (appData.sourceChainConfiguration.type == 'algo') {
      disconnectAlgo();
    }
  };

  useEffect(() => {
    console.debug('mint effect 04');
    if (!appData.sourceChainConfiguration) return;
  }, [appData.sourceChainConfiguration]);

  return (
    <div className="flex flex-col bg-[url('../public/background.webp')] bg-cover bg-placeholder-purple text-gray-100 md:text-lg min-h-screen">
      <Head>
        <title>Bridge History | AramidFinance</title>
        <meta name="description" content="Ethereum to Algorand bidirectional bridge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-col items-center font-satoshi justify-center my-24">
        <LoadInitDataEffect />
        <TrackConfigurationsEffect />
        <SourceProviderEffect />
        <ConnectSourceChainEffect />
      </main>
      <div className="fixed bottom-0 left-0 w-3 h-3" onClick={() => console.log(appData)}/>
    </div>
  );
};

export default Home;
