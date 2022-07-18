const shortenAddress = (address: string, length: number) => {
  if (!address || address.length < length * 2) return address;
  return address.substring(0, length) + '...' + address.substring(address.length - length);
};
export default shortenAddress;
