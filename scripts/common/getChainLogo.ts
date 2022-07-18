import ethLogo from '../../assets/logos/chains/ethereum.png';
import algoLogo from '../../assets/logos/chains/algorand.png';
import auroraLogo from '../../assets/logos/chains/aurora.png';
import maticLogo from '../../assets/logos/chains/polygon-matic-logo.png';
import circle from '../../assets/circle.png';

const getChainLogo = (chainLogo: string) => {
  // returns network logo
  switch (chainLogo) {
    case 'eth':
      return ethLogo;
    case 'polygon':
      return maticLogo;
    case 'algo':
      return algoLogo;
    case 'aurora':
      return auroraLogo;
    default:
      return circle;
  }
};

export default getChainLogo;
