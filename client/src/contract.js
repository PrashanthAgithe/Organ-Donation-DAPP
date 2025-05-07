// contract.js
import { ethers } from "ethers";
import OrganDonationContractABI from '../../artifacts/contracts/OrganDonationContract.sol/OrganDonationContract.json';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
let contractProvider;
let contractSigner;

const isAddressAllowed = async (address) => {
  try {
    const isAuthorized = await contractProvider.isAuthorized(address);
    return isAuthorized;
  } catch (error) {
    console.error('Error checking authorization from blockchain:', error);
    return false;
  }
};

const initContracts = async () => {
  if (!window.ethereum) {
    alert("Please Install MetaMask and refresh the page!!");
    return false;
  }

  //connect to ganache
  // const provider=new ethers.JsonRpcProvider(import.meta.env.VITE_GANACHE_URL);
  const provider = new ethers.BrowserProvider(window.ethereum);
  contractProvider= new ethers.Contract(contractAddress, OrganDonationContractABI.abi, provider);
  
  // const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY, provider);
  const signer = await provider.getSigner();

  const userAddress = await signer.getAddress();
  // console.log("Connected Wallet:", userAddress);

  const allowed = await isAddressAllowed(userAddress);
  if (allowed) {
    contractSigner = new ethers.Contract(contractAddress, OrganDonationContractABI.abi, signer);
    return true;
  } else {
    alert("You are not Authorized to use this website!");
    return false;
  }
};

export { contractProvider, contractSigner, initContracts };
