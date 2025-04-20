import React, { useEffect,useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { runMatching, uploadRecipientData } from "@/main";
import { contractProvider, contractSigner } from "@/contract";

const RecipientRegistration = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const [nextID,setnextID] = useState("");
  const [isloading,setisloading] = useState(false);

  useEffect(()=>{
    async function getnextID(){
      const id = await contractProvider.getCurrentAvailableRecipientID();
      setnextID("R" + String(Number(id)));
    }
    getnextID();
  },[]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodType: "",
    requiredOrgan: "",
    urgency: "medium",
    contactInfo: "",
  });

  const organsList = ["Heart", "Liver", "Kidney", "Lungs", "Pancreas", "Intestines", "Corneas"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalSubmit = async () => {
    setisloading(true);
    // console.log("Form Data:", formData);

    let recipientdata = {
      ...formData,
      recipientId:nextID,
    };
    // console.log("Recipient Data:", recipientdata);

    const cid = await uploadRecipientData(recipientdata);
    console.log("cid:", cid);
    const tx = await contractSigner.registerRecipient(recipientdata.recipientId, cid);
    await tx.wait();

    toast('Registration Successful', {
      style: {
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '16px',
        borderRadius: '8px',
        padding: '12px 24px',
      },
      duration: 3000,
    });

    setisloading(false);
    setTimeout(() => {
      navigate("/");
    }, 300);
    runMatching();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowDialog(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Recipient Registration</h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">

          <div>
            <Label htmlFor="name" className="my-3">Name</Label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="age" className="my-3">Age</Label>
            <Input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="bloodType" className="my-3">Blood Type</Label>
            <Input type="text" name="bloodType" value={formData.bloodType} onChange={handleChange} required />
          </div>

          <div>
            <Label className="my-3">Required Organ</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, requiredOrgan: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Organ" />
              </SelectTrigger>
              <SelectContent>
                {organsList.map((organ) => (
                  <SelectItem key={organ} value={organ}>
                    {organ}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="my-3">Urgency Level</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contactInfo" className="my-3">Contact Info</Label>
            <Input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
          </div>

          <Button
            type="submit"
            disabled={isloading}
            className={`w-full ${isloading ? "bg-blue-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white py-2`}
          >
            {isloading ? "Registering..." : "Register Recipient"}
          </Button>
        </form>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Registration</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-sm text-left space-y-1">
                <p><strong>ID:</strong> {nextID}</p>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Age:</strong> {formData.age}</p>
                <p><strong>Blood Type:</strong> {formData.bloodType}</p>
                <p><strong>Required Organ:</strong> {formData.requiredOrgan}</p>
                <p><strong>Urgency:</strong> {formData.urgency}</p>
                <p><strong>Contact:</strong> {formData.contactInfo}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecipientRegistration;
