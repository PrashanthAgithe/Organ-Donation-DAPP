import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Import Sonner for notifications

const DonorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    donorId: "",
    name: "",
    age: "",
    bloodType: "",
    organsAvailable: [],
    contactInfo: "",
    status: "alive", // Default status
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Donor Data:", formData);

    // Show toast notification
    toast('Registration Successful',{
        style: {
          backgroundColor: '#4CAF50', // Green background
          color: 'white',
          fontSize: '16px',
          borderRadius: '8px',
          padding: '12px 24px',
        },
        duration: 3000, // Show for 5 seconds
      })

    // Redirect to home page after 2 seconds
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Donor Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <Label htmlFor="donorId">Donor ID</Label>
            <Input type="text" name="donorId" value={formData.donorId} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="bloodType">Blood Type</Label>
            <Input type="text" name="bloodType" value={formData.bloodType} onChange={handleChange} required />
          </div>

          <div>
            <Label>Organs Available</Label>
            <div className="grid grid-cols-2 gap-2">
              {organsList.map((organ) => (
                <Button
                  key={organ}
                  type="button"
                  className={`px-4 py-2 ${formData.organsAvailable.includes(organ) ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                  onClick={() => handleOrganChange(organ)}
                >
                  {organ}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="contactInfo">Contact Info</Label>
            <Input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
          </div>

          <div>
            <Label>Status</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alive">Alive</SelectItem>
                <SelectItem value="deceased">Deceased</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white py-2">Register Donor</Button>
        </form>
      </div>
    </div>
  );
};

export default DonorRegistration;
