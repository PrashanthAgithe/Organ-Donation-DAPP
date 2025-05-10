const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OrganDonationContract", function () {
  let contract, owner, addr1, addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ContractFactory = await ethers.getContractFactory("OrganDonationContract");
    contract = await ContractFactory.deploy();
    await contract.waitForDeployment();
  });

  it("should set the correct owner", async () => {
    expect(await contract.owner()).to.equal(owner.address);
  });

  it("should allow only owner to add authorized", async () => {
    await contract.addAuthorized(addr1.address);
    const isAuth = await contract.isAuthorized(addr1.address);
    expect(isAuth).to.be.true;

    await expect(
      contract.connect(addr1).addAuthorized(addr2.address)
    ).to.be.revertedWith("You are not the contract owner");
  });

  it("should allow owner to remove authorized", async () => {
    await contract.addAuthorized(addr1.address);
    await contract.removeAuthorized(addr1.address);
    const isAuth = await contract.isAuthorized(addr1.address);
    expect(isAuth).to.be.false;
  });

  it("should allow authorized to register donor and recipient", async () => {
    await contract.addAuthorized(addr1.address);

    await contract.connect(addr1).registerDonor("D1", "cid1");
    await contract.connect(addr1).registerRecipient("R1", "cid2");

    const donorIds = await contract.getDonorIDs();
    const recipientIds = await contract.getRecipientIDs();

    expect(donorIds).to.deep.equal(["D1"]);
    const donorCid = await contract.getDonorCID("D1");
    expect(donorCid).to.equal("cid1");
    expect(recipientIds).to.deep.equal(["R1"]);
    const recipientrCid = await contract.getRecipientCID("R1");
    expect(recipientrCid).to.equal("cid2");
  });

  it("should reject unauthorized user for sensitive actions", async () => {
    await expect(
      contract.connect(addr1).registerDonor("D2", "cidX")
    ).to.be.revertedWith("Not an authorized address");
  });

  it("should remove donor and recipient properly", async () => {
    await contract.addAuthorized(owner.address);
    await contract.registerDonor("D1", "cid1");
    await contract.registerDonor("D2", "cid2");
    await contract.registerDonor("D3", "cid3"); 

    await contract.removeDonor("D2");

    const donors = await contract.getDonorIDs();
    expect(donors).to.not.include("D2");
    expect(donors).to.deep.equal(["D1", "D3"]);

    await contract.registerRecipient("R1", "cid1");
    await contract.registerRecipient("R2", "cid2");
    await contract.registerRecipient("R3", "cid3");

    await contract.removeRecipient("R2");

    const recipients = await contract.getRecipientIDs();
    expect(recipients).to.not.include("R2");
    expect(recipients).to.deep.equal(["R1","R3"]);
  });

  it("should create transplant and update data correctly", async () => {
    await contract.addAuthorized(owner.address);
    await contract.registerDonor("D4", "cidD4");
    await contract.registerRecipient("R4", "cidR4");

    const initialDonorCount = await contract.getCurrentAvailableDonorID();
    const initialRecipientCount = await contract.getCurrentAvailableRecipientID();
    const initialTransplantedCount = await contract.getCurrentAvailableTransplantedID();

    const matchDate = 1715389443;

    await contract.createTransplant(
      "T1", "D4", "R4", "Kidney", matchDate, "Completed", "newCID"
    );

    const records = await contract.getTransplantedRecords();
    expect(records.length).to.equal(1);
    expect(records[0].recordId).to.equal("T1");
    expect(await contract.getDonorCID("D4")).to.equal("newCID");
    expect(records[0].matchDate).to.equal(matchDate);
  });

  it("should return authorized array", async () => {
    await contract.addAuthorized(addr1.address);
    const result = await contract.getAuthorized();
    expect(result).to.include(addr1.address);
  });

  it("should return static message", async () => {
    expect(await contract.getMessage()).to.equal("Blockchain Connected successfully!");
  });

  it("should get the current available donor ID", async () => {
    expect(await contract.getCurrentAvailableDonorID()).to.equal(0);
    await contract.addAuthorized(owner.address);
    await contract.registerDonor("D5", "cid5");
    expect(await contract.getCurrentAvailableDonorID()).to.equal(1);
  });

  it("should get the current available recipient ID", async () => {
    expect(await contract.getCurrentAvailableRecipientID()).to.equal(0);
    await contract.addAuthorized(owner.address);
    await contract.registerRecipient("R5", "cidR5");
    expect(await contract.getCurrentAvailableRecipientID()).to.equal(1);
  });

  it("should get the current available transplanted ID", async () => {
    expect(await contract.getCurrentAvailableTransplantedID()).to.equal(0);
    await contract.addAuthorized(owner.address);
    await contract.registerDonor("D6", "cidD6");
    await contract.registerRecipient("R6", "cidR6");
    await contract.createTransplant("T2", "D6", "R6", "Heart", 1715389500, "Pending", "newCID2");
    expect(await contract.getCurrentAvailableTransplantedID()).to.equal(1);
  });

  it("should not increment donor ID if registering the same donor twice", async () => {
    await contract.addAuthorized(owner.address);
    await contract.registerDonor("DUPLICATE", "cidA");
    const initialId = await contract.getCurrentAvailableDonorID();
    await contract.registerDonor("DUPLICATE", "cidB");
    const finalId = await contract.getCurrentAvailableDonorID();
    expect(finalId).to.equal(initialId);
  });

  it("should get the current available donor ID (initial state)", async () => {
    expect(await contract.getCurrentAvailableDonorID()).to.equal(0);
  });

  it("should get the current available recipient ID (initial state)", async () => {
    expect(await contract.getCurrentAvailableRecipientID()).to.equal(0);
  });

  it("should get the current available transplanted ID (initial state)", async () => {
    expect(await contract.getCurrentAvailableTransplantedID()).to.equal(0);
  });
});