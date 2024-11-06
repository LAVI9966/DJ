import React, { useEffect, useState, useContext, useRef } from 'react';
import { GrCaretNext, GrCaretPrevious, GrPlay, GrPause } from "react-icons/gr";
import { FaVolumeUp, FaVolumeMute, FaShoppingCart, FaTrash, FaPlay, FaEllipsisV } from "react-icons/fa";
import { RiForward10Fill, RiReplay10Fill, RiLoopLeftFill } from "react-icons/ri";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../context/player/playerContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteFromCart } from '../../redux/cartSlice';
import { useFavorites } from '../../context/player/FavoritesProvider';
import { toast } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';
import MyContext from '../../context/data/myContext';

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
    const [showMoreControls, setShowMoreControls] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

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
    const [isSliderOpen, setIsSliderOpen] = useState(false);

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const { user } = useAuth0();
    const userid = JSON.parse(localStorage.getItem('user'));
    const [userPurchasedLicenses, setUserPurchasedLicenses] = useState([]);
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
    const handleMenuClick = (event) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: buttonRect.top - 120, // Position menu above the button
            right: window.innerWidth - buttonRect.right
        });
        setIsMenuOpen(!isMenuOpen);
    };
    const handleVolumeButtonClick = () => {
        setIsSliderOpen((prev) => !prev);
    };
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false); // Close menu when clicking outside
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <>
            {/* Dropdown Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        ref={menuRef}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed bg-gray-900 rounded-lg shadow-xl border border-gray-800 z-50"
                        style={{
                            top: menuPosition.top,
                            right: menuPosition.right,
                        }}
                    >
                        <div className="p-2 space-y-2">
                            <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                                <div className="relative group">
                                    <button
                                        onClick={toggleMute}
                                        className="hover:bg-gray-700 rounded-full transition-all"
                                    >
                                        {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                                    </button>
                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block">
                                        <div className="bg-gray-800 rounded-lg p-2 shadow-xl">
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={volume}
                                                onChange={handleVolumeChange}
                                                className="w-24 accent-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <span>Volume</span>
                            </div>

                            <div
                                onClick={toggleRepeat}
                                className={`flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer ${isRepeating ? 'text-blue-500' : ''}`}
                            >
                                <RiLoopLeftFill size={20} />
                                <span>Repeat</span>
                            </div>

                            <div
                                onClick={() => toggleFavorite(curritem)}
                                className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                            >
                                {isPresent(curritem?._id) ? (
                                    <MdFavorite className="text-red-500" size={20} />
                                ) : (
                                    <MdFavoriteBorder size={20} />
                                )}
                                <span>Favorite</span>
                            </div>

                            <div
                                onClick={() => {
                                    if (curritem) {
                                        setFilteredLicenses(curritem.licenses);
                                        setModalOpen(true);
                                    }
                                }}
                                className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                            >
                                <FaShoppingCart size={20} />
                                <span>Add to Cart</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Player */}
            <div className={`fixed bottom-0 left-0 w-full bg-gradient-to-b from-gray-900 to-black text-white shadow-xl border-t border-gray-800 ${playerActive ? 'block z-40' : 'hidden'}`}>
                {/* Progress Bar */}
                <div className="relative w-full h-1 bg-gray-800">
                    <div
                        className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={duration ? (currentTime / duration) * 100 : 0}
                        onChange={handleSeek}
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center px-2 py-2 space-y-2 md:space-y-0">
                    {/* Track Info */}
                    <div className="flex items-center w-full md:w-1/4 space-x-3">
                        <div className="relative group">
                            <img
                                src={curritem?.image?.url}
                                alt="Song Cover"
                                className="w-12 h-12 rounded-lg object-cover transform transition-transform group-hover:scale-105 shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <FaPlay className="text-white text-xl" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold truncate hover:text-blue-400 transition-colors">
                                {curritem?.title}
                            </h3>
                            <div className="text-xs text-gray-400 truncate">
                                {curritem?.genre} • {curritem?.key} • {curritem?.bpm} BPM
                            </div>
                        </div>
                        <div className="md:hidden  flex justify-end">
                            <button
                                onClick={handleMenuClick}
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <FaEllipsisV size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main Controls */}
                    <div className="flex flex-col items-center w-full md:w-2/4 space-y-1">
                        {/* Mobile Menu Button */}

                        {/* Playback Controls */}
                        <div className="flex items-center justify-center space-x-4">
                            <button
                                onClick={skipBackward}
                                className="hidden md:block p-2 hover:bg-gray-800 rounded-full transition-all hover:scale-110"
                            >
                                <RiReplay10Fill size={20} />
                            </button>
                            <button
                                onClick={playPrevious}
                                className="p-2 hover:bg-gray-800 rounded-full transition-all hover:scale-110"
                            >
                                <GrCaretPrevious size={20} />
                            </button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={togglePlayPause}
                                className="rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all hover:scale-105"
                            >
                                {isPlaying ? <GrPause size={24} /> : <GrPlay size={24} />}
                            </motion.button>
                            <button
                                onClick={playNext}
                                className="p-2 hover:bg-gray-800 rounded-full transition-all hover:scale-110"
                            >
                                <GrCaretNext size={20} />
                            </button>
                            <button
                                onClick={skipForward}
                                className="hidden md:block p-2 hover:bg-gray-800 rounded-full transition-all hover:scale-110"
                            >
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

                    {/* Desktop Controls */}
                    <div className="hidden md:flex items-center justify-end w-full md:w-1/4 space-x-3">
                        <div className="relative group">
                            <button
                                onClick={toggleMute}
                                className="p-2 hover:bg-gray-800 rounded-full transition-all hover:scale-110"
                            >
                                {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                            </button>
                            <div className="absolute -left-24 bottom-full mb-2 hidden group-hover:block">
                                <div className="bg-gray-800 rounded-lg p-2 shadow-xl">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="w-24 accent-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleRepeat}
                            className={`p-2 hover:bg-gray-800 rounded-full transition-colors ${isRepeating ? 'text-blue-500' : ''}`}
                        >
                            <RiLoopLeftFill size={20} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleFavorite(curritem)}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                        >
                            {isPresent(curritem?._id) ? (
                                <MdFavorite className="text-red-500" size={20} />
                            ) : (
                                <MdFavoriteBorder size={20} />
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                if (curritem) {
                                    setFilteredLicenses(curritem.licenses);
                                    setModalOpen(true);
                                }
                            }}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                            disabled={!curritem}
                        >
                            <FaShoppingCart size={20} />
                        </motion.button>
                    </div>
                </div>

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
                    }`}
            </style>
        </>
    );
};

export default Play;



