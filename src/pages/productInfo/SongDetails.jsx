import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteFromCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { usePlayer } from '../../context/player/playerContext';
import { useAuth0 } from '@auth0/auth0-react';
import { FaShoppingCart, FaPlay, FaTrash } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../../context/player/FavoritesProvider';

const ProductCard = () => {
    const { loadTrack } = usePlayer();
    const context = useContext(myContext);
    const { isPresent, toggleFavorite, isLoading } = useFavorites();
    const { product, searchkey, sliderlowervalue, slideruppervalue, filterType, keyFilter, setKeyFilter, setFilterType } = context;

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const { user } = useAuth0();
    const userid = JSON.parse(localStorage.getItem('user'));

    const [filteredSize, setFilteredSize] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const playMusic = async (item, index) => {
        loadTrack(item.mp3File.url, product, index);
    };

    const addCart = (product, licenseId) => {
        const selectedLicense = product.licenses.find((license) => license._id === licenseId);
        if (!selectedLicense) return toast.error('Invalid license selection.');

        const alreadyInCart = cartItems.some(
            (cartItem) => cartItem._id === product._id && cartItem.selectedLicense._id === selectedLicense._id
        );
        if (alreadyInCart) return toast.error(`This item is already in your cart.`);

        const completeProduct = { ...product, selectedLicense };
        dispatch(addToCart(completeProduct));
        toast.success('Added to cart');
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

    if (isLoading) return <div className="text-center py-4">Loading...</div>;

    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="container px-4 py-12 mx-auto">
                <div className="text-center mb-16">
                    <motion.h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        Premium Music Marketplace
                    </motion.h1>
                    <motion.div className="h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mx-auto" />
                    <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
                        Discover and license high-quality music tracks for your projects.
                        Showing {filteredSize} track{filteredSize !== 1 && 's'} in our collection.
                    </p>
                </div>
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
                                <motion.tr key={item._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                                    <td className="text-gray-400">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleFavorite(item)}
                                            className="p-3 hover:bg-gray-800/50 text-white rounded-xl"
                                        >
                                            {isPresent(item._id) ? (
                                                <MdFavorite className="text-red-500" size={22} />
                                            ) : (
                                                <MdFavoriteBorder className="text-gray-400 hover:text-red-500" size={22} />
                                            )}
                                        </motion.button>
                                    </td>
                                    <td className="p-4">
                                        <div onClick={() => playMusic(item, index)} className="relative group cursor-pointer">
                                            <img src={item.image.url} alt={item.title} className="h-16 w-16 rounded-lg shadow-lg" />
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
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addCart(item, index)}
                                            className="p-3 bg-blue-500/80 hover:bg-blue-600 text-white rounded-xl"
                                        >
                                            <FaShoppingCart />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default ProductCard;
