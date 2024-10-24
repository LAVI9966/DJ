import { Fragment, useContext, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { BsFillCloudSunFill } from 'react-icons/bs'
import { FiSun } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import { useSelector } from 'react-redux'
import myContext from '../../context/data/myContext'

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const user = JSON.parse(localStorage.getItem('user'))

    const context = useContext(myContext)
    const { toggleMode, mode } = context

    // Get cart items from Redux store
    const cartItems = useSelector((state) => state.cart)
    const cartCount = cartItems.length

    const logout = () => {
        localStorage.clear('user')
    }

    return (
        <div className={`sticky top-0 z-50 transition-colors duration-300 ${mode === 'dark' ? 'black' : 'bg-white'}`}>
            {/* Mobile menu */}
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
                            <Dialog.Panel
                                className={`relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl transition-colors duration-300 ${mode === 'dark' ? 'bg-gray-900 text-black' : 'text-gray-900'}`}
                            >
                                <div className="flex px-4 pb-2 pt-28">
                                    <button
                                        type="button"
                                        className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <RxCross2 />
                                    </button>
                                </div>

                                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                    <Link
                                        to="/allproducts"
                                        className="text-sm font-medium hover:text-blue-500 transition duration-200"
                                    >
                                        All Products
                                    </Link>
                                    {user && (
                                        <Link
                                            to="/order"
                                            className="-m-2 block p-2 font-medium hover:text-blue-500 transition duration-200"
                                        >
                                            Order
                                        </Link>
                                    )}
                                    {user?.user?.email === 'admin@gmail.com' && (
                                        <Link
                                            to="/dashboard"
                                            className="-m-2 block p-2 font-medium hover:text-blue-500 transition duration-200"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                    {user ? (
                                        <Link
                                            to="/login"
                                            onClick={logout}
                                            className="-m-2 block p-2 font-medium cursor-pointer hover:text-blue-500 transition duration-200"
                                        >
                                            Logout
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                to="/signup"
                                                className="-m-2 block p-2 font-medium cursor-pointer hover:text-blue-500 transition duration-200"
                                            >
                                                Signup
                                            </Link>
                                            <Link
                                                to="/login"
                                                className="-m-2 block p-2 font-medium cursor-pointer hover:text-blue-500 transition duration-200"
                                            >
                                                Login
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop Navigation */}
            <header className={`relative transition-colors duration-300 ${mode === 'dark' ? '' : 'bg-white'}`}>
                <nav
                    aria-label="Top"
                    className={`bg-gray-100 px-4 sm:px-6 lg:px-8 shadow-xl transition-colors duration-300 ${mode === 'dark' ? 'bg-gray-800 text-white' : 'text-gray-900'}`}
                >
                    <div className="flex h-16 items-center">
                        <button
                            type="button"
                            className="rounded-md bg-white p-2 text-gray-400 lg:hidden hover:bg-gray-200 transition duration-200"
                            onClick={() => setOpen(true)}
                        >
                            <span className="sr-only">Open menu</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
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
                                {user && (
                                    <Link to="/order" className="text-sm font-medium hover:text-blue-500 transition duration-200">
                                        Order
                                    </Link>
                                )}
                                {user?.user?.email === 'admin@gmail.com' && (
                                    <Link to="/dashboard" className="text-sm font-medium hover:text-blue-500 transition duration-200">
                                        Admin
                                    </Link>
                                )}
                                {user ? (
                                    <Link to="/login" onClick={logout} className="text-sm font-medium hover:text-blue-500 transition duration-200">
                                        Logout
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/login" className="text-sm font-medium hover:text-blue-500 transition duration-200">
                                            Login
                                        </Link>
                                        <Link to="/signup" className="text-sm font-medium hover:text-blue-500 transition duration-200">
                                            Signup
                                        </Link>
                                    </>
                                )}
                            </div>

                            <button onClick={toggleMode} className="ml-6 text-gray-600 hover:text-blue-500 transition duration-200">
                                {mode === 'light' ? <FiSun size={30} /> : <BsFillCloudSunFill size={30} />}
                            </button>

                            {/* Cart Icon with Count */}
                            <Link to="/cart" className="ml-4 p-2 relative hover:text-blue-500 transition duration-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 3h1.386l.547 2.633A1.5 1.5 0 004.708 7h13.31a1.5 1.5 0 001.475-1.034l.547-2.633H21.75"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.75 20.25h10.5a1.5 1.5 0 001.5-1.5V7.5H5.25v11.25a1.5 1.5 0 001.5 1.5z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    )
}
