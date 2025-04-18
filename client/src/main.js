import { contractProvider, contractSigner } from './contract';

export const insertMatchedRecord = async () => {
  try {
    const tx = await contractSigner.createMatch(
      "REC123",
      "DON456",
      "REC789",
      "Kidney",
      Math.floor(Date.now() / 1000),
      "matched"
    );
    await tx.wait();
    console.log("Matched record inserted successfully!");
  } catch (error) {
    console.error("Error in inserting record in Blockchain:", error);
  }
};

export const getAllMatchedRecords = async () => {
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

    console.log("MatchedRecords Length:", MatchedRecords.length);
    console.log("MatchedRecords:", MatchedRecords);
    return MatchedRecords;
  } catch (error) {
    console.error("Error in getting matched records", error);
    return [];
  }
};

import crypto from 'crypto';
import { Buffer } from 'buffer';
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
    console.log('Data uploaded to IPFS with CID:', cid.toString());
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

    console.log('Raw data retrieved from IPFS:', data);

    // Parse the JSON data
    const donor = JSON.parse(data);
    console.log('Data retrieved from IPFS:', donor);
    return donor;
  } catch (error) {
    console.error('Error retrieving data from IPFS:', error);
    throw error;
  }
};
