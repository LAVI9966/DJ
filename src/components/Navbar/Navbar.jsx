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

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const { loginWithPopup, logout, user, isAuthenticated } = useAuth0();
    const context = useContext(myContext);
    const { toggleMode, mode } = context;
    const [userFromDb, setuserFromDb] = useState('');
    const cartItems = useSelector((state) => state.cart);
    const cartCount = cartItems.length;
    const [verifiedUser, setverifiedUser] = useState(false);
    useEffect(() => {
        const fetchuser = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getuser', { params: { email: user.email } });
                console.log("respose from fetchuser ", response);
                if (response.data.verified) {
                    setverifiedUser(true);
                    setShowPopup(false);
                }
            } catch (error) {
                console.log("err ", error);
            }
        }
        console.log("Auth 0  ka user he ye ", user.email_verified);
        if (isAuthenticated) {
            fetchuser();
            const userData = {
                user: {
                    uid: user.sub,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                }
            };
            if (!verifiedUser) {
                if (!localStorage.getItem('user')) {
                    sendotp(user?.email);
                    setShowPopup(true);
                }
            }
            localStorage.setItem('user', JSON.stringify(userData));
        }
    }, [isAuthenticated, user]);
    const handleLogout = () => {
        localStorage.clear();
        logout({ returnTo: window.location.origin });
    };

    const sendotp = async (email) => {
        try {
            const response = await axios.post('http://localhost:3000/send_otp_email', { email });
            console.log("otp response ", response);
        } catch (error) {
            console.log(error.message);
        }
    };

    const closePopup = () => setShowPopup(false);

    return (
        <div className={`sticky top-0 z-50 transition-colors duration-300 ${mode === 'dark' ? 'black' : 'bg-white'}`}>
            {showPopup && (
                <Transition appear show={showPopup} as={Fragment}>
                    <Dialog as="div" className="relative " onClose={closePopup}>
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <button
                                    type="button"
                                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
                                    onClick={closePopup}
                                >
                                    <RxCross2 size={24} />
                                </button>
                                <MultiStepForm closePopup={closePopup} />
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                </Transition>
            )}

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
                                    {user?.email === 'admin@gmail.com' && (
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
                            <Link to="/" className="text-2xl font-bold px-2 py-1 hover:text-blue-500 transition duration-200">
                                DURSH
                            </Link>
                        </div>

                        <div className="ml-auto flex items-center">
                            <div className="hidden lg:flex lg:space-x-6">
                                <Link to="/allproducts" className="text-sm font-medium hover:text-blue-500 transition duration-200">
                                    All Products
                                </Link>
                                {isAuthenticated && (
                                    <Link to="/order" className="text-sm font-medium hover:text-blue-500 transition duration-200">
                                        Order
                                    </Link>
                                )}
                                {user?.email === 'admin@gmail.com' && (
                                    <Link to="/dashboard" className="text-sm font-medium hover:text-blue-500 transition duration-200">
                                        Admin
                                    </Link>
                                )}
                                {isAuthenticated ? (
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium hover:text-blue-500 transition duration-200"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <button
                                        onClick={loginWithPopup}
                                        className="text-sm font-medium hover:text-blue-500 transition duration-200"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>

                            <button onClick={toggleMode} className="ml-6 text-gray-600 hover:text-blue-500 transition duration-200">
                                {mode === 'light' ? <FiSun size={30} /> : <BsFillCloudSunFill size={30} />}
                            </button>

                            <Link to="/cart" className="ml-4 p-2 bg-gray-200 rounded-lg relative hover:bg-gray-300 transition duration-200">
                                <span className="sr-only">Cart</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.587 0 1.1.408 1.23.979L6.339 9.75m0 0h11.772c.909 0 1.504.953 1.111 1.766l-2.86 5.906a1.125 1.125 0 01-1.003.578H7.578a1.125 1.125 0 01-1.003-.578l-2.86-5.906A1.125 1.125 0 014.637 9.75H6.34zm1.126 9a1.125 1.125 0 101.125-1.125A1.125 1.125 0 007.465 18.75zm9.375 0a1.125 1.125 0 101.125-1.125 1.125 1.125 0 00-1.125 1.125z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 mt-1 mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}
