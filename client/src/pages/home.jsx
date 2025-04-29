import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {contractProvider,contractSigner} from "../contract";
import {getAlldonorIDs, getAllMatchedRecords, getAllrecipientIDs, getAllTransplantedRecords, getDonorCID, insertMatchedRecord} from "../main"
import { uploadDonorData,retrieveDonorData } from "../main";
const LandingPage = () => {

  const navigate=useNavigate();

  const check= async ()=>{
    try{
      const msg= await contractProvider.getMessage();
      console.log(msg);
    }catch(error){
      console.log("Error in getting message from Blockchain:",error);
    }
  }
  

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center h-screen text-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <h1 className="text-5xl font-bold mb-4">Decentralized Organ Donation System</h1>
        <p className="text-lg max-w-2xl">
          A secure, transparent, and tamper-proof organ donation system powered by blockchain.
        </p>
        <div className="flex gap-4 mt-6">
          <Button 
          onClick={()=>navigate('/donor-registration')}
          className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200 rounded-lg shadow-md"
          >
            Donor Registration
          </Button>
          <Button 
          onClick={()=>navigate('/recipient-registration')}
          className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200 rounded-lg shadow-md"
          >
            Recipient Registration
          </Button>
          <Button 
          onClick={()=>navigate('/getMatchedRecords')}
          className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200 rounded-lg shadow-md"
          >
            Get All Matched Records
          </Button>
          <Button 
          onClick={getAllTransplantedRecords}
          className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200 rounded-lg shadow-md"
          >
            Get All Transplanted Records
          </Button>
          <Button 
          onClick={()=>getDonorCID('D0')}
          className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200 rounded-lg shadow-md"
          >
            get donor Cid
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="p-10 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-6">Why Choose Blockchain?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Immutable records ensure full trust and security.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Blockchain encrypts donor and recipient data.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Decentralization</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No single entity controls the donation process.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 bg-gray-900 text-white">
        <p>&copy; 2025 Decentralized Organ Donation. Built with <FaEthereum className="inline text-xl" /> Blockchain.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
