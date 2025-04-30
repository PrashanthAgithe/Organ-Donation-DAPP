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

// import crypto from 'crypto';
// import { Buffer } from 'buffer';
// Import the IPFS HTTP client
import { create } from 'ipfs-http-client';

// Extract Infura credentials from environment variables
// const projectId = import.meta.env.VITE_INFURA_PROJECT_ID;
// const projectSecret = import.meta.env.VITE_INFURA_PROJECT_SECRET;

// Create the authorization header
// const auth =
//   'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// Initialize the IPFS client with Infura's gateway and authentication
// const ipfs = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: auth,
//   },
// });

const ipfs = create({ url: 'http://127.0.0.1:5001' });

// function encryptDonorData(donor) {
//   const jsonData = JSON.stringify(donor);
//   const key = crypto.randomBytes(32); // 256-bit key
//   const iv = crypto.randomBytes(16);  // 128-bit IV

//   const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
//   let encrypted = cipher.update(jsonData, 'utf8', 'hex');
//   encrypted += cipher.final('hex');

//   return {
//     encryptedData: encrypted,
//     key: key.toString('hex'),
//     iv: iv.toString('hex'),
//   };
// }

export const uploadDonorData = async (donor) => {
  try {
    const data = JSON.stringify(donor);
    const { cid } = await ipfs.add(data);
    // console.log('Data uploaded to IPFS with CID:', cid.toString());
    return cid.toString();
  } catch (error) {
    console.error('Error uploading data to IPFS:', error);
    // throw error;
  }
};
export const uploadRecipientData = async (recipient) => {
  try {
    const data = JSON.stringify(recipient);
    const { cid } = await ipfs.add(data);
    // console.log('Data uploaded to IPFS with CID:', cid.toString());
    return cid.toString();
  } catch (error) {
    console.error('Error uploading data to IPFS:', error);
    // throw error;
  }
};

export const retrieveDonorData = async (cid) => {
  try {
    const stream = ipfs.cat(cid);
    let data = '';
    const decoder = new TextDecoder('utf-8');

    // Decode each chunk properly
    for await (const chunk of stream) {
      data += decoder.decode(chunk, { stream: true });
    }
    // Finalize decoding for the last chunk
    data += decoder.decode();

    // console.log('Raw data retrieved from IPFS:', data);

    // Parse the JSON data
    const donor = JSON.parse(data);
    // console.log('Data retrieved from IPFS:', donor);
    return donor;
  } catch (error) {
    console.error('Error retrieving data from IPFS:', error);
    throw error;
  }
};
export const retrieveRecipientData = async (cid) => {
  try {
    const stream = ipfs.cat(cid);
    let data = '';
    const decoder = new TextDecoder('utf-8');

    // Decode each chunk properly
    for await (const chunk of stream) {
      data += decoder.decode(chunk, { stream: true });
    }
    // Finalize decoding for the last chunk
    data += decoder.decode();

    // console.log('Raw data retrieved from IPFS:', data);

    // Parse the JSON data
    const recipient = JSON.parse(data);
    // console.log('Data retrieved from IPFS:', recipient);
    return recipient;
  } catch (error) {
    console.error('Error retrieving data from IPFS:', error);
    throw error;
  }
};

import { toast } from "sonner";

