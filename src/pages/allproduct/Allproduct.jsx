import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteFromCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { usePlayer } from '../../context/player/playerContext';
import Filter from '../../components/Filter/Filter'
import { fireDB } from '../../firebase/firebaseconfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { FaShoppingCart, FaPlay, FaTrash } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../../context/player/FavoritesProvider';
import Layout from '../../components/Layout/Layout'
import Meteors from "../../components/ui/meteors"
const LicenseModal = ({ isOpen, onClose, product, licenses, onSelectLicense, onDeleteLicense, cartItems }) => {
    if (!isOpen) return null;

    const isLicenseInCart = (licenseId) => {
        return cartItems.some(item =>
            item._id === product._id && item.selectedLicense._id === licenseId
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50"
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                    <Meteors number={30} />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl border border-gray-700/50"
                    >
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800/50 transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                            <div className="relative group">
                                <img
                                    src={product.image.url}
                                    alt={product.title}
                                    className="w-40 h-40 object-cover rounded-xl shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-300"
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <FaPlay className="text-white text-2xl" />
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-3xl font-bold text-white mb-2">{product.title}</h3>
                                <p className="text-blue-400 text-lg">{product.genre}</p>
                                <div className="flex gap-4 mt-4 text-gray-400 text-sm">
                                    <span>BPM: {product.bpm}</span>
                                    <span>Key: {product.key}</span>
                                    <span>Time: {product.time}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {licenses.map((license) => {
                                const inCart = isLicenseInCart(license._id);
                                return (
                                    <motion.div
                                        key={license._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-800/50 backdrop-blur rounded-xl p-4 hover:bg-gray-700/50 transition-all border border-gray-700/50"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between gap-3">
                                            <div>
                                                <h4 className="font-semibold text-white text-xl mb-2">{license.name}</h4>
                                                <p className="text-gray-400">{license.description}</p>
                                                <p className="text-2xl font-bold text-blue-400 mt-4">₹{license.price}</p>
                                            </div>
                                            <div className="flex items-center">
                                                {inCart ? (
                                                    <button
                                                        onClick={() => onDeleteLicense({
                                                            item_id: product._id,
                                                            licence_id: license._id
                                                        })}
                                                        className="px-6 py-3 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm"
                                                    >
                                                        <FaTrash />
                                                        Remove
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onSelectLicense(license._id)}
                                                        className="px-6 py-3 bg-blue-500/80 hover:bg-blue-600 text-white rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm"
                                                    >
                                                        <FaShoppingCart />
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

function Allproducts() {
    const { loadTrack } = usePlayer();
    const context = useContext(myContext);
    const { isPresent, toggleFavorite, isLoading } = useFavorites();
    const {
        mode,
        product,
        searchkey,
        sliderlowervalue,
        slideruppervalue,
        filterType,
        keyFilter,
        setKeyFilter,
        setFilterType,
    } = context;

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const { user } = useAuth0();
    const userid = JSON.parse(localStorage.getItem('user'));

    const [userPurchasedLicenses, setUserPurchasedLicenses] = useState([]);
    const [filteredSize, setFilteredSize] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filteredLicenses, setFilteredLicenses] = useState([]);
    // const [favSongs, setFavSongs] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);


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

    useEffect(() => {
        const getUserPurchases = async () => {
            const purchases = await fetchUserPurchases(user?.sub);
            setUserPurchasedLicenses(purchases);
        };
        if (user?.sub) {
            getUserPurchases();
        }
    }, [user?.sub]);

    const playmusic = async (item, index) => {
        loadTrack(item.mp3File.url, product, index);
    };

    const addCart = (product, licenseId) => {
        const selectedLicense = product.licenses.find((license) => license._id === licenseId);
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
        // setModalOpen(false);
    };

    const filteredProducts = product.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchkey.toLowerCase());
        const matchesKey = !keyFilter || item.key === keyFilter;
        const matchesGenre = !filterType || item.genre === filterType;
        return matchesSearch && matchesKey && matchesGenre &&
            sliderlowervalue <= item.bpm && slideruppervalue >= item.bpm;
    });

    useEffect(() => {
        setFilteredSize(filteredProducts.length);
    }, [filteredProducts]);

    const openModal = (product) => {
        setSelectedProduct(product);
        setFilteredLicenses(product.licenses);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
        setFilteredLicenses([]);
    };

    const isInCart = (product) => {
        if (!product) return false;
        return cartItems.some(item => item._id === product._id);
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading...</div>;
    }


    const handleDeleteLicense = (payload) => {
        dispatch(deleteFromCart(payload));
        toast.success('License removed from cart');
    };

    return (
        <Layout>
            <Meteors number={30} />
            <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="container px-4 py-12 mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
                        >
                            Premium Music Marketplace
                        </motion.h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100px" }}
                            className="h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mx-auto"
                        />
                        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
                            Discover and license high-quality music tracks for your projects.
                            Showing {filteredSize} track{filteredSize !== 1 && 's'} in our collection.
                        </p>
                    </div>

                    <Filter setKeyFilter={setKeyFilter} setFilterType={setFilterType} />

                    {/* Products Table */}
                    <div className="mt-8">
                        <div className="overflow-x-auto">
                            <table className="w-full bg-gray-900/50 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border border-gray-800/50">
                                <thead className="bg-gray-800/50">
                                    <tr>
                                        <th className="p-4 text-left text-gray-300">#</th>
                                        <th className="p-4 text-left text-gray-300">Track</th>
                                        <th className="p-4 text-left text-gray-300">Details</th>
                                        <th className="p-4 text-left text-gray-300">Time</th>
                                        <th className="p-4 text-left text-gray-300">BPM</th>
                                        <th className="p-4 text-left text-gray-300">Key</th>
                                        <th className="p-4 text-left text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((item, index) => (
                                        <motion.tr
                                            key={item._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                                        >
                                            <td className="p-4 text-gray-400">{index + 1}</td>
                                            <td className="p-4">
                                                <div
                                                    onClick={() => playmusic(item, index)}
                                                    className="relative group cursor-pointer"
                                                >
                                                    <img
                                                        src={item.image.url}
                                                        alt={item.title}
                                                        className="h-16 w-16 rounded-lg shadow-lg transition-transform group-hover:scale-105"
                                                    />
                                                    {/* <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                    <FaPlay className="text-white" />
                                                </div> */}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-white">{item.title}</div>
                                                <div className="text-sm text-blue-400">{item.category}</div>
                                            </td>
                                            <td className="p-4 text-gray-400">{item.time}</td>
                                            <td className="p-4 text-gray-400">{item.bpm}</td>
                                            <td className="p-4 text-gray-400">{item.key}</td>
                                            <td className="p-4">
                                                <div className="flex space-x-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => openModal(item)}
                                                        className="p-3 bg-blue-500/80 hover:bg-blue-600 text-white rounded-xl transition-all"
                                                    >
                                                        <FaShoppingCart />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => toggleFavorite(item)}
                                                        className="p-3 hover:bg-gray-800/50 text-white rounded-xl transition-all"
                                                    >
                                                        {isPresent(item._id) ? (
                                                            <MdFavorite className="text-red-500" size={22} />
                                                        ) : (
                                                            <MdFavoriteBorder className="text-gray-400 hover:text-red-500" size={22} />
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* License Modal */}
                    {modalOpen && selectedProduct && (
                        <LicenseModal
                            isOpen={modalOpen}
                            onClose={closeModal}
                            product={selectedProduct}
                            licenses={filteredLicenses}
                            onSelectLicense={(licenseId) => addCart(selectedProduct, licenseId)}
                            onDeleteLicense={handleDeleteLicense}
                            cartItems={cartItems}
                        />
                    )}
                </div>

                {/* Custom Scrollbar Styles */}
                <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.5);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.7);
                }
            `}</style>
            </section>
        </Layout>
    );
}

export default Allproducts;