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
import ShineBorder from '../ui/shine-border';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const { loginWithPopup, logout, user, isAuthenticated } = useAuth0();
    const context = useContext(myContext);
    const { toggleMode, mode } = context;
    const cartItems = useSelector((state) => state.cart);
    const cartCount = cartItems.length;
    const [verifiedUser, setVerifiedUser] = useState(false);
    const [userData, setUserData] = useState({});
    const [scrollDirection, setScrollDirection] = useState("up");
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        setUserData(storedUser);
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

                const userData = {
                    uid: user.sub,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    verified: response.data.verified
                };

                setUserData(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (error) {
                console.log("Error: ", error);
            }
        };

        if (isAuthenticated) {
            if (!userData || !userData.verified) {
                fetchUser();

                if (!verifiedUser) {
                    sendOtp(user?.email);
                    setShowPopup(true);
                }
            } else {
                setVerifiedUser(userData.verified);
            }
        } else {
            setUserData(null);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScrollPosition && currentScroll > 50) {
                setScrollDirection("down");
            } else if (currentScroll < lastScrollPosition) {
                setScrollDirection("up");
            }
            setLastScrollPosition(currentScroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollPosition]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUserData(null);
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
        <div className={`sticky top-0 z-50  transition-transform duration-300 ${scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"} bg-black`}>
            {showPopup && (
                <Transition appear show={showPopup} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={closePopup}>
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black p-6 shadow-xl transition-all">
                                <button type="button" className="absolute top-3 right-3 bg-black text-gray-400 hover:text-gray-500" onClick={closePopup}>
                                    <RxCross2 size={24} />
                                </button>
                                <ShineBorder className="relative flex h-1/2 flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl" color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
                                    <MultiStepForm closePopup={closePopup} />
                                </ShineBorder>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                </Transition>
            )}

            {/* Mobile Menu */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
                    <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                            <Dialog.Panel className={`relative flex w-full max-w-xs flex-col overflow-y-auto pb-12 shadow-xl bg-black text-white`}>
                                <div className="flex px-4 pb-2 pt-28">
                                    <button type="button" className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400" onClick={() => setOpen(false)}>
                                        <RxCross2 />
                                    </button>
                                </div>
                                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                    <Link to="/allproducts" className="text-sm font-medium hover:text-blue-500 transition duration-200">All Products</Link>
                                    {isAuthenticated && <Link to="/order" className="-m-2 block p-2 font-medium hover:text-blue-500 transition duration-200">Order</Link>}
                                    {userData?.email === 'durshbeats@gmail.com' && <Link to="/dashboard" className="-m-2 block p-2 font-medium hover:text-blue-500 transition duration-200">Admin</Link>}
                                    {isAuthenticated ? (
                                        <button onClick={handleLogout} className="-m-2 block p-2 font-medium cursor-pointer hover:text-blue-500 transition duration-200">Logout</button>
                                    ) : (
                                        <button onClick={loginWithPopup} className="-m-2 block p-2 font-medium cursor-pointer hover:text-blue-500 transition duration-200">Login</button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Header */}
            <header className="relative bg-black text-white">
                <nav aria-label="Top" className="bg-black px-4 sm:px-6 lg:px-8 shadow-xl">
                    <div className="flex h-16 items-center">
                        <button type="button" className="rounded-md bg-white p-2 text-gray-400 lg:hidden hover:bg-gray-200 transition duration-200" onClick={() => setOpen(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                        <div className="ml-4 flex lg:ml-0">
                            <Link to="/" className="text-2xl font-bold px-2 py-1 hover:text-blue-500 transition duration-200">DURSH</Link>
                        </div>
                        <div className="ml-auto flex items-center">
                            <div className="hidden space-x-8 lg:flex">
                                <Link to="/allproducts" className="text-sm font-medium hover:text-blue-500 transition duration-200">All Products</Link>
                                {isAuthenticated && <Link to="/order" className="-m-2 block p-2 font-medium hover:text-blue-500 transition duration-200">Order</Link>}
                                {userData?.email === 'durshbeats@gmail.com' && <Link to="/dashboard" className="-m-2 block p-2 font-medium hover:text-blue-500 transition duration-200">Admin</Link>}
                                {isAuthenticated ? (
                                    <button onClick={handleLogout} className="-m-2 block p-2 font-medium cursor-pointer hover:text-blue-500 transition duration-200">Logout</button>
                                ) : (
                                    <button onClick={loginWithPopup} className="-m-2 block p-2 font-medium cursor-pointer hover:text-blue-500 transition duration-200">Login</button>
                                )}
                            </div>
                            <button onClick={toggleMode} className="ml-4 p-2 hover:bg-gray-200 transition duration-200 rounded-full">
                                {mode === 'dark' ? <BsFillCloudSunFill size={24} /> : <FiSun size={24} />}
                            </button>
                            <Link to="/cart" className="ml-4 group -m-2 flex items-center p-2">
                                <span className="sr-only">Cart</span>
                                <svg className="h-6 w-6 group-hover:text-blue-500 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.25 2M7 13h10l4-8H5l2 8zm5 2v2m4 0v2m-8-6h8"></path>
                                </svg>
                                <span className="ml-2 text-sm font-medium">{cartCount}</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}
