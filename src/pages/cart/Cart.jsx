import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { deleteFromCart, clearCart } from '../../redux/cartSlice';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function Cart() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    const [totalAmount, setTotalAmount] = useState(0);
    const [userData, setUserData] = useState(null);
    const [isProfileComplete, setIsProfileComplete] = useState(false);

    const { user } = useAuth0();
    const userid = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getuser`, {
                    params: { email: userid.email }
                });

                if (response.data) {
                    // Check for profile completeness
                    const profileFields = [
                        'artistName',
                        'legalName',
                        'phoneNumber',
                        'streetAddress',
                        'pincode',
                        'state',
                        'country'
                    ];

                    const isComplete = profileFields.every(field =>
                        response.data[field] && response.data[field].trim() !== ''
                    );

                    setUserData({
                        artistName: response.data.artistName,
                        name: response.data.legalName,
                        email: response.data.email,
                        phoneNumber: response.data.phoneNumber,
                        streetAddress: response.data.streetAddress,
                        pincode: response.data.pincode,
                        state: response.data.state,
                        country: response.data.country,
                    });

                    setIsProfileComplete(isComplete);

                    // Only show toast if profile is incomplete
                    if (!isComplete) {
                        toast.warn("Please complete your profile to proceed with purchase", {
                            position: "top-center",
                            autoClose: 5000,
                        });
                    }
                } else {
                    // No user data found
                    toast.error("User profile not found. Please complete your profile.", {
                        position: "top-center",
                        autoClose: 5000,
                    });
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
                toast.error("Failed to fetch user profile. Please try again.", {
                    position: "top-center",
                });
            }
        };

        if (userid?.email) {
            getUser();
        }
    }, [user, userid]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const tempTotal = cartItems.reduce((acc, item) => acc + (item.selectedLicense?.price || 0), 0);
        setTotalAmount(tempTotal);
    }, [cartItems]);

    const grandTotal = totalAmount;

    const deleteCart = (item) => {
        dispatch(deleteFromCart({
            item_id: item._id,
            licence_id: item.selectedLicense._id
        }));
        toast.success('Item Deleted Successfully', {
            position: "bottom-right",
        });
    };

    const handleClearCart = () => {
        dispatch(clearCart());
        toast.info('Cart Cleared', {
            position: "bottom-right",
        });
    };

    const buyNow = async () => {
        // Check profile completeness before allowing purchase
        if (!isProfileComplete) {
            toast.error("Please Login Or complete your profile before making a purchase", {
                position: "top-center",
            });
            navigate('/profile');
            return;
        }

        const { uid, email } = userid || {};

        // Additional purchase validation checks (kept from previous implementation)
        if (user?.email_verified === false) {
            toast.error("Please verify your email before making a purchase", {
                position: "top-center",
            });
            return;
        }

        if (!uid || !email) {
            toast.error("Please log in to continue", {
                position: "top-center",
            });
            return;
        }

        // Rest of the payment processing remains the same...
        const options = {
            key: "rzp_test_PbSgvm23unv6ow",
            amount: grandTotal * 100,
            currency: "INR",
            order_receipt: `order_rcptid_${userData.name}`,
            name: "E-Bharat",
            description: "Track Purchase",
            handler: async (response) => {
                const paymentId = response.razorpay_payment_id;

                const orderInfo = {
                    cartItems: cartItems.map((item) => ({
                        id: item._id,
                        title: item.title,
                        imageUrl: item.image.url,
                        selectedLicense: {
                            name: item.selectedLicense?.name,
                            price: item.selectedLicense?.price,
                            licenseUrl: item.selectedLicense?.licenseUrl,
                        },
                    })),
                    addressInfo: { ...userData },
                    email,
                    paymentId,
                    userid: uid,
                    totalAmount: grandTotal,
                    date: new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }),
                };

                try {
                    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/orders`, orderInfo);
                    if (response.status === 201) {
                        toast.success('Payment Successful', {
                            position: "top-center",
                        });
                        handleClearCart();
                        navigate('/orders');
                    } else {
                        toast.error('Failed to store the order', {
                            position: "top-center",
                        });
                    }
                } catch (error) {
                    console.error("Error storing order: ", error.message);
                    toast.error('Failed to store the order', {
                        position: "top-center",
                    });
                }
            },
            theme: { color: "#3399cc" },
        };

        const pay = new window.Razorpay(options);
        pay.open();
    };

    // Existing render method remains the same
    return (
        <Layout>
            <div className={`min-h-screen pt-28 pb-16 transition-all ${mode === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Your Cart</h1>

                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-6">
                    {/* Cart Items Section */}
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className={`
                                        flex flex-col sm:flex-row items-center 
                                        shadow-lg rounded-xl border 
                                        ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} 
                                        p-4 hover:shadow-xl transition-all
                                    `}
                                >
                                    <img
                                        src={item.image.url}
                                        alt={item.title}
                                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                                    />
                                    <div className="flex-1 text-center sm:text-left w-full">
                                        <h2 className="text-lg md:text-xl font-semibold">{item.title}</h2>
                                        <div className='flex flex-col sm:flex-row items-center justify-between w-full'>
                                            <div className='flex items-center space-x-2'>
                                                <label className="text-md font-bold">License: </label>
                                                <p className="text-md">{item.selectedLicense.name}</p>
                                            </div>
                                            <p className="text-lg font-bold mt-2">₹{item.selectedLicense?.price || 0}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteCart(item)}
                                        className="text-red-500 hover:text-red-700 mt-4 sm:mt-0 sm:ml-4"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-xl font-medium">Your cart is empty!</p>
                        )}
                    </div>

                    {/* Order Summary Section */}
                    {grandTotal != 0 && (
                        <div className={`
                            shadow-lg rounded-xl border p-6 
                            ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                            sticky top-28
                        `}>
                            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium">₹{totalAmount}</span>
                                </div>

                                <hr className="my-3 border-gray-300" />
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span>₹{grandTotal}</span>
                                </div>
                            </div>
                            <button
                                onClick={buyNow}
                                className="
                                    w-full mt-6 bg-blue-500 text-white py-3 rounded-md 
                                    hover:bg-blue-600 transition duration-300 
                                    focus:outline-none focus:ring-2 focus:ring-blue-400
                                "
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Cart;