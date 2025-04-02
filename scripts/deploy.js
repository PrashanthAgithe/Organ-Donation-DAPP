const hre = require("hardhat");

async function main(){
  const OrganDonationContractFactory=await hre.ethers.getContractFactory('OrganDonationContract');
  const OrganDonationContract=await OrganDonationContractFactory.deploy();
  await OrganDonationContract.waitForDeployment();
  console.log("🚀 OrganDonationContract deployed at :",await OrganDonationContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });