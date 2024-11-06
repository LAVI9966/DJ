import React from 'react'
import { Link } from 'react-router-dom';

const Nopage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center px-4">
                <h1 className="text-9xl font-extrabold tracking-widest text-red-500">404</h1>
                <div className="bg-blue-600 px-2 text-sm rounded rotate-12 inline-block">
                    Page Not Found
                </div>
                <p className="mt-4 text-lg md:text-xl text-gray-400">
                    Oops! The page you’re looking for doesn’t exist.
                </p>

                <div className="mt-10 flex justify-center">
                    <Link
                        to="/"
                        className="group relative inline-flex items-center justify-center overflow-hidden px-6 py-3 font-medium text-blue-600 transition duration-300 ease-out border border-gray-700 rounded-lg shadow-md hover:bg-blue-500"
                    >
                        <span className="absolute inset-0 flex items-center justify-center w-full h-full duration-300 -translate-x-full bg-gray-800 group-hover:translate-x-0 ease">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M19 13H5v-2h14v2z"></path>
                            </svg>
                        </span>
                        <span className="absolute flex items-center justify-center w-full h-full text-gray-300 transition-all duration-300 transform group-hover:translate-x-full ease">Home</span>
                        <span className="relative invisible">Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Nopage