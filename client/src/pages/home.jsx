import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEthereum } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  getAlldonorIDs,
  getAllMatchedRecords,
  getAllrecipientIDs,
  getAllTransplantedRecords,
  insertTransplantedRecord,
  updateDonorStatus
} from "../main";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

const LandingPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("deceased");
  const [donorId, setDonorId] = useState(""); // State to track donor ID

  const check = async () => {
    try {
      const msg = await contractProvider.getMessage();
      console.log(msg);
    } catch (error) {
      console.log("Error in getting message from Blockchain:", error);
    }
  };

  // handle status submission and update
  const handleSubmitStatus = async () => {
    if (!donorId || !status) {
      toast.error("Please enter both Donor ID and status");
      return;
    }
    const toastId = toast.loading('Updating donor status...', {
      position: 'bottom-right',
      style: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: '16px',
        borderRadius: '8px',
        padding: '12px 24px',
      },
    });
    try {
      await updateDonorStatus(donorId, status);
      toast.success(`Donor ${donorId} status updated to ${status}`, {
        id: toastId,
      });
      // Clear form after successful update
      setDonorId("");
      setStatus("");
    } catch (error) {
      console.error("Failed to update donor status:", error);
      toast.error("Failed to update status. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center h-screen text-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <h1 className="text-5xl font-bold mb-4">Decentralized Organ Donation System</h1>
        <p className="text-lg max-w-2xl">
          A secure, transparent, and tamper-proof organ donation system powered by blockchain.
        </p>
        <div className="flex flex-wrap justify-center align-center gap-4 mt-6">
          <Button
            onClick={() => navigate('/donor-registration')}
            className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200 rounded-lg shadow-md"
          >
            Donor Registration
          </Button>
          <Button
            onClick={() => navigate('/recipient-registration')}
            className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200 rounded-lg shadow-md"
          >
            Recipient Registration
          </Button>
          <Button
            onClick={() => navigate('/getMatchedRecords')}
            className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200 rounded-lg shadow-md"
          >
            Get All Matched Records
          </Button>
          <Button
            onClick={() => navigate('/getTransplantedRecords')}
            className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200 rounded-lg shadow-md"
          >
            View Transplanted Records
          </Button>

          {/* Update Donor Status Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200 rounded-lg shadow-md transition-all duration-300">
                Update Donor Status
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
              <AlertDialogHeader className="text-center mb-4">
                <AlertDialogTitle className="text-2xl font-semibold text-gray-800">
                  Update Donor Status
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-600 mt-2">
                  Enter the donor ID and select the appropriate status to update donor information.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="mb-3">
                <Label className="block text-sm font-medium text-gray-700">Donor Id</Label>
                <Input
                  value={donorId}
                  onChange={(e) => setDonorId(e.target.value)}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-3">
                <Label className="block text-sm font-medium text-gray-700">Status</Label>
                <Select
                  defaultValue="deceased"
                  onValueChange={(value) => setStatus(value)}
                >
                  <SelectTrigger className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deceased">Deceased</SelectItem>
                    <SelectItem value="alive" disabled>Alive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AlertDialogFooter className="flex justify-between">
                <AlertDialogCancel className="text-sm text-gray-600 hover:text-gray-800">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmitStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Submit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


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
