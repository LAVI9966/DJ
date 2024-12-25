import React, { useContext, useState } from "react";
import MyContext from "../../context/data/myContext";

function ContactUs() {
    const context = useContext(MyContext);
    const { contactref } = context;

    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.name) formErrors.name = "Name is required.";
        if (!formData.email) formErrors.email = "Email is required.";
        if (!formData.message) formErrors.message = "Message is required.";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const mailtoLink = `mailto:durshbeats@gmail.com?subject=Message from ${encodeURIComponent(
                formData.name
            )}&body=${encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
            )}`;
            window.location.href = mailtoLink;
        }
    };

    return (
        <div ref={contactref} className="bg-black text-white flex flex-col md:flex-row w-full min-h-screen py-8" id="contactme">
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center md:text-left space-y-4">
                    <h1 className="text-4xl font-semibold">Contact Me</h1>
                    <p>
                        <a
                            href="mailto:durshbeats@gmail.com"
                            className="text-white hover:text-red-500"
                        >
                            Email: durshbeats@gmail.com
                        </a>
                    </p>
                    <p>
                        <a href="tel:6261560119" className="text-white hover:text-red-500">
                            Phone: 6261560119
                        </a>
                    </p>
                    <div className="flex space-x-6 mt-6">
                        <a
                            href="https://www.facebook.com/durshmusicindia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-500"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://www.instagram.com/durshmusic"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-500"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://www.youtube.com/@DurshMusic"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-500"
                        >
                            YouTube
                        </a>
                        <a
                            href="https://open.spotify.com/artist/10tPox05MUPQeKKo5qG1Xc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-500"
                        >
                            Spotify
                        </a>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <form onSubmit={handleSubmit} className="w-full md:w-3/4 space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 text-black rounded-md"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 text-black rounded-md"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 text-black rounded-md"
                    />
                    {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}

                    <button type="submit" className="border-2 border-red-500 text-white py-2 px-4 rounded-md hover:bg-red-500">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ContactUs;
