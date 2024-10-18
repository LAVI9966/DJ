import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { deleteFromCart } from '../../redux/cartSlice';
import { addDoc, collection } from "firebase/firestore"; // Firestore methods
import { fireDB } from "../../firebase/firebaseconfig"; // Firebase config (adjust path)

function Cart() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const SHIPPING_COST = 100;
    console.log("caart items", cartItems)
    const [totalAmount, setTotalAmount] = useState(0);
    const [name, setName] = useState('lavi');
    const [address, setAddress] = useState('45/10');
    const [pincode, setPincode] = useState('122345');
    const [phoneNumber, setPhoneNumber] = useState('5465971564');

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
        dispatch(deleteFromCart(item));
        toast.success('Item Deleted Successfully');
    };
    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3000/send_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'gehlodlavish@gmail.com',
                    subject: 'Hello pagal ladki',
                    text: 'big boss dekhne se kuchh nahi hota beta kuchh or karo',
                    html: '<h1>samji</h1>',
                }),
            });

            const result = await response.text();
            if (response.ok) {
                console.log('Success:', result);
            } else {
                console.error('Error:', result);
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };
    // Razorpay payment handler and order storage in Firestore
    const buyNow = async (e) => {
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
            key_secret: "Gp4MhXAj1Q93OiWn8JjudwyA", // Replace with your Razorpay Key Secret
            amount: grandTotal * 100, // Amount in paisa
            currency: "INR",
            order_receipt: `order_rcptid_${name}`,
            name: "E-Bharat",
            description: "for testing purpose",
            handler: async (response) => {
                const paymentId = response.razorpay_payment_id;

                const orderInfo = {
                    cartItems: cartItems.map((item) => ({
                        id: item.id,
                        title: item.title,
                        imageUrl: item.imageUrl,
                        selectedLicense: {
                            name: item.selectedLicense?.name,
                            price: item.selectedLicense?.price,
                            licenseUrl: item.selectedLicense?.licenseUrl,
                        },
                    })),
                    addressInfo,
                    date: new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }),
                    email,
                    userid: uid,
                    paymentId,
                    totalAmount: grandTotal,
                };

                try {
                    const orderRef = collection(fireDB, "order");
                    await addDoc(orderRef, orderInfo);
                    toast.success('Payment Successful');
                    await handleSubmit(); // Clear cart or further actions
                    navigate('/order');
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
            <div className={`min-h-screen pt-28 pb-16 transition-all ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>

                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
                    {/* Cart Items Section */}
                    <div className="md:col-span-2 space-y-6">
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <div key={index} className="flex items-center bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all">
                                    <img src={item.imageUrl} alt={item.title} className="w-32 h-32 object-cover rounded-lg" />
                                    <div className="ml-6 flex-1">
                                        <h2 className="text-xl font-semibold">{item.title}</h2>
                                        <div className='flex flex-row item-center space-x-2'>

                                            <label className="text-lg font-bold ">License: </label>
                                            <p className="text-lg item-center">{item.selectedLicense.name}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
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
                    <div className="bg-white shadow-lg rounded-xl p-6">
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
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded" />
                            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 border rounded" />
                            <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full px-4 py-2 border rounded" />
                            <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-2 border rounded" />
                            <button onClick={buyNow} className="w-full bg-green-500 text-white py-2 rounded mt-4">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Cart;
