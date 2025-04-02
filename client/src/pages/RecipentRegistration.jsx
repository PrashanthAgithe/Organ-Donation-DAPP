import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Import Sonner for notifications

const RecipientRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipientId: "",
    name: "",
    age: "",
    bloodType: "",
    requiredOrgan: "",
    urgency: "medium", // Default urgency
    contactInfo: "",
  });

  const organsList = ["Heart", "Liver", "Kidney", "Lungs", "Pancreas", "Intestines", "Corneas"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recipient Data:", formData);

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
      navigate("/home");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Recipient Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <Label htmlFor="recipientId">Recipient ID</Label>
            <Input type="text" name="recipientId" value={formData.recipientId} onChange={handleChange} required />
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
            <Label>Required Organ</Label>
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
            <Label>Urgency Level</Label>
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
            <Label htmlFor="contactInfo">Contact Info</Label>
            <Input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white py-2">Register Recipient</Button>
        </form>
      </div>
    </div>
  );
};

export default RecipientRegistration;
