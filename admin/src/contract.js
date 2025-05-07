import { ethers } from "ethers";
import OrganDonationContractABI from '../../artifacts/contracts/OrganDonationContract.sol/OrganDonationContract.json';

const contractAddress=import.meta.env.VITE_CONTRACT_ADDRESS;
let contractProvider;
let contractSigner;
if(!window.ethereum){
  alert("Please Install MetaMask and refresh the page!!")
}else{
  //connect to ganache
  // const provider=new ethers.JsonRpcProvider(import.meta.env.VITE_GANACHE_URL);
  const provider = new ethers.BrowserProvider(window.ethereum);
  // const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY, provider);
  const signer = await provider.getSigner();
  contractProvider= new ethers.Contract(contractAddress,OrganDonationContractABI.abi,provider);
  contractSigner= new ethers.Contract(contractAddress,OrganDonationContractABI.abi,signer);
}
export {contractProvider,contractSigner};