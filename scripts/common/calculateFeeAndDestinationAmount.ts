import BigNumber from 'bignumber.js';
import { IState } from '../../context/AppContext';
import formatBaseAmount from './formatBaseAmount';

const calculateFeeAndDestinationAmount = (appData: IState) => {
  if (!appData.sourceTokenConfiguration) return;
  if (!appData.destinationTokenConfiguration) return;
  if (!appData.feeTokenConfiguration) return;

  const sourceAmount = new BigNumber(appData.sourceAmount);
  // const fee = sourceAmount.minus(new BigNumber(sourceAmount.dividedToIntegerBy(1.001)).toFixed(0, 1));
  console.log('dest chain tokens:', appData.routeConfig, appData.feeToken, appData.destinationToken);
  const feeAlternatives = appData.routeConfig.feeAlternatives;
  let feeMultiplier: number;
  for (let i = 0; i < feeAlternatives.length; i++) {
    // loop through fee alternatives to find minimum applicable fee
    const feeAlt = feeAlternatives[i];
    const currFeeMultiplier = feeAlt.sourcePercent;
    if (sourceAmount.gte(new BigNumber(feeAlt.minimumAmount)) && appData.feeTokenConfiguration && appData.feeTokenConfiguration.isPremium === feeAlt.ifPremiumTokenUsed) {
      if (!feeMultiplier || currFeeMultiplier < feeMultiplier) {
        feeMultiplier = currFeeMultiplier;
      }
    }
  }
  if (!feeMultiplier) feeMultiplier = 0.001; // default value if it's undefined

  console.log('fee multiplier:', feeMultiplier, '\nfee token:', appData.feeTokenConfiguration, '\ntoken configs:', appData.routeConfig, '\ndestination token:', appData.destinationToken);
  const fee = new BigNumber(sourceAmount.multipliedBy(feeMultiplier));
  const feeAmount = fee.toFixed(0, 1);
  let updated = false;
  if (appData.feeAmount != feeAmount) {
    appData.feeAmount = feeAmount;
    updated = true;
  }
  const feeAmountFormatted = formatBaseAmount(feeAmount, appData.sourceTokenConfiguration.decimals); // fee token is source token
  if (appData.feeAmountFormatted != feeAmountFormatted) {
    appData.feeAmountFormatted = feeAmountFormatted;
    updated = true;
  }

  const decDiff = appData.destinationTokenConfiguration.decimals - appData.sourceTokenConfiguration.decimals;
  // algo 2 eth 18 - 6 = 12
  // eth 2 algo 6 - 18 = -12
  const destInSourceDecimals = sourceAmount.minus(fee);
  // console.log(sourceAmount, destInSourceDecimals, fee);
  if (decDiff > 0) {
    // source token has more decimals than destination token
    console.log('source token has more decimals than destination token');
    const destinationAmount = destInSourceDecimals.multipliedBy(10 ** decDiff).toFixed(0, 1);
    if (appData.destinationAmount != destinationAmount) {
      appData.destinationAmount = destinationAmount;
      updated = true;
    }
  } else if (decDiff == 0) {
    // source token and destination token have same decimals
    console.log('same decimals');
    const destinationAmount = destInSourceDecimals.toFixed(0, 1);
    if (appData.destinationAmount != destinationAmount) {
      appData.destinationAmount = destinationAmount;
      updated = true;
    }
  } else if (decDiff < 0) {
    // destination token has more decimals than source token
    console.log('destination token has more decimals than source token');
    const destinationAmount = destInSourceDecimals.dividedToIntegerBy(10 ** (-1 * decDiff)).toFixed(0, 1);
    if (appData.destinationAmount != destinationAmount) {
      appData.destinationAmount = destinationAmount;
      updated = true;
    }
  }
  const destinationAmountFormatted = formatBaseAmount(appData.destinationAmount, appData.destinationTokenConfiguration.decimals);
  if (appData.destinationAmountFormatted != destinationAmountFormatted) {
    appData.destinationAmountFormatted = destinationAmountFormatted;
    updated = true;
  }
  if (updated) {
    console.log('calculate destination amount update:', {
      sourceAmount: appData.sourceAmount,
      feeAmount: appData.feeAmount,
      destinationAmount: appData.destinationAmount,
    });
    appData.setAppData(appData);
  }
};

export default calculateFeeAndDestinationAmount;
