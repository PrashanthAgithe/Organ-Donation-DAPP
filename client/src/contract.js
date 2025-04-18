import { ethers } from "ethers";
import OrganDonationContractABI from '../../artifacts/contracts/OrganDonationContract.sol/OrganDonationContract.json';

const contractAddress=import.meta.env.VITE_CONTRACT_ADDRESS;
//connect to ganache
const provider=new ethers.JsonRpcProvider(import.meta.env.VITE_GANACHE_URL);
const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY, provider);
const contractProvider= new ethers.Contract(contractAddress, OrganDonationContractABI.abi, provider);
const contractSigner= new ethers.Contract(contractAddress, OrganDonationContractABI.abi, signer);

export {contractProvider,contractSigner};