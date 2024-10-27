import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { BsFillCloudSunFill } from 'react-icons/bs';
import { FiSun } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { useSelector } from 'react-redux';
import myContext from '../../context/data/myContext';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import MultiStepForm from './Otpanddatataker';
import ShineBorder from "../ui/shine-border";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const { loginWithPopup, logout, user, isAuthenticated } = useAuth0();
    const context = useContext(myContext);
    const { toggleMode, mode } = context;
    const cartItems = useSelector((state) => state.cart);
    const cartCount = cartItems.length;
    const [verifiedUser, setVerifiedUser] = useState(false);
    const [userData, setUserData] = useState({})

    useEffect(() => {
        // Initialize userData from local storage if it exists
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getuser', { params: { email: user?.email } });
                console.log("Response from fetchUser: ", response);

                if (response.data.verified) {
                    setVerifiedUser(true);
                    setShowPopup(false);
                }

                // Update userData and store it in local storage
                const userData = {
                    uid: user.sub,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    verified: response.data.verified // Also storing verification status
                };

                setUserData(userData);
                localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage

            } catch (error) {
                console.log("Error: ", error);
            }
        }

        // Check authentication and user data
        if (isAuthenticated) {
            // Check if user data is available from local storage
            if (!userData || !userData.verified) {
                fetchUser();

                // If user is not verified, send OTP
                if (!verifiedUser) {
                    sendOtp(user?.email);
                    setShowPopup(true);
                }
            } else {
                // User is authenticated and data is available
                setVerifiedUser(userData.verified);
            }
        } else {
            setUserData(null); // Clear user data if not authenticated
        }
    }, [isAuthenticated, user]);

    const handleLogout = () => {
        localStorage.removeItem('user'); // Remove user from local storage on logout
        setUserData(null); // Clear local user data state
        logout({ returnTo: window.location.origin });
    };

    const sendOtp = async (email) => {
        try {
            const response = await axios.post('http://localhost:3000/send_otp_email', { email });
            console.log("OTP response: ", response);
        } catch (error) {
            console.log(error.message);
        }
    };

    const closePopup = () => setShowPopup(false);

    return (
        <div className={`sticky top-0 z-50 transition-colors duration-300 ${mode === 'dark' ? 'bg-black text-white' : 'bg-white'}`}>
            {showPopup && (
                <Transition appear show={showPopup} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={closePopup}>
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            {/* <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black p-6 shadow-xl transition-all">
                                <button
                                    type="button"
                                    className="absolute top-3 right-3 bg-black text-gray-400 hover:text-gray-500"
                                    onClick={closePopup}
                                >
                                    <RxCross2 size={24} />
                                </button> */}
                            <ShineBorder
                                className="relative flex h-1/2 flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
                                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                            >

                                <MultiStepForm closePopup={closePopup} />
                            </ShineBorder>
                            {/* </Dialog.Panel> */}
                        </div>
                    </Dialog>
                </Transition>
            )}

            {/* Mobile Menu */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className={`relative flex w-full max-w-xs flex-col overflow-y-auto pb-12 shadow-xl ${mode === 'dark' ? 'bg-gray-900 text-black' : 'text-gray-900'}`}>
                                <div className="flex px-4 pb-2 pt-28">
                                    <button
                                        type="button"
                                        className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                                        onClick={() => setOpen(false)}
                                    >
                                        <RxCross2 />
                                    </button>
                                </div>
                                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                    <Link to="/allproducts" className="text-sm font-medium hover:text-blue-500 transition duration-200">
                                        All Products
                                    </Link>
                                    {isAuthenticated && (
                                        <Link to="/order" className="-m-2 block p-2 font-medium hover:text-blue-500 transition duration-200">
                                            Order
                                        </Link>
                                    )}
                                    {userData?.email === 'admin@gmail.com' && (
                                        <Link to="/dashboard" className="-m-2 block p-2 font-medium hover:text-blue-500 transition duration-200">
                                            Admin
                                        </Link>
                                    )}
                                    {isAuthenticated ? (
                                        <button
                                            onClick={handleLogout}
                                            className="-m-2 block p-2 font-medium cursor-pointer hover:text-blue-500 transition duration-200"
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <button
                                            onClick={loginWithPopup}
                                            className="-m-2 block p-2 font-medium cursor-pointer hover:text-blue-500 transition duration-200"
                                        >
                                            Login
                                        </button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Header */}
            <header className={`relative ${mode === 'dark' ? '' : 'bg-white'}`}>
                <nav aria-label="Top" className={`bg-gray-100 px-4 sm:px-6 lg:px-8 shadow-xl ${mode === 'dark' ? 'bg-gray-800 text-white' : 'text-gray-900'}`}>
                    <div className="flex h-16 items-center">
                        <button
                            type="button"
                            className="rounded-md bg-white p-2 text-gray-400 lg:hidden hover:bg-gray-200 transition duration-200"
                            onClick={() => setOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>

                        <div className="ml-4 flex lg:ml-0">
                            <Link to="/" className="text-2xl font-bold">
                                <span className="text-blue-500">Your Logo</span>
                            </Link>
                        </div>

                        <div className="ml-auto flex items-center">
                            <div className="hidden lg:flex">
                                <Link to="/allproducts" className="text-sm font-medium hover:text-blue-500 transition duration-200">
                                    All Products
                                </Link>
                                {isAuthenticated && (
                                    <Link to="/order" className="ml-4 text-sm font-medium hover:text-blue-500 transition duration-200">
                                        Order
                                    </Link>
                                )}
                                {userData?.email === 'admin@gmail.com' && (
                                    <Link to="/dashboard" className="ml-4 text-sm font-medium hover:text-blue-500 transition duration-200">
                                        Admin
                                    </Link>
                                )}
                                {isAuthenticated ? (
                                    <button
                                        onClick={handleLogout}
                                        className="ml-4 text-sm font-medium cursor-pointer hover:text-blue-500 transition duration-200"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <button
                                        onClick={loginWithPopup}
                                        className="ml-4 text-sm font-medium cursor-pointer hover:text-blue-500 transition duration-200"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}
