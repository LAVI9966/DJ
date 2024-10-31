import React, { useEffect, useState, useContext } from 'react';
import { GrCaretNext, GrCaretPrevious, GrPlay, GrPause } from "react-icons/gr";
import { FaVolumeUp, FaVolumeMute, FaShoppingCart, FaTrash, FaPlay } from "react-icons/fa";
import { RiForward10Fill, RiReplay10Fill, RiLoopLeftFill } from "react-icons/ri";
import { usePlayer } from '../../context/player/playerContext';
import { FiShoppingCart } from "react-icons/fi";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteFromCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import MyContext from '../../context/data/myContext';
import { useAuth0 } from '@auth0/auth0-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { fireDB } from '../../firebase/firebaseconfig';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../../context/player/FavoritesProvider';

// License Modal Component
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

const Play = () => {
    const { playNext, playPrevious, curritem, isPlaying, togglePlayPause } = usePlayer();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [playerActive, setPlayerActive] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [filteredLicenses, setFilteredLicenses] = useState([]);

    // New states for cart and favorites
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const { user } = useAuth0();
    const userid = JSON.parse(localStorage.getItem('user'));
    const [userPurchasedLicenses, setUserPurchasedLicenses] = useState([]);
    // const [favSongs, setFavSongs] = useState([]);
    const context = useContext(MyContext);
    const { isPresent, toggleFavorite } = useFavorites();

    // Fetch user purchases
    useEffect(() => {
        const fetchUserPurchases = async () => {
            const purchases = [];
            const q = query(collection(fireDB, 'purchases'), where('userId', '==', user?.sub));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                purchases.push(...data.licenses);
            });
            setUserPurchasedLicenses(purchases);
        };

        if (user?.sub) {
            fetchUserPurchases();
        }
    }, [user?.sub]);

    const addCart = (licenseId) => {
        if (!curritem || !curritem.licenses) {
            return toast.error('No track selected');
        }

        const selectedLicense = curritem.licenses.find((license) => license._id === licenseId);
        if (!selectedLicense) {
            return toast.error('Invalid license selection.');
        }

        if (userPurchasedLicenses.includes(selectedLicense._id)) {
            return toast.error(`You have already purchased the ${selectedLicense.name} license.`);
        }

        const alreadyInCart = cartItems.some(
            (cartItem) =>
                cartItem._id === curritem._id && cartItem.selectedLicense._id === selectedLicense._id
        );

        if (alreadyInCart) {
            return toast.error(
                `The ${curritem.title} with ${selectedLicense.name} license is already in your cart.`
            );
        }

        const completeProduct = {
            ...curritem,
            selectedLicense,
        };
        dispatch(addToCart(completeProduct));
        toast.success('Added to cart');
    };

    const handleDeleteLicense = (payload) => {
        dispatch(deleteFromCart(payload));
        toast.success('License removed from cart');
    };
    useEffect(() => {
        const audio = document.querySelector('audio');

        if (audio) {
            const updateCurrentTime = () => {
                setCurrentTime(audio.currentTime);
            };

            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
            };

            audio.addEventListener('timeupdate', updateCurrentTime);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);

            return () => {
                audio.removeEventListener('timeupdate', updateCurrentTime);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, []);

    useEffect(() => {
        if (isPlaying) {
            setPlayerActive(true);
        }
    }, [isPlaying]);

    const handleSeek = (e) => {
        const audio = document.querySelector('audio');
        const seekTime = (e.target.value / 100) * duration;
        audio.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const handleVolumeChange = (e) => {
        const audio = document.querySelector('audio');
        const newVolume = e.target.value;
        audio.volume = newVolume;
        setVolume(newVolume);
    };

    const toggleMute = () => {
        const audio = document.querySelector('audio');
        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleRepeat = () => {
        const audio = document.querySelector('audio');
        audio.loop = !isRepeating;
        setIsRepeating(!isRepeating);
    };

    const skipForward = () => {
        const audio = document.querySelector('audio');
        audio.currentTime += 10;
    };

    const skipBackward = () => {
        const audio = document.querySelector('audio');
        audio.currentTime -= 10;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const toggleVolumeSlider = () => {
        setShowVolumeSlider(!showVolumeSlider);
    };

    return (
        <>
            <div className={`fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg ${playerActive ? 'block z-10' : 'hidden'}`}>
                {/* Progress Bar */}
                <div className="w-full px-2 pt-1">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={duration ? (currentTime / duration) * 100 : 0}
                        onChange={handleSeek}
                        className="w-full h-1 bg-gray-700 rounded-full cursor-pointer"
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center px-4 py-2 space-y-2 md:space-y-0">
                    {/* Track Info - Always visible */}
                    <div className="flex items-center w-full md:w-1/4 space-x-3">
                        <img
                            src={curritem?.image?.url}
                            alt="Song Cover"
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold truncate">{curritem?.title}</h3>
                            <div className="text-xs text-gray-400 truncate">
                                {curritem?.genre} | {curritem?.key} | {curritem?.bpm} BPM
                            </div>
                        </div>
                    </div>

                    {/* Main Controls - Center */}
                    <div className="flex flex-col items-center w-full md:w-2/4 space-y-1">
                        {/* Playback Controls */}
                        <div className="flex items-center justify-center space-x-2">
                            <button onClick={skipBackward} className="p-1 hover:bg-gray-800 rounded">
                                <RiReplay10Fill size={20} />
                            </button>
                            <button onClick={playPrevious} className="p-1 hover:bg-gray-800 rounded">
                                <GrCaretPrevious size={20} />
                            </button>
                            <button
                                onClick={togglePlayPause}
                                className="rounded-full w-10 h-10 flex items-center justify-center bg-white text-black hover:bg-gray-200"
                            >
                                {isPlaying ? <GrPause size={20} /> : <GrPlay size={20} />}
                            </button>
                            <button onClick={playNext} className="p-1 hover:bg-gray-800 rounded">
                                <GrCaretNext size={20} />
                            </button>
                            <button onClick={skipForward} className="p-1 hover:bg-gray-800 rounded">
                                <RiForward10Fill size={20} />
                            </button>
                        </div>

                        {/* Time Display */}
                        <div className="flex items-center text-xs text-gray-400 space-x-2">
                            <span>{formatTime(currentTime)}</span>
                            <span>/</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Additional Controls - Right */}
                    <div className="flex items-center justify-end w-full md:w-1/4 space-x-3">
                        {/* Volume Control */}
                        <div className="relative group">
                            <button onClick={toggleVolumeSlider} className="p-2 hover:bg-gray-800 rounded">
                                {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-24 h-1 bg-gray-700 rounded-full cursor-pointer transform rotate-270"
                                />
                            </div>
                        </div>

                        {/* Loop Control */}
                        <button
                            onClick={toggleRepeat}
                            className={`p-2 hover:bg-gray-800 rounded ${isRepeating ? 'text-green-500' : ''}`}
                        >
                            <RiLoopLeftFill size={20} />
                        </button>

                        {/* Favorite Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleFavorite(curritem)}
                            className="p-2 hover:bg-gray-800 rounded"
                        >
                            {isPresent(curritem?._id) ? (
                                <MdFavorite className="text-red-500" size={20} />
                            ) : (
                                <MdFavoriteBorder className="text-gray-400" size={20} />
                            )}
                        </motion.button>

                        {/* Cart Button - Update the onClick handler */}
                        <button
                            onClick={() => {
                                if (curritem) {
                                    setFilteredLicenses(curritem.licenses);
                                    setModalOpen(true);
                                }
                            }}
                            className="p-2 hover:bg-gray-800 rounded"
                            disabled={!curritem}
                        >
                            <FiShoppingCart size={20} />
                        </button>
                    </div>

                    {/* License Modal */}
                    {modalOpen && curritem && (
                        <LicenseModal
                            isOpen={modalOpen}
                            onClose={() => setModalOpen(false)}
                            product={curritem}
                            licenses={filteredLicenses}
                            onSelectLicense={(licenseId) => addCart(licenseId)}
                            onDeleteLicense={handleDeleteLicense}
                            cartItems={cartItems}
                        />
                    )}

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
                }`}
                    </style>
                </div>
            </div>
        </>)
};
export default Play;