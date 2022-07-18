const chainId2Bridge = (chainId: number) => {
  switch (`${chainId}`) {
    case '3':
      return require('../../assets/contracts/ropsten/Bridge.json');
    case '4':
      return require('../../assets/contracts/rinkeby/Bridge.json');
    case '80001':
      return require('../../assets/contracts/polygon/Bridge.json');
    default:
      return require('../../assets/contracts/rinkeby/Bridge.json');
  }
};
export default chainId2Bridge;
