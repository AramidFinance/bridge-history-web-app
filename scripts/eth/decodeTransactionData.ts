import { ethers } from "ethers"
import { defaultAbiCoder } from "ethers/lib/utils"

export const decodeLockToken = (data: string) => {
  const lockTokensInputs = defaultAbiCoder.decode(["address", "uint256", "address", "uint256", "uint32", "string", "uint256", "string"], ethers.utils.hexDataSlice(data, 4))
  console.log('decoded lock tokens inputs:', lockTokensInputs)
};

export const decodeLockNativeCurrency = (data: string) => {
  const lockNativeCurrencyInputs = defaultAbiCoder.decode(["address", "uint256", "uint256", "uint32", "string", "uint256", "string"], ethers.utils.hexDataSlice(data, 4))
  console.log('decoded lock native token inputs:', lockNativeCurrencyInputs);
}