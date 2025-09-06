import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { contractProvider, contractSigner } from "@/contract";
import { uploadDataToPinata } from "@/main";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger
} from "../components/ui/alert-dialog";

const DonorRegistration = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const [nextID,setnextID] = useState("");
  const [isloading,setisloading] = useState(false);
  
  const [userLocation, setUserLocation] = useState(null);

  useEffect(()=>{
    async function getnextID(){
      const id = await contractProvider.getCurrentAvailableDonorID();
      setnextID("D" + String(Number(id)));
    }
    getnextID();
  },[]);

  // Fetch location once when component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setUserLocation(null); // fallback if denied or error
        }
      );
    } else {
      setUserLocation(null);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodType: "",
    organsAvailable: [],
    contactInfo: "",
    status: "unavailable",
  });

  const organsList = ["Heart", "Liver", "Kidney", "Lungs", "Pancreas", "Intestines", "Corneas"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrganChange = (organ) => {
    setFormData((prev) => ({
      ...prev,
      organsAvailable: prev.organsAvailable.includes(organ)
        ? prev.organsAvailable.filter((item) => item !== organ)
        : [...prev.organsAvailable, organ],
    }));
  };

  const handleConfirmSubmit = async () => {
    setisloading(true);
    // console.log("Form Data:", formData);
    let donordata = {
      ...formData,
      donorId:nextID,
      location: userLocation
    };
    console.log("Donor Data:", donordata);

    const toastId = toast.loading('Registering...', {
      position: 'bottom-right',
      style: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: '16px',
        borderRadius: '8px',
        padding: '12px 24px',
      },
    });
    try{
      const cid = await uploadDataToPinata(donordata);
      // console.log("cid:", cid);
      const tx = await contractSigner.registerDonor(donordata.donorId, cid);
      await tx.wait();

      toast.success('Registration Successful', { id: toastId });
    }catch(error){
      console.error('Registration failed:', error);
      toast.error('Registration Failed', { id: toastId });
    }
    
    setisloading(false);
    setTimeout(() => {
      navigate("/");
    }, 300);
    // runMatching();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Donor Registration</h2>
        <form onSubmit={(e) => { e.preventDefault(); setOpenDialog(true); }} className="space-y-4">

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
            <Label className="my-3">Organs Available</Label>
            <div className="grid grid-cols-2 gap-2">
              {organsList.map((organ) => (
                <Button
                  key={organ}
                  type="button"
                  className={`px-4 py-2 ${formData.organsAvailable.includes(organ) ? "bg-blue-600 text-white" : "bg-gray-300 hover:bg-gray-700"}`}
                  onClick={() => handleOrganChange(organ)}
                >
                  {organ}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="contactInfo" className="my-3">Contact Info</Label>
            <Input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
          </div>

          <div>
            <Label className="my-3">Status</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="available">Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isloading}
            className={`w-full ${isloading ? "bg-blue-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white py-2`}
          >
            {isloading ? "Registering..." : "Register Donor"}
          </Button>

        </form>
      </div>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Donor Details</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-left text-sm text-muted-foreground">
                <p><strong>Donor ID:</strong> {nextID}</p>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Age:</strong> {formData.age}</p>
                <p><strong>Blood Type:</strong> {formData.bloodType}</p>
                <p><strong>Organs Available:</strong> {formData.organsAvailable.join(", ")}</p>
                <p><strong>Contact Info:</strong> {formData.contactInfo}</p>
                <p><strong>Status:</strong> {formData.status}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default DonorRegistration;
