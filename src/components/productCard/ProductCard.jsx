import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { usePlayer } from '../../context/player/playerContext';
import Filter from '../Filter/Filter';
import { fireDB } from '../../firebase/firebaseconfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
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
    const [AllcartItemsOfUser, setAllCartItemOfUser] = useState([]);
    const { user, isLoading } = useAuth0();
    const userid = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get('http://localhost:3000/fethcdoc', { params: { email: userid?.email } });
                console.log("User data for license retrieval: ", response.data);
                // setuserformail(response.data); // Update `userformail` state asynchronously

                // Directly calculate `cartItemsArray` using `response.data`
                const cartItemsArray = response.data.flatMap(item => item.cartItems || []);
                setAllCartItemOfUser(cartItemsArray);
                console.log("pappu", cartItemsArray); // This should now log the expected data
            } catch (error) {
                console.log("Error fetching user data: ", error);
            }
        };

        getUser();
    }, [user]);


    const { loadTrack } = usePlayer();
    const context = useContext(myContext);
    const {
        mode,
        product,
        searchkey,
        sliderlowervalue,
        setsliderlowervalue,
        slideruppervalue,
        setslideruppervalue,
        filterType,
        keyFilter,
        setKeyFilter,
        setFilterType,
    } = context;

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    const [selectedLicenses, setSelectedLicenses] = useState({});
    const [userPurchasedLicenses, setUserPurchasedLicenses] = useState([]);
    const [filteredSize, setFilteredSize] = useState(0); // State to store the size of filtered products

    useEffect(() => {
        const getUserPurchases = async () => {
            const purchases = await fetchUserPurchases(); // Pass userId if required
            setUserPurchasedLicenses(purchases);
        };
        getUserPurchases();
    }, []);

    const handleLicenseChange = (productId, licenseId) => {
        setSelectedLicenses((prevState) => ({
            ...prevState,
            [productId]: licenseId,
        }));
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const playmusic = async (item, index) => {
        console.log("ye ri lidt", product)
        loadTrack(item.mp3File.url, product, index);
    };

    const addCart = (product) => {
        const selectedLicenseId = selectedLicenses[product._id];

        if (!selectedLicenseId) {
            return toast.error('Please select a valid license.');
        }

        const selectedLicense = product.licenses.find((license) => license._id === selectedLicenseId);

        if (!selectedLicense) {
            return toast.error('Invalid license selection.');
        }

        if (userPurchasedLicenses.includes(selectedLicense._id)) {
            return toast.error(`You have already purchased the ${selectedLicense.name} license.`);
        }

        const alreadyInCart = cartItems.some(
            (cartItem) =>
                cartItem._id === product._id && cartItem.selectedLicense._id === selectedLicense._id
        );

        if (alreadyInCart) {
            return toast.error(
                `The ${product.title} with ${selectedLicense.name} license is already in your cart.`
            );
        }

        const completeProduct = {
            ...product,
            selectedLicense,
        };

        dispatch(addToCart(completeProduct));
        toast.success('Added to cart');
    };

    const filteredLicenses = (item) => {
        return item.licenses.filter(
            (license) => !userPurchasedLicenses.includes(license._id)
        );
    };
    // Filter products by search and filter criteria
    const filteredProducts = product.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchkey.toLowerCase());
        const matchesKey = !keyFilter || item.key === keyFilter; // Adjust this based on your key structure
        const matchesGenre = !filterType || item.genre === filterType; // Assuming you have a genre field
        return matchesSearch && matchesKey && matchesGenre && sliderlowervalue <= item.bpm && slideruppervalue >= item.bpm;
    });

    // Update filtered size whenever filters are applied
    useEffect(() => {
        setFilteredSize(filteredProducts.length);
    }, [filteredProducts]);

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-8 md:py-16 mx-auto">
                <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
                    <h1
                        className="sm:text-3xl text-2xl font-medium title-font mb-2"
                        style={{ color: mode === 'dark' ? 'white' : '' }}
                    >
                        Our Latest Collection
                    </h1>
                    <div className="h-1 w-20 bg-pink-600 rounded"></div>
                    {/* Show the filtered size */}
                    <p className="mt-4 text-gray-500">
                        Showing {filteredSize} product{filteredSize !== 1 && 's'} found
                    </p>
                </div>
                <Filter setKeyFilter={setKeyFilter} setFilterType={setFilterType} />
                <div className="p-6 px-0">
                    <div className="overflow-x-auto mx-4 my-6">
                        <table
                            className={`min-w-full ${mode === 'dark' ? 'black text-white' : 'bg-gray-50 text-gray-900'
                                } shadow-lg rounded-lg`}
                        >
                            <thead
                                className={`${mode === 'dark' ? 'black text-white' : 'bg-gray-100 text-gray-700'
                                    } text-left font-medium text-sm uppercase tracking-wider`}
                            >
                                <tr>
                                    <th className="p-4">#</th>
                                    <th className="p-4">Image</th>
                                    <th className="p-4">Title & Category</th>
                                    <th className="p-4">Time</th>
                                    <th className="p-4">BPM</th>
                                    <th className='p-4'>Key</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        className={`${mode === 'dark'
                                            ? 'black text-white'
                                            : index % 2 === 0
                                                ? 'bg-gray-50'
                                                : 'bg-white'
                                            }`}
                                    >
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4">
                                            <div
                                                onClick={() => {
                                                    playmusic(item, index);
                                                }}
                                                className="cursor-pointer transition-transform duration-200"
                                            >
                                                <img
                                                    src={item.image.url}
                                                    alt={item.title}
                                                    className="h-12 w-12 rounded shadow-lg"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{item.title}</div>
                                            <div className="text-sm">{item.category}</div>
                                        </td>
                                        <td className="p-4">{item.time}</td>
                                        <td className="p-4">{item.bpm}</td>
                                        <td className="p-4">{item.key}</td>
                                        <td className="p-4">
                                            <select
                                                className={`w-full mb-2 p-2 rounded focus:outline-none focus:ring-2 transition ease-in-out duration-200
                                                ${mode === 'dark'
                                                        ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500'
                                                        : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500'
                                                    }`}
                                                onChange={(e) => handleLicenseChange(item._id, e.target.value)}
                                                required
                                            >
                                                <option value="">Select License</option>
                                                {filteredLicenses(item).map((license) => (
                                                    <option
                                                        key={license._id}
                                                        value={license._id}
                                                    >
                                                        {license.name} - ₹{license.price} (ID: {license._id})
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
