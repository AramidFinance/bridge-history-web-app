import FeeAlternativeItem from './FeeAlternativeItem';

type MappingItem = {
  sourceChain: number;
  sourceToken: string;
  sourceName: string;
  sourceSymbol: string;
  sourceDecimals: number;
  sourceType: string;
  sourceTokenLogo: string;
  destinationChain: number;
  destinationToken: string;
  destinationName: string;
  destinationSymbol: string;
  destinationDecimals: number;
  destinationType: string;
  destinationTokenLogo: string;
  feeAlternatives: Array<FeeAlternativeItem>;
};
export default MappingItem;
