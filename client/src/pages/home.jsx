import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEthereum, FaHeartbeat, FaShieldAlt, FaRegHandshake } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import './home.css'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateDonorStatus } from "../main";

const LandingPage = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("deceased");
    const [donorId, setDonorId] = useState("");
    const [showButtons, setShowButtons] = useState(true);
    const whiteSectionRef = useRef(null);
    const [isWhiteVisible, setIsWhiteVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setShowButtons(false);
            } else {
                setShowButtons(true);
            }

            if (whiteSectionRef.current) {
                const rect = whiteSectionRef.current.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight;
                setIsWhiteVisible(isVisible);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
            setDonorId("");
            setStatus("");
        } catch (error) {
            console.error("Failed to update donor status:", error);
            toast.error("Failed to update status. Check console for details.");
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <header className="relative flex items-center justify-center h-screen p-8 bg-cover bg-center text-white overflow-hidden"
    //style={{ backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEyL3Jhd3BpeGVsb2ZmaWNlMjFfMmRfbWluaW1hbF9ncnBoaWNfb2ZfYmxvY2tjaGFpbl9jdWJlc19uZXR3b3JrX182NjExODM0My0xZWQ5LTRiOGUtYTdmOC03ZTc0ODEzZWEwNTNfMS5qcGc.jpg')` }}
>
    <div className="absolute inset-0 opacity-20"></div>
    <div className="relative z-10 text-center max-w-5xl animate-slide-up">
        <div className="header-container">
            <div className="header-content">
                <h1 className="main-title" aria-label="Decentralized Organ Donation System">Decentralized Organ Donation System</h1>
                <div className="subtitle">A secure, transparent, and tamper-proof organ donation system powered by blockchain technology</div>
                <div className="header-decoration"></div>
            </div>
        </div>
        {showButtons && (
            
            <div className="flex justify-center items-start gap-12 mt-8">
                 <div className="flex flex-col items-center w-60 text-center">
                    <img src="https://thumbs.dreamstime.com/b/organ-donation-concept-hand-giving-heart-organ-donation-concept-hand-giving-heart-surgeons-background-99199301.jpg" alt="Be a Donor" className="w-75 h-60 object-cover rounded-lg mb-3"  />
                    <p className="text-lg font-bold text-green-800">Give Life, Be a Donor 💚</p>
                </div>
                 <div className="flex flex-col gap-4 items-center">
                    <button onClick={() => navigate('/donor-registration')} className="button-79">Donor Registration</button>
                    <button onClick={() => navigate('/recipient-registration')} className="button-79">Recipient Registration</button>
                    <button onClick={() => navigate('/getMatchedRecords')} className="button-79">View Matched Records</button>
                    <button onClick={() => navigate('/getTransplantedRecords')} className="button-79">Transplant Records</button>
             </div>     
                <div className="flex flex-col items-center w-60 text-center">
                    <img src="https://www.sakraworldhospital.com/assets/spl_splimgs/organ-donation-2020-1.webp" alt="Save Lives" className="w-75 h-60 object-cover rounded-lg mb-3"  />
                    <p className="text-lg font-bold text-red-800">One Donor Can Save Many Lives ❤️</p>
                </div>
            </div>
        )}

        <div className="mt-6">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="donor-status-btn bg-red-600 text-white hover:bg-red-800 cursor-pointer button-79">
                        Update Donor Status
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6 border-0">
                    <AlertDialogHeader className="text-center mb-4">
                        <AlertDialogTitle className="text-2xl font-semibold text-gray-800">
                            Update Donor Status
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-600 mt-2">
                            Enter the donor ID and select the appropriate status to update donor information.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="mb-4">
                        <Label className="block text-sm font-medium text-gray-700 mb-1">Donor ID</Label>
                        <Input
                            value={donorId}
                            onChange={(e) => setDonorId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-organ-primary focus:border-organ-primary transition-all"
                            placeholder="Enter donor ID"
                        />
                    </div>

                    <div className="mb-6">
                        <Label className="block text-sm font-medium text-gray-700 mb-1">Status</Label>
                        <Select
                            defaultValue="deceased"
                            onValueChange={(value) => setStatus(value)}
                        >
                            <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-organ-primary focus:border-organ-primary transition-all">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned" className="bg-white border-0 shadow-lg rounded-lg">
                                <SelectItem value="deceased" className="p-2 cursor-pointer hover:bg-gray-100 rounded-md">Deceased</SelectItem>
                                <SelectItem value="alive" disabled className="p-2 text-gray-400">Alive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <AlertDialogFooter className="flex justify-between">
                        <AlertDialogCancel className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSubmitStatus}
                            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300"
                        >
                            Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-blue-100 to-transparent"></div>
</header>

            {/* Remainder of the page with white background */}
            <div ref={whiteSectionRef} className={isWhiteVisible ? "bg-white" : ""}>
                {/* Features Section */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose Blockchain?</h2>
                        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
                            Our platform leverages blockchain technology to ensure security, transparency, and trust
                            in the organ donation process.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="feature-card p-6 group border-2 rounded-lg transition-all transform hover:-translate-y-2 hover:shadow-lg">
                                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                                    <FaShieldAlt className="h-7 w-7 text-organ-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-center mb-3">Security</h3>
                                <p className="text-gray-600 text-center">
                                    Advanced encryption protects sensitive donor and recipient data while ensuring integrity of all
                                    records.
                                </p>
                            </div>

                            <div className="feature-card p-6 group border-2 rounded-lg transition-all transform hover:-translate-y-2 hover:shadow-lg">
                                <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                                    <FaHeartbeat className="h-7 w-7 text-organ-secondary" />
                                </div>
                                <h3 className="text-xl font-semibold text-center mb-3">Transparency</h3>
                                <p className="text-gray-600 text-center">
                                    Immutable blockchain records ensure complete transparency and auditability throughout the
                                    donation process.
                                </p>
                            </div>

                            <div className="feature-card p-6 group border-2 rounded-lg transition-all transform hover:-translate-y-2 hover:shadow-lg">
                                <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4 mx-auto">
                                    <FaRegHandshake className="h-7 w-7 text-organ-tertiary" />
                                </div>
                                <h3 className="text-xl font-semibold text-center mb-3">Decentralization</h3>
                                <p className="text-gray-600 text-center">
                                    Distributed network ensures no single entity controls the donation process, preventing
                                    manipulation.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 px-6 bg-gradient-to-br from-organ-primary/5 to-organ-secondary/5">
    <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Transforming Organ Donation</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat-card p-6 group border rounded-lg transition-all transform hover:-translate-y-2 hover:shadow-lg">
                <div className="text-4xl font-bold text-green-500 mb-2 animate-pulse-gentle">100%</div>
                <p className="text-gray-600">Record Accuracy</p>
            </div>

            <div className="stat-card p-6 group border rounded-lg transition-all transform hover:-translate-y-2 hover:shadow-lg">
                <div className="text-4xl font-bold text-blue-500 mb-2 animate-pulse-gentle">0%</div>
                <p className="text-gray-600">Data Manipulation</p>
            </div>

            <div className="stat-card p-6 group border rounded-lg transition-all transform hover:-translate-y-2 hover:shadow-lg">
                <div className="text-4xl font-bold text-green-500 mb-2 animate-pulse-gentle">24/7</div>
                <p className="text-gray-600">System Availability</p>
            </div>

            <div className="stat-card p-6 group border rounded-lg transition-all transform hover:-translate-y-2 hover:shadow-lg">
                <div className="text-4xl font-bold text-blue-500 mb-2 animate-pulse-gentle">100%</div>
                <p className="text-gray-600">Process Transparency</p>
            </div>
        </div>
    </div>
</section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-6 md:mb-0">
                                <div className="flex items-center justify-center md:justify-start">
                                    <FaEthereum className="text-3xl mr-3 text-organ-secondary" />
                                    <span className="text-xl font-bold">Decentralized Organ Donation</span>
                                </div>
                                <p className="mt-2 text-gray-400 text-sm">
                                    A secure and transparent platform powered by blockchain.
                                </p>
                            </div>

                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Use</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
                            <p className="text-gray-500 text-sm">
                                &copy; {new Date().getFullYear()} Decentralized Organ Donation. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;

