import React, { useEffect, useState } from 'react';
import { GrCaretNext, GrCaretPrevious, GrPlay, GrPause } from "react-icons/gr";
import { FaVolumeUp, FaVolumeMute, FaRandom, FaUndoAlt } from "react-icons/fa"; // Icons for new controls
import { RiForward10Fill, RiReplay10Fill, RiLoopLeftFill } from "react-icons/ri";
import { usePlayer } from '../../context/player/playerContext';
import { CiShoppingCart } from "react-icons/ci";
import { MdFavoriteBorder } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { MdFavorite } from "react-icons/md";

const Play = () => {
    const { playNext, playPrevious, curritem, isPlaying, togglePlayPause } = usePlayer();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1); // Volume state (range: 0 to 1)
    const [isMuted, setIsMuted] = useState(false); // Mute state
    const [isShuffling, setIsShuffling] = useState(false); // Shuffle state
    const [isRepeating, setIsRepeating] = useState(false); // Repeat state
    const [playerActive, setPlayerActive] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false); // State to control volume slider visibility

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
            setPlayerActive(true); // Show player when a song starts playing
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
        audio.volume = newVolume; // Set audio volume
        setVolume(newVolume); // Update volume state
    };

    const toggleMute = () => {
        const audio = document.querySelector('audio');
        audio.muted = !isMuted; // Toggle muted state
        setIsMuted(!isMuted);
    };

    const toggleRepeat = () => {
        const audio = document.querySelector('audio');
        audio.loop = !isRepeating; // Toggle looping
        setIsRepeating(!isRepeating);
    };

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling); // Toggle shuffling
        // Shuffle logic will be managed in the PlayerContext
    };

    const skipForward = () => {
        const audio = document.querySelector('audio');
        audio.currentTime += 10; // Skip forward by 10 seconds
    };

    const skipBackward = () => {
        const audio = document.querySelector('audio');
        audio.currentTime -= 10; // Skip backward by 10 seconds
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const handleAddToFavorites = () => {
        // Logic for adding to favorites (e.g., update context or state)
        console.log('Added to favorites:', curritem.title);
    };

    const handleAddToCart = () => {
        // Logic for adding to cart (e.g., update context or state)
        console.log('Added to cart:', curritem.title);
    };

    const toggleVolumeSlider = () => {
        setShowVolumeSlider(!showVolumeSlider); // Toggle volume slider visibility
    };

    return (

        <div className={`fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg ${playerActive ? 'block' : 'hidden'}`}>

            <div className="flex flex-col px-4 pb-3 pt-0">
                <div className="relative w-full">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={duration ? (currentTime / duration) * 100 : 0}
                        onChange={handleSeek}
                        className="w-full h-1 bg-gray-700 rounded-full cursor-pointer"
                    />
                    {/* <div
                        className="absolute top-0 left-0 h-1 bg-green-500 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    /> */}
                </div>

                <div className="flex items-center space-x-4 mt-3 flex-wrap">
                    <img
                        src={curritem.image?.url}
                        alt="Song Cover"
                        className="w-16 h-16 rounded-lg"
                    />
                    <div className="ml-3">
                        <h3 className="font-bold">{curritem.title}</h3>
                        <div className="text-sm">Genre: {curritem.genre} | Key: {curritem.key} | BPM: {curritem.bpm}</div>
                    </div>

                    <div className="text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>

                    <div className='flex'>

                        {/* Skip Backward/Forward */}
                        <button onClick={skipBackward} className="text-white px-2 py-1 rounded"><RiReplay10Fill size={30} /></button>

                        {/* Previous */}
                        <button onClick={playPrevious} className="px-4 py-2 mx-2 rounded hover:bg-gray-400">
                            <GrCaretPrevious size={22} />
                        </button>
                        {/* Play/Pause */}
                        <button onClick={togglePlayPause} className="rounded-full w-10 h-10 flex items-center justify-center bg-white text-black">
                            {isPlaying ? (
                                <GrPause className="w-6 h-6" />
                            ) : (
                                <GrPlay className="w-6 h-6" />
                            )}
                        </button>
                        {/* Next  */}
                        <button onClick={playNext} className="px-4 py-2 mx-2 rounded hover:bg-gray-400">
                            <GrCaretNext size={22} />
                        </button>
                        <button onClick={skipForward} className="text-white px-2 py-1 rounded"><RiForward10Fill size={30} /></button>
                    </div>
                    {/* Volume Control */}
                    <div className="flex items-center space-x-2">
                        <button onClick={toggleVolumeSlider} className="text-white">
                            {isMuted ? <FaVolumeMute size={22} /> : <FaVolumeUp size={22} />}
                        </button>
                        {showVolumeSlider && (
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-16 h-1 bg-gray-700 rounded-full cursor-pointer"
                            />
                        )}
                    </div>

                    {/* Repeat Button */}
                    <button onClick={toggleRepeat} className="text-white px-2 py-1 rounded ">
                        <RiLoopLeftFill size={22} className={isRepeating ? 'text-green-500' : 'text-white'} />
                    </button>

                    {/* Shuffle Button
                    <button onClick={toggleShuffle} className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400">
                        <FaRandom className={isShuffling ? 'text-green-500' : 'text-black'} />
                    </button> */}

                    <div className='ml-auto flex space-x-2'>
                        {/* Add to Favorites Button */}
                        <button onClick={handleAddToFavorites} className=" text-white px-2 py-1 rounded">
                            {true ? <MdFavorite size={23} className='text-red-500' /> : <MdFavoriteBorder size={22} />}
                        </button>

                        {/* Add to Cart Button */}
                        <button onClick={handleAddToCart} className=" text-white px-2 py-1 rounded">
                            <FiShoppingCart size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Play;
