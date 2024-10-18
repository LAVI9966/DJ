import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { usePlayer } from '../../context/player/playerContext';
import Filter from '../Filter/Filter';
import { fireDB } from '../../../../durgesh backup/DurgeshBhai/src/firebase/firebaseconfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

function ProductCard() {

    const fetchUserPurchases = async (userId) => {
        const purchases = [];
        const q = query(collection(fireDB, 'purchases'), where('userId', '==', userId)); // Adjust this according to your database structure

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            purchases.push(...data.licenses); // Assuming licenses are stored as an array in each purchase
        });

        return purchases;
    };

    const { loadTrack } = usePlayer();
    const context = useContext(myContext);
    const { mode, product } = context;

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    const [selectedLicenses, setSelectedLicenses] = useState({});
    const [userPurchasedLicenses, setUserPurchasedLicenses] = useState([]);

    useEffect(() => {
        const getUserPurchases = async () => {
            const purchases = await fetchUserPurchases(); // Fetch from Firestore
            setUserPurchasedLicenses(purchases);
        };
        getUserPurchases();
    }, []);

    const handleLicenseChange = (productId, index) => {
        setSelectedLicenses(prevState => ({
            ...prevState,
            [productId]: index,
        }));
    };
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const playmusic = async (item, index) => {
        console.log("ye me hu", item.fileUrl)
        loadTrack(item.fileUrl, product, index);
    }
    const addCart = (product) => {
        const licenseIndex = selectedLicenses[product.id] ?? 0;
        const selectedLicense = product.licenses[licenseIndex];

        // Check if the user has already purchased this license
        if (userPurchasedLicenses.includes(selectedLicense.name)) {
            return toast.error(`You have already purchased the ${selectedLicense.name} license.`);
        }

        // Check if the same product with the same license is already in the cart
        const alreadyInCart = cartItems.some(
            (cartItem) => cartItem.id === product.id && cartItem.selectedLicense.name === selectedLicense.name
        );

        if (alreadyInCart) {
            return toast.error(`The ${product.title} with ${selectedLicense.name} license is already in your cart.`);
        }

        const completeProduct = {
            ...product,
            selectedLicense,
        };

        dispatch(addToCart(completeProduct));
        toast.success('Added to cart');
    };

    const filteredLicenses = (item) => {
        return item.licenses.filter(license => !userPurchasedLicenses.includes(license.name));
    };

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-8 md:py-16 mx-auto">
                <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2"
                        style={{ color: mode === 'dark' ? 'white' : '' }}>
                        Our Latest Collection
                    </h1>
                    <div className="h-1 w-20 bg-pink-600 rounded"></div>
                </div>
                <Filter />
                <div className="p-6 px-0">
                    <div className="overflow-x-auto mx-4 my-6">
                        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
                            <thead className="bg-gray-100 text-left text-gray-700 font-medium text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 border-b">#</th>
                                    <th className="p-4 border-b">Image</th>
                                    <th className="p-4 border-b">Title & Category</th>
                                    <th className="p-4 border-b">Time</th>
                                    <th className="p-4 border-b">BPM</th>
                                    <th className="p-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((item, index) => (
                                    <tr key={item.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <td className="p-4 border-b text-gray-700 text-sm">{index + 1}</td>
                                        <td className="p-4 border-b">
                                            <div onClick={() => { console.log("pop"); playmusic(item, index) }} className="cursor-pointer hover:scale-105 transition-transform duration-200" >
                                                <img src={item.imageUrl} alt={item.title} className="h-12 w-12 rounded shadow-lg" />
                                            </div>
                                        </td>
                                        <td className="p-4 border-b">
                                            <div className="text-gray-800 font-medium">{item.title}</div>
                                            <div className="text-gray-500 text-sm">{item.category}</div>
                                        </td>
                                        <td className="p-4 border-b text-gray-700 text-sm">{item.time}</td>
                                        <td className="p-4 border-b text-gray-700 text-sm">{item.bpm}</td>
                                        <td className="p-4 border-b">
                                            <select
                                                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onChange={(e) => handleLicenseChange(item.id, e.target.selectedIndex)}
                                                required
                                            >
                                                <option value="" disabled>Select License</option>
                                                {filteredLicenses(item).map((license, licenseIndex) => (
                                                    <option key={license.name} value={license.name}>
                                                        {license.name} - ₹{license.price.toFixed(2)}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ease-in-out duration-200"
                                                onClick={() => addCart(item)}
                                            >
                                                Add to Cart
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductCard;
