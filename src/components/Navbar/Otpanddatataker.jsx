import React, { useState, useEffect } from "react";
import OTPVerification from "./OTPVerification";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import TypingAnimation from "../ui/typing-animation";
import { toast } from 'react-toastify'; // Import toast

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
                    toast.error("Your email is not verified. Please verify your email first."); // Toast for email verification
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
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/adduser`, { userData });
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
                toast.success("User registered successfully!"); // Success toast
                closePopup(false);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Registration failed. Please try again."); // Error toast
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    return (
        <div className="px-6 bg-black text-white rounded-lg shadow-lg">
            <TypingAnimation
                className="text-4xl py-4 font-bold text-white"
                text="Contact Details"
            />
            {currentStep === 1 && !isGoogleLogin ? (
                <OTPVerification nextStep={nextStep} setVerified={setVerified} />
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2">
                            {["legalName", "artistName", "streetAddress", "pincode"].map((field, index) => (
                                <div className="px-5 mb-4" key={index}>
                                    <label className="block mb-1 font-medium" htmlFor={field}>
                                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </label>
                                    <Input
                                        type="text"
                                        name={field}
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="w-full md:w-1/2">
                            {["state", "country", "phoneNumber"].map((field, index) => (
                                <div className="px-5 mb-4" key={index}>
                                    <label className="block mb-1 font-medium" htmlFor={field}>
                                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </label>
                                    <Input
                                        type="text"
                                        name={field}
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
                                    />
                                </div>
                            ))}
                            <div className="flex px-5 justify-between mt-4">
                                <Button type="submit">Save</Button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default MultiStepForm;
