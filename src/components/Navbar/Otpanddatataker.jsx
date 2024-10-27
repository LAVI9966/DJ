import React, { useState, useEffect } from "react";
import OTPVerification from "./OTPVerification";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import TypingAnimation from "../ui/typing-animation";
const MultiStepForm = ({ closePopup }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        legalName: "",
        artistName: "",
        streetAddress: "",
        pincode: "",
        state: "",
        country: "",
        phoneNumber: "",
    });
    const { user, isLoading } = useAuth0();
    const [verified, setVerified] = useState(false);

    const isGoogleLogin = user?.sub?.startsWith("google-oauth2");
    const isEmailVerified = user?.email_verified;

    useEffect(() => {
        if (user) {
            if (isGoogleLogin) {
                if (isEmailVerified) {
                    setVerified(true);
                    setCurrentStep(2);
                } else {
                    alert("Your email is not verified. Please verify your email first.");
                    closePopup(false);
                }
            }
        }
    }, [isGoogleLogin, isEmailVerified, closePopup]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        const userData = {
            legalName: formData.legalName,
            artistName: formData.artistName,
            email: user.email,
            streetAddress: formData.streetAddress,
            pincode: formData.pincode,
            state: formData.state,
            country: formData.country,
            phoneNumber: formData.phoneNumber,
            uid: user.sub,
            verified,
        };

        try {
            const response = await axios.post("http://localhost:3000/adduser", { userData });
            console.log("User registered:", response);
            if (response.status === 201) {
                const storedUserData = {
                    user: {
                        uid: user.sub,
                        name: user.name,
                        email: user.email,
                        picture: user.picture,
                    },
                };

                if (!localStorage.getItem("user")) {
                    if (!isGoogleLogin) {
                        // Assuming sendotp is defined elsewhere
                        sendotp(user?.email);
                    }
                    localStorage.setItem("user", JSON.stringify(storedUserData));
                }
                closePopup(false);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    return (
        <div className=" px-6 black text-white rounded-lg ">
            <TypingAnimation
                className="text-4xl py-4 font-bold text-black dark:text-white"
                text="Contact Details"
            />
            {currentStep === 1 && !isGoogleLogin ? (
                <OTPVerification nextStep={nextStep} setVerified={setVerified} />
            ) : (
                <form onSubmit={handleSubmit} >
                    <div className="flex flex-row md:flex-row">
                        <div>
                            <div className="px-5">
                                <label className="block mb-1 font-medium" htmlFor="legalName">Legal Name</label>
                                <Input
                                    type="text"
                                    name="legalName"
                                    placeholder="Legal Name"
                                    value={formData.legalName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
                                />
                            </div>
                            <div className="px-5">
                                <label className="block mb-1 font-medium" htmlFor="artistName">Artist Name</label>
                                <Input
                                    type="text"
                                    name="artistName"
                                    placeholder="Artist Name"
                                    value={formData.artistName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
                                />
                            </div>
                            <div className="px-5">
                                <label className="block mb-1 font-medium" htmlFor="streetAddress">Street Address</label>
                                <Input
                                    type="text"
                                    name="streetAddress"
                                    placeholder="Streat Address"
                                    value={formData.streetAddress}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
                                />
                            </div>
                            <div className="px-5">
                                <label className="block mb-1 font-medium" htmlFor="pincode">Pincode</label>
                                <Input
                                    placeholder="Pincode"
                                    type="text"
                                    name="pincode"

                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="px-5">
                                <label className="block mb-1 font-medium" htmlFor="state">State</label>
                                <Input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    placeholder="State"
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
                                />
                            </div>
                            <div className="px-5">
                                <label className="block mb-1 font-medium" htmlFor="country">Country</label>
                                <Input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    placeholder="Country"
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
                                />
                            </div>
                            <div className="px-5">
                                <label className="block mb-1 font-medium" htmlFor="phoneNumber">Mobile No</label>
                                <Input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
                                />
                            </div>
                            <div className="flex px-5 justify-between mt-4">
                                {/* <button
                                    type="button"
                                    onClick={prevStep}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-150"
                                >
                                    Previous
                                </button> */}
                                <Button
                                    type="submit"

                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            )


            }
        </div>
    );
};

export default MultiStepForm;                    
