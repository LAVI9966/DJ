import React, { useEffect, useRef, useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebaseconfig';
import { usePlayer } from '../../context/player/playerContext';

import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
const Play = () => {
    const { playNext, playPrevious, curritem } = usePlayer();
    curritem ? console.log(curritem) : "";
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const { isPlaying, togglePlayPause, audioUrl, loadTrack } = usePlayer();

    useEffect(() => {
        if (audioUrl) {
            audioRef.current.src = audioUrl; // Set the audio source
            audioRef.current.load();
        }
    }, [audioUrl]);

    useEffect(() => {
        const audio = audioRef.current;

        if (isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }

        const updateCurrentTime = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
        };

        audio.addEventListener('timeupdate', updateCurrentTime);
        audio.addEventListener('ended', () => {
            togglePlayPause(); // Automatically pause when the song ends
            setCurrentTime(0); // Reset time
        });

        return () => {
            audio.removeEventListener('timeupdate', updateCurrentTime);
        };
    }, [isPlaying]);

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const seekTime = (e.target.value / 100) * duration;
        audio.currentTime = seekTime;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className={`fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg ${isPlaying ? 'block' : 'hidden'}`}>
            <audio ref={audioRef} preload="auto" />
            <div className="flex flex-col px-4 py-3">
                <div className="relative w-full">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={(currentTime / duration) * 100 || 0}
                        onChange={handleSeek}
                        className="w-full h-1 bg-gray-700 rounded-full cursor-pointer"
                    />
                    <div
                        className="absolute top-0 left-0 h-1 bg-green-500 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                </div>

                <div className="flex items-center space-x-4 mt-3 flex-wrap">
                    <img
                        src={curritem.imageUrl}
                        alt="Song Cover"
                        className="w-16 h-16 rounded-lg"
                    />
                    <div className="ml-3">
                        <h3 className="font-bold">Song Title</h3>
                        <div className="text-sm">Age: 25 | Category: Pop | BPM: 120</div>
                    </div>

                    <div className="text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <div className="flex justify-center mt-4">
                        <button onClick={playPrevious} className="bg-gray-300 text-black px-4 py-2 mx-2 rounded hover:bg-gray-400">
                            <GrCaretPrevious />
                        </button>
                        <button
                            className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-700 ring-2 ring-gray-600"
                            onClick={togglePlayPause}
                        >
                            {isPlaying ? (
                                <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="6" y1="4" x2="6" y2="20" />
                                    <line x1="18" y1="4" x2="18" y2="20" />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            )}
                        </button>
                        <button onClick={playNext} className="bg-gray-300 text-black px-4 py-2 mx-2 rounded hover:bg-gray-400">
                            <GrCaretNext />

                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Play;



























