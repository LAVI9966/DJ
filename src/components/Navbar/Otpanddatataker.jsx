import React, { useState } from "react";
import OTPVerification from "./OTPVerification";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const MultiStepForm = ({ closePopup }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        legalName: "",
        artistName: "",
        streetAddress: "",
        state: "",
        country: "",
        mobileNo: "",
    });
    const { user } = useAuth0();
    const [verified, setVerified] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    }
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            legalName: formData.legalName,
            artistName: formData.artistName,
            email: user.email,
            streetAddress: formData.streetAddress,
            state: formData.state,
            country: formData.country,
            mobileNo: formData.mobileNo,
            uid: user.sub,
            verified
        }
        try {
            const response = await axios.post('http://localhost:3000/adduser', { userData });
            console.log("User registered:", response);
            if (response.status == 201) {
                const userData = {
                    user: {
                        uid: user.sub,
                        name: user.name,
                        email: user.email,
                        picture: user.picture,
                    }
                }; if (!localStorage.getItem('user')) {
                    sendotp(user?.email);
                    setShowPopup(true);
                }
                localStorage.setItem('user', JSON.stringify(userData));
            }
            // Optionally, you can handle redirection or further steps here
            closePopup(false)
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg overflow-hidden">
            {currentStep === 1 ? (
                <OTPVerification nextStep={nextStep} setVerified={setVerified} />
            ) : (
                <form onSubmit={handleSubmit} className="transition-transform duration-500">
                    <h2 className="text-2xl font-bold mb-4">Step 2: Contact Details</h2>
                    <label className="block mb-2">
                        Legal Name:
                        <input
                            type="text"
                            name="legalName"
                            value={formData.legalName}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                        />
                    </label>
                    <label className="block mb-2">
                        Artist Name:
                        <input
                            type="text"
                            name="artistName"
                            value={formData.artistName}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                        />
                    </label>
                    <label className="block mb-2">
                        Street Address:
                        <input
                            type="text"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                        />
                    </label>
                    <label className="block mb-2">
                        State:
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                        />
                    </label>
                    <label className="block mb-2">
                        Country:
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                        />
                    </label>
                    <label className="block mb-4">
                        Mobile No:
                        <input
                            type="tel"
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                        />
                    </label>
                    <label className="block mb-4">
                        Verified:
                        <input
                            type="checkbox"
                            name="verified"
                            checked={formData.verified}
                            onChange={() => setFormData((prev) => ({ ...prev, verified: !prev.verified }))}
                            className="ml-2"
                        />
                    </label>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={prevStep}
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                        >
                            Previous
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default MultiStepForm;
