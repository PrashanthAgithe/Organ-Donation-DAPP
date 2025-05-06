import { ethers } from "ethers";
import OrganDonationContractABI from '../../artifacts/contracts/OrganDonationContract.sol/OrganDonationContract.json';

const contractAddress=import.meta.env.VITE_CONTRACT_ADDRESS;
let contractProvider;
let contractSigner;
const isAddressAllowed = async (address) => {
  return true;
  try {
    const response = await fetch(import.meta.env.VITE_WHITELIST_URL);
    const data = await response.json();
    const whitelist = data.allowed;
    // console.log(whitelist);
    return whitelist.includes(address);
  } catch (error) {
    console.error('Error fetching whitelist:', error);
    return false;
  }
};

if(!window.ethereum){
  alert("Please Install MetaMask and refresh the page!!")
}else{
  //connect to ganache
  // const provider=new ethers.JsonRpcProvider(import.meta.env.VITE_GANACHE_URL);
  const provider = new ethers.BrowserProvider(window.ethereum);
  // const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY, provider);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();
  const allowed = await isAddressAllowed(userAddress);
  if(allowed){
    contractProvider= new ethers.Contract(contractAddress, OrganDonationContractABI.abi, provider);
    contractSigner= new ethers.Contract(contractAddress, OrganDonationContractABI.abi, signer);
  }else {
    alert("Your are not allowed to use this website!");
  }
}
export {contractProvider,contractSigner};