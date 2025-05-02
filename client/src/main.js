import { contractProvider, contractSigner } from './contract';

export const getAlldonorIDs = async () =>{
  try {
    const tx=await contractProvider.getDonorIDs();
    console.log(tx);
    const donorIDs = Array.from(tx);
    console.log(donorIDs);
    return donorIDs;
  } catch (error) {
    console.log("Error in getting donor IDs from Blockchain",error);
  }
}
export const getAllrecipientIDs = async () =>{
  try {
    const tx=await contractProvider.getRecipientIDs();
    console.log(tx);
    const recipientIDs = Array.from(tx);
    console.log(recipientIDs);
    return recipientIDs;
  } catch (error) {
    console.log("Error in getting recipient IDs from Blockchain",error);
  }
}
export const insertMatchedRecord = async (record) => {
  try {
    const { recordId, donorId, recipientId, organ, matchDate, status } = record;
    const tx = await contractSigner.createMatch(
      recordId,
      donorId,
      recipientId,
      organ,
      matchDate,
      status
    );
    await tx.wait();
    console.log("Matched record inserted successfully!");
  } catch (error) {
    console.error("Error in inserting record in Blockchain:", error);
  }
};

export const getAllTransplantedRecords = async () => {
  try {
    const tx = await contractProvider.getMatchedRecords();
    const MatchedRecords = tx.map(record => ({
      recordId: record.recordId,
      donorId: record.donorId,
      recipientId: record.recipientId,
      organ: record.organ,
      matchDate: record.matchDate.toString(),
      status: record.status
    }));
    // const MatchedRecords = Array.from(tx);
    console.log("MatchedRecords Length:", MatchedRecords.length);
    console.log("MatchedRecords:", MatchedRecords);
    return MatchedRecords;
  } catch (error) {
    console.error("Error in getting matched records", error);
    return [];
  }
};

// Grab your JWT from Vite’s env
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

// Upload a JSON object to Pinata
export async function uploadDataToPinata(obj) {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({ pinataContent: obj }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinata upload failed: ${err}`);
  }
  const { IpfsHash } = await res.json();
  return IpfsHash;
}

// Retrieve a pinned JSON object via Pinata’s public gateway
export async function retrieveDataFromPinata(cid) {
  const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
  if (!res.ok) {
    throw new Error(`Gateway fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const getAllMatchedRecords = async () => {
  const donorIDs     = await getAlldonorIDs();
  const recipientIDs = await getAllrecipientIDs();
  // const existing     = await getAllTransplantedRecords();
  const matches      = [];

  for (const donorId of donorIDs) {
    const donorCID = await contractProvider.getDonorCID(donorId);
    const donor    = await retrieveDataFromPinata(donorCID);
    if (donor.status === 'alive') continue;

    for (const recipientId of recipientIDs) {
      const recipientCID = await contractProvider.getRecipientCID(recipientId);
      const recipient    = await retrieveDataFromPinata(recipientCID);
      const wants      = recipient.requiredOrgan;
      const hasOrgan = donor.organsAvailable.includes(wants);
      const sameBlood= donor.bloodType === recipient.bloodType;
      if (!hasOrgan || !sameBlood) continue;

      // const already = existing.some(r =>
      //   r.donorId     === donorId &&
      //   r.recipientId === recipientId &&
      //   r.organ       === wants
      // );
      // if (already) continue;

      const matchDate = Math.floor(Date.now()/1000);
      const nextID    = matches.length;
      const recordId  = `M${nextID.toString()}`;
      matches.push({
        recordId,
        donorId,
        recipientId,
        organ: wants,
        matchDate: matchDate.toString(),
        status: 'matched'
      });
    }
  }

  return matches;
};

export const transplant = async (record) => {
  try {
    //record the transplant on-chain
    const nextID = await contractProvider.getCurrentAvailableMatchedID();
    await insertMatchedRecord({
      recordId:    `T${nextID}`,
      donorId:     record.donorId,
      recipientId: record.recipientId,
      organ:       record.organ,
      matchDate:   Math.floor(Date.now() / 1000),
      status:      "transplanted"
    });

    //remove recipient
    const tx1=await contractSigner.removeRecipient(record.recipientId);
    await tx1.wait();
    //fetch, update, re-upload and re-register the donor
    const donorCID = await contractProvider.getDonorCID(record.donorId);
    const donor    = await retrieveDataFromPinata(donorCID);
    const updated  = {
      ...donor,
      organsAvailable: donor.organsAvailable.filter(o => o !== record.organ)
    };
    const newCid = await uploadDataToPinata(updated);

    const tx2 = await contractSigner.registerDonor(record.donorId, newCid);
    await tx2.wait();
  } catch (err) {
    console.error("transplant failed:", err);
  }
};

// export const getDonorCID = async (id)=>{
//   const donorcid =await contractProvider.getDonorCID(id);
//   console.log(donorcid);
// }

// // Update Donor Status
export const updateDonorStatus = async (donorId, status) => {
  try {
    // Call the updateDonorStatus function on the contract
    const donorCID = await contractProvider.getDonorCID(donorId);
    const donor    = await retrieveDataFromPinata(donorCID);
    
    if(status=='deceased'){
      donor.status=status;
      const newCid = await uploadDataToPinata(donor);
      const tx = await contractSigner.registerDonor(donorId, newCid);
      await tx.wait(); // Wait for the transaction to be mined
    }
    console.log(`Donor status updated to ${status} for Donor ID: ${donorId}`);
  } catch (error) {
    console.error("Error in updating donor status on Blockchain:", error);
  }
};
