import axios from 'axios';

const loadIPFSFile = async (ipfsHash: string) => {
  try {
    const web = `https://ipfs.infura.io/ipfs/${ipfsHash}`;
    const response = await axios.get(web);
    if (response.status !== 200) {
      console.error(`Request to ${web} did not returned status 200 (${response.status})`);
      return null;
    }
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
export default loadIPFSFile;
