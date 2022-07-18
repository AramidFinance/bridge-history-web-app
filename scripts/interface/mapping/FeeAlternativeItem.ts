type FeeAlternativeItem = {
  validFrom: number;
  validUntil: number;
  minimumAmount: string;
  maximumAmount: string;
  sourceConst: number;
  sourcePercent: number;
  destinationConst: number;
  destinationPercent: number;
  ifPremiumTokenUsed: boolean;
};
export default FeeAlternativeItem;