export const getAllMatchedRecords = async () => {
  const donorIDs     = await getAlldonorIDs();
  const recipientIDs = await getAllrecipientIDs();
  // const existing     = await getAllTransplantedRecords();
  const matches      = [];

  for (const donorId of donorIDs) {
    const donorCID = await contractProvider.getDonorCID(donorId);
    const donor    = await retrieveDonorData(donorCID);
    if (donor.status === 'alive') continue;

    for (const recipientId of recipientIDs) {
      const recipientCID = await contractProvider.getRecipientCID(recipientId);
      const recipient    = await retrieveRecipientData(recipientCID);
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

// export const runMatching = async () => {
//   try {
//     const donorIDs     = await getAlldonorIDs();
//     const recipientIDs = await getAllrecipientIDs(); 
//     let count=0;
//     const existing = await getAllMatchedRecords();
//     for (const donorId of donorIDs) {
//       // fetch donor CID & data
//       const donorCID = await contractProvider.getDonorCID(donorId);
//       const donor    = await retrieveDonorData(donorCID);

//       // only consider Deceased donors
//       if (donor.status === "alive") continue;

//       for (const recipientId of recipientIDs) {
//         // fetch recipient CID & data
//         const recipientCID = await contractProvider.getRecipientCID(recipientId);
//         const recipient    = await retrieveRecipientData(recipientCID);

//         // simple matching logic
//         const wants = recipient.requiredOrgan;
//         const hasOrgan = donor.organsAvailable.includes(wants);
//         const sameBlood = donor.bloodType === recipient.bloodType;

//         if (hasOrgan && sameBlood) {
//           // checking whether smae matching already exists
//           const already = existing.some(r =>
//             r.donorId === donorId && r.recipientId === recipientId && r.organ === wants
//           );

//           if (already) continue;

//           // creating record to insert
//           const matchDate = Math.floor(Date.now() / 1000);
//           const nextID=await contractProvider.getCurrentAvailableMatchedID();
//           const recordId  = "M"+String(Number(nextID));
//           const status    = "matched";

//           await insertMatchedRecord({
//             recordId,
//             donorId,
//             recipientId,
//             organ: wants,
//             matchDate,
//             status
//           });
//           count++;
//         }
//       }
//     }
//     toast(count+' Matched records Updated', {
//       style: {
//         backgroundColor: '#4CAF50',
//         color: 'white',
//         fontSize: '16px',
//         borderRadius: '8px',
//         padding: '12px 24px',
//       },
//       duration: 3000,
//     });
//   } catch (error) {
//     console.error("runMatching failed:", error);
//   }
// }

export const transplant = async (record) => {
  try {
    // 1. Record the transplant on-chain
    const nextID = await contractProvider.getCurrentAvailableMatchedID();
    await insertMatchedRecord({
      recordId:    `T${nextID}`,
      donorId:     record.donorId,
      recipientId: record.recipientId,
      organ:       record.organ,
      matchDate:   Math.floor(Date.now() / 1000),
      status:      "transplanted"
    });

    // 2. Remove the recipient from the pool
    const tx1=await contractSigner.removeRecipient(record.recipientId);
    await tx1.wait();
    // 3. Fetch, update, re-upload and re-register the donor
    const donorCID = await contractProvider.getDonorCID(record.donorId);
    const donor    = await retrieveDonorData(donorCID);
    const updated  = {
      ...donor,
      organsAvailable: donor.organsAvailable.filter(o => o !== record.organ)
    };
    const newCid = await uploadDonorData(updated);

    const tx2 = await contractSigner.registerDonor(record.donorId, newCid);
    await tx2.wait();

    toast.success(`Transplanted ${record.organ}`, { duration: 3000 });
  } catch (err) {
    console.error("transplant failed:", err);
    toast.error("Transplant failed", { duration: 3000 });
  }
};



// export const deleteData = async (cid) => {
//   try {
//     await ipfs.pin.rm(cid); // Unpin from local node
//     console.log(`Unpinned CID ${cid} from local IPFS node.`);
//   } catch (error) {
//     console.error(`Error unpinning CID ${cid}:`, error);
//   }
// };
export const getDonorCID = async (id)=>{
  const donorcid =await contractProvider.getDonorCID(id);
  console.log(donorcid);
}

// // Update Donor Status
// export const updateDonorStatus = async (donorId, status) => {
//   try {
//     // Call the updateDonorStatus function on the contract
//     const tx = await contractSigner.updateDonorStatus(donorId, status);
//     await tx.wait(); // Wait for the transaction to be mined
//     console.log(`Donor status updated to ${status} for Donor ID: ${donorId}`);
//   } catch (error) {
//     console.error("Error in updating donor status on Blockchain:", error);
//   }
// };

// Set Donor CID
// export const setDonorCID = async (donorId, cid) => {
//   try {
//     // Register the donor with the given CID
//     const tx = await contractSigner.registerDonor(donorId, cid);
//     await tx.wait(); // Wait for the transaction to be mined
//     console.log(`CID updated for Donor ID: ${donorId} to CID: ${cid}`);
//   } catch (error) {
//     console.error("Error in setting donor CID on Blockchain:", error);
//   }
// };
