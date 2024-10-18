import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { usePlayer } from '../../context/player/playerContext';
import Filter from '../Filter/Filter';
import { fireDB } from '../../firebase/firebaseconfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
function ProductCard() {
    const fetchUserPurchases = async (userId) => {
        const purchases = [];
        const q = query(collection(fireDB, 'purchases'), where('userId', '==', userId));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            purchases.push(...data.licenses);
        });

        return purchases;
    };

    const { loadTrack } = usePlayer();
    const context = useContext(myContext);
    const { mode, product, searchkey, filterType } = context;

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    const [selectedLicenses, setSelectedLicenses] = useState({});
    const [userPurchasedLicenses, setUserPurchasedLicenses] = useState([]);

    useEffect(() => {
        const getUserPurchases = async () => {
            const purchases = await fetchUserPurchases();
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
        loadTrack(item.fileUrl, product, index);
    };

    const addCart = (product) => {
        const licenseIndex = selectedLicenses[product.id] ?? 0;
        const selectedLicense = product.licenses[licenseIndex];

        if (userPurchasedLicenses.includes(selectedLicense.name)) {
            return toast.error(`You have already purchased the ${selectedLicense.name} license.`);
        }

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

    const filteredProducts = product.filter((item) => {
        const matchesCategory = filterType ? item.category === filterType : true;
        const matchesSearch = item.title.toLowerCase().includes(searchkey.toLowerCase());

        return matchesCategory && matchesSearch;
    });

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
                        <table className={`min-w-full ${mode === 'dark' ? 'black text-white' : 'bg-gray-50 text-gray-900'}shadow-lg rounded-lg`}>
                            <thead className={`${mode === 'dark' ? 'black text-white' : 'bg-gray-100 text-gray-700'}  text-left font-medium text-sm uppercase tracking-wider`}>
                                <tr>
                                    <th className="p-4">#</th>
                                    <th className="p-4">Image</th>
                                    <th className="p-4">Title & Category</th>
                                    <th className="p-4">Time</th>
                                    <th className="p-4">BPM</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((item, index) => (
                                    <tr key={item.id} className={`${mode === 'dark' ? 'black text-white' : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4">
                                            <div onClick={() => { playmusic(item, index) }} className="cursor-pointer transition-transform duration-200">
                                                <img src={item.imageUrl} alt={item.title} className="h-12 w-12 rounded shadow-lg" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{item.title}</div>
                                            <div className="text-sm">{item.category}</div>
                                        </td>
                                        <td className="p-4">{item.time}</td>
                                        <td className="p-4">{item.bpm}</td>
                                        <td className="p-4">
                                            <select
                                                className={`w-full mb-2 p-2 rounded focus:outline-none focus:ring-2 transition ease-in-out duration-200
                                                    ${mode === 'dark' ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500' : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500'}`}
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
                                                title="Add this product to your cart with the selected license"
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
