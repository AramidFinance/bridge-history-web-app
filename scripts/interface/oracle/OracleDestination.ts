import OracleValuesWithValidity from './OracleValuesWithValidity';

interface Chains {
  [key: number]: OracleValuesWithValidity;
}

interface OracleDestination {
  validFrom: number;
  toChains: Chains;
}
export default OracleDestination;
