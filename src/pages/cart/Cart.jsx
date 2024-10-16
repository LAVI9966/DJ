import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/Model/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../firebase/firebaseconfig';
import { useNavigate } from 'react-router-dom';
import { deleteFromCart } from '../../redux/cartSlice';
function Cart() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    // Delete cart item
    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Item Deleted Successfully");
    };

    // Sync cart with localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const [totalAmount, setTotalAmount] = useState(0);

    // Calculate total amount
    useEffect(() => {
        const temp = cartItems.reduce((acc, item) => acc + parseInt(item.price), 0);
        setTotalAmount(temp);
    }, [cartItems]);

    const SHIPPING_COST = 100;
    const grandTotal = SHIPPING_COST + totalAmount;

    // State for user details (prefilled values for now)
    const [name, setName] = useState("lavi");
    const [address, setAddress] = useState("45/10");
    const [pincode, setPincode] = useState("122345");
    const [phoneNumber, setPhoneNumber] = useState("5465971564");

    // Retrieve user from localStorage
    const getUserFromStorage = () => {
        const storeuser = JSON.parse(localStorage.getItem("user"));
        if (storeuser?.user) {
            return { uid: storeuser.user.uid, email: storeuser.user.email };
        }
        return { uid: null, email: null };
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

        const { uid, email } = getUserFromStorage();
        console.log("uid ", uid, " email ", email)
        const options = {
            key: "rzp_test_PbSgvm23unv6ow",
            key_secret: "Gp4MhXAj1Q93OiWn8JjudwyA",
            amount: grandTotal * 100,
            currency: "INR",
            order_receipt: `order_rcptid_${name}`,
            name: "E-Bharat",
            description: "for testing purpose",
            handler: async (response) => {
                const paymentId = response.razorpay_payment_id;

                const orderInfo = {
                    cartItems,
                    addressInfo,
                    date: new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }),
                    email,
                    userid: uid,
                    paymentId,
                };

                try {
                    const orderRef = collection(fireDB, "order");
                    await addDoc(orderRef, orderInfo);
                    toast.success('Payment Successful');
                    await handleSubmit();
                    navigate('/order')
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
            <div
                className="h-screen bg-gray-100 pt-28 mb-[60%]"
                style={{
                    backgroundColor: mode === 'dark' ? '#282c34' : '',
                    color: mode === 'dark' ? 'white' : '',
                }}
            >
                <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
                <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                    <div className="rounded-lg md:w-2/3">
                        {cartItems.map((item, index) => (
                            <div
                                key={index}
                                className="justify-between mb-6 rounded-lg border drop-shadow-xl bg-white p-6 sm:flex sm:justify-start"
                                style={{
                                    backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '',
                                    color: mode === 'dark' ? 'white' : '',
                                }}
                            >
                                <img src={item.imageUrl} alt="product-image" className="w-full rounded-lg sm:w-40" />
                                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                    <div className="mt-5 sm:mt-0">
                                        <h2 className="text-lg font-bold">{item.title}</h2>
                                        <h2 className="text-sm">{item.description}</h2>
                                        <p className="mt-1 text-xs font-semibold">₹{item.price}</p>
                                    </div>
                                    <div
                                        onClick={() => deleteCart(item)}
                                        className="mt-4 sm:mt-0 sm:space-x-6 cursor-pointer"
                                    >
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
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:w-1/3"
                        style={{
                            backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '',
                            color: mode === 'dark' ? 'white' : '',
                        }}
                    >
                        <div className="mb-2 flex justify-between">
                            <p>Subtotal</p>
                            <p>₹{totalAmount}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Shipping</p>
                            <p>₹{SHIPPING_COST}</p>
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between mb-3">
                            <p className="text-lg font-bold">Total</p>
                            <p className="text-lg font-bold">₹{grandTotal}</p>
                        </div>
                        <Modal
                            name={name}
                            address={address}
                            pincode={pincode}
                            phoneNumber={phoneNumber}
                            setName={setName}
                            setAddress={setAddress}
                            setPincode={setPincode}
                            setPhoneNumber={setPhoneNumber}
                            buyNow={buyNow}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Cart;
