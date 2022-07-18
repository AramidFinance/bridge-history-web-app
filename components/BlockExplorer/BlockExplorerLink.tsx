import { useEffect, useState } from 'react';
import getChainConfiguration from '../../scripts/common/getChainConfiguration';
import ChainItem from '../../scripts/interface/mapping/ChainItem';

interface BlockExplorerLinkProps {
  txHash: string;
  chain: number;
}

const BlockExplorerLink = (props: BlockExplorerLinkProps) => {
  const { txHash, chain } = props;

  const [chainConfiguration, setChainConfiguration] = useState<ChainItem>();

  useEffect(() => {
    console.debug('bel effect 01');
    getChainConfiguration(chain).then(config => {
      setChainConfiguration(config);
    });
  }, []); // only set on load so block explorer for prior transactions don't change when user switches network

  if (!chainConfiguration) {
    return <></>;
  }

  const explorer = chainConfiguration.blockExplorers.length > 0 ? chainConfiguration.blockExplorers[0] : 'https://etherscan.io/tx/';
  if (!explorer) {
    return <>{txHash}</>;
  }
  return (
    <span className="mx-1.5 text-blockexplorer-default hover:text-blockexplorer-hover">
      <a href={`${explorer}${txHash}`} target="_blank" rel="noreferrer">
        {chainConfiguration.type == 'eth' ? 'Etherscan' : 'Algoexplorer'}
      </a>
    </span>
  );
};
export default BlockExplorerLink;
