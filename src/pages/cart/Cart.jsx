import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { deleteFromCart } from '../../redux/cartSlice';
import axios from 'axios';

function Cart() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const SHIPPING_COST = 100;
    const [totalAmount, setTotalAmount] = useState(0);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        // Calculate total based on selected licenses
        const tempTotal = cartItems.reduce((acc, item) => {
            const selectedLicensePrice = item.selectedLicense?.price || 0;
            return acc + selectedLicensePrice;
        }, 0);
        setTotalAmount(tempTotal);
    }, [cartItems]);

    const grandTotal = SHIPPING_COST + totalAmount;

    const deleteCart = (item) => {

        dispatch(deleteFromCart({
            item_id: item._id, licence_id: item.selectedLicense._id
        }));
        toast.success('Item Deleted Successfully');
    };

    // Razorpay payment handler and order storage in MongoDB using Mongoose
    const buyNow = async () => {
        if (!name || !address || !pincode || !phoneNumber) {
            return toast.error("All fields are required", {
                position: "top-center",
                autoClose: 1000,
                theme: "colored",
            });
        }

        const addressInfo = {
            name,
            address,
            pincode,
            phoneNumber,
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
        };

        const getUserFromStorage = () => {
            const storeuser = JSON.parse(localStorage.getItem("user"));
            if (storeuser?.user) {
                return { uid: storeuser.user.uid, email: storeuser.user.email };
            }
            return { uid: null, email: null };
        };
        const { uid, email } = getUserFromStorage();

        const options = {
            key: "rzp_test_PbSgvm23unv6ow", // Replace with your Razorpay Key
            amount: grandTotal * 100, // Amount in paisa
            currency: "INR",
            order_receipt: `order_rcptid_${name}`,
            name: "E-Bharat",
            description: "for testing purpose",
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
                    addressInfo,
                    email,
                    paymentId,
                    userid: uid,
                    totalAmount: grandTotal,
                    date: new Date(),
                };

                try {
                    // Save order data to MongoDB via API
                    const response = await axios.post('http://localhost:3000/orders', orderInfo);

                    if (response.status === 201) {
                        toast.success('Payment Successful');
                        navigate('/order');
                    } else {
                        toast.error('Failed to store the order');
                    }
                } catch (error) {
                    console.error(error.message);
                    toast.error('Failed to store the order');
                }
            },
            theme: { color: "#3399cc" },
        };

        const pay = new window.Razorpay(options);
        pay.open();
    };

    return (
        <Layout>
            <div className={`min-h-screen pt-28 pb-16 transition-all ${mode === 'dark' ? 'black text-white' : 'bg-gray-50 text-gray-900'}`}>
                <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>

                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
                    {/* Cart Items Section */}
                    <div className="md:col-span-2 space-y-6">
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <div key={index} className={`flex items-center shadow-lg rounded-xl border ${mode === 'dark' ? 'border-white' : 'border-black'} p-6 hover:shadow-xl transition-all`}>
                                    <img src={item.image.url} alt={item.title} className="w-32 h-32 object-cover rounded-lg" />
                                    <div className="ml-6 flex-1">
                                        <h2 className="text-xl font-semibold">{item.title}</h2>
                                        <div className='flex flex-row item-center space-x-2'>
                                            <label className="text-lg font-bold">License: </label>
                                            <p className="text-lg item-center">{item.selectedLicense.name}</p>
                                        </div>
                                        <p className="text-lg font-bold mt-2">₹{item.selectedLicense?.price || 0}</p>
                                    </div>
                                    <button onClick={() => deleteCart(item)} className="text-red-500 hover:text-red-700 ml-4">
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
                    <div className={`shadow-lg rounded-xl border p-6 ${mode === 'dark' ? 'border-white' : 'border-black'}`}>
                        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium">₹{totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="font-medium">₹{SHIPPING_COST}</span>
                            </div>
                            <hr className="my-3" />
                            <div className="flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span>₹{grandTotal}</span>
                            </div>
                        </div>

                        {/* Input Fields for Checkout */}
                        <div className="mt-6 space-y-4">
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={`w-full px-4 py-2 border ${mode === 'dark' ? ' text-black' : ''} rounded`} />
                            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className={`w-full px-4 py-2 border ${mode === 'dark' ? ' text-black' : ''} rounded`} />
                            <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className={`w-full px-4 py-2 border ${mode === 'dark' ? ' text-black' : ''} rounded`} />
                            <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={`w-full px-4 py-2 border ${mode === 'dark' ? ' text-black' : ''} rounded`} />
                            <button onClick={buyNow} className="w-full bg-green-500 text-white py-2 rounded mt-4">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Cart;
