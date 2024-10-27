import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export default function OTPVerification({ nextStep, setVerified }) {
    const inputsRef = useRef([]);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth0();

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        inputsRef.current[index].value = value.slice(0, 1);
        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus();
        }
        setOtp(inputsRef.current.map((input) => input.value).join(""));
    };

    const handleKeyDown = (e, index) => {
        if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace") e.preventDefault();
        if (e.key === "Backspace" && index > 0 && !e.target.value) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text").slice(0, 4);
        if (!/^\d{4}$/.test(data)) return;
        data.split("").forEach((num, i) => (inputsRef.current[i].value = num));
        setOtp(data);
        inputsRef.current[3].focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/verifyotp", {
                email: user.email,
                otp,
            });
            console.log("OTP Verified:", response);
            if (response.status == 200) {
                if (nextStep) {
                    setVerified(true);
                    nextStep();
                }
            }
        } catch (err) {
            console.error("Verification Failed:", err);
            setError("OTP verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        inputsRef.current.forEach((input, index) => {
            input.addEventListener("keydown", (e) => handleKeyDown(e, index));
            input.addEventListener("paste", handlePaste);
        });

        // return () => {
        //     inputsRef.current.forEach((input) => {
        //         input.removeEventListener("keydown", handleKeyDown);
        //         input.removeEventListener("paste", handlePaste);
        //     });
        // };
    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold">Verify Email and Continue</h1>
            <p className="text-slate-500">
                Enter the 4-digit verification code sent to your phone.
            </p>
            <div className="flex justify-center gap-3">
                {Array(4)
                    .fill(0)
                    .map((_, i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength="1"
                            ref={(el) => (inputsRef.current[i] = el)}
                            onChange={(e) => handleInputChange(e, i)}
                            className="w-14 h-14 text-center text-2xl font-bold bg-slate-100 border rounded focus:ring-indigo-300"
                        />
                    ))}
            </div>
            <button
                type="submit"
                disabled={loading}
                className={`w-full mt-4 py-2 bg-indigo-500 text-white rounded ${loading ? "opacity-50" : "hover:bg-indigo-600"
                    }`}
            >
                {loading ? "Verifying..." : "Verify Account"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <p className="text-sm text-slate-500 mt-2">
                Didn't receive the code?{" "}
                <a href="#0" className="text-indigo-500 hover:text-indigo-600">
                    Resend
                </a>
            </p>
        </form>
    );
}
