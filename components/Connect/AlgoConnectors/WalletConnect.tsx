import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import WalletConnect from '@walletconnect/client';

/**
 * Kills the connected instance of Wallet Connect, resets initial
 */
export const disconnect = async (algoConnector: any) => {
  if (algoConnector) {
    try {
      algoConnector.killSession();
    } catch (err) {
      console.log(err);
    }
  }
};

/**
 * Initializes a Wallet Connect instance for Algorand
 */
export const connect = async () => {
  // bridge url
  const bridge = 'https://bridge.walletconnect.org';

  // create new connector
  const connector = new WalletConnect({
    bridge,
    qrcodeModal: QRCodeModal,
  });

  // await subscribeToEvents(connector);

  if (!connector.connected) {
    await connector.createSession();
  }
  return connector;
};
