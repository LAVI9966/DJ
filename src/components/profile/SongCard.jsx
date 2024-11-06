import React from 'react';
import { usePlayer } from '../../context/player/playerContext';
import { FaShoppingCart } from "react-icons/fa";
import { motion } from 'framer-motion';
const FavoriteSongsList = ({ songs }) => {
    const { loadTrack } = usePlayer();

    const playmusic = (item, index) => {
        loadTrack(item.mp3File.url, item, index);
    };

    const isInCart = (product) => {
        if (!product) return false;
        return cartItems.some(item => item._id === product._id);
    };

    return (
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
                        {songs.map((item, index) => (
                            <motion.tr
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                            >
                                <td className="text-gray-400">{index + 1}</td>
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
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-white">{item.title}</div>
                                    <div className="text-sm text-blue-400">{item.genre}</div>
                                </td>
                                <td className="p-4 text-gray-400">{item.time}</td>
                                <td className="p-4 text-gray-400">{item.bpm}</td>
                                <td className="p-4 text-gray-400">{item.key}</td>
                                <td className="p-4">
                                    <div className="flex space-x-3">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addCart(item, item.licenses[0]._id)}
                                            className="p-3 bg-blue-500/80 hover:bg-blue-600 text-white rounded-xl transition-all"
                                        >
                                            <FaShoppingCart />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FavoriteSongsList;