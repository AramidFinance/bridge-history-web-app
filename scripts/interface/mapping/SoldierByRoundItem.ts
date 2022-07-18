import SoldierId2SoldierAddress from './SoldierId2SoldierAddress';

type SoldierByRoundItem = {
  validFrom: number;
  validUntil: number;
  signThreshold: number;
  sendThreshold: number;
  soldiers: SoldierId2SoldierAddress;
};
export default SoldierByRoundItem;
