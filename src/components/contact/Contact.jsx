import React from "react";

function ContactUs() {
    return (
        <div className="bg-black text-white flex flex-col md:flex-row w-full min-h-screen py-8" id="contactme">
            {/* Left Section - Contact Text */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center md:text-left space-y-4">
                    <h1 className="text-4xl font-semibold">Contact Me</h1>
                    <p>
                        <a href="mailto:durshbeats@gmail.com" className="text-white hover:text-red-500">
                            Email: durshbeats@gmail.com
                        </a>
                    </p>
                    <p>
                        <a href="tel:6261560119" className="text-white hover:text-red-500">
                            Phone: 6261560119
                        </a>
                    </p>
                    <div className="flex space-x-6 mt-6">
                        <a href="https://www.facebook.com/durshmusicindia" className="hover:text-red-500">
                            Facebook
                        </a>
                        <a href="https://www.instagram.com/durshmusic" className="hover:text-red-500">
                            Instagram
                        </a>
                        <a href="https://www.youtube.com/@DurshMusic" className="hover:text-red-500">
                            YouTube
                        </a>
                        <a href="https://open.spotify.com/artist/10tPox05MUPQeKKo5qG1Xc" className="hover:text-red-500">
                            Spotify
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Section - Contact Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <form action="mailto:durshbeats@gmail.com" method="post" encType="text/plain" className="w-full md:w-3/4 space-y-4">
                    <input type="text" placeholder="Your Name" className="w-full p-3 bg-gray-100 text-black rounded-md" />
                    <input type="email" placeholder="Your Email" className="w-full p-3 bg-gray-100 text-black rounded-md" />
                    <textarea placeholder="Your Message" rows="5" className="w-full p-3 bg-gray-100 text-black rounded-md"></textarea>
                    <button type="submit" className="border-2 border-red-500 text-white py-2 px-4 rounded-md hover:bg-red-500">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ContactUs;
