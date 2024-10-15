
import React from 'react';
import { usePlayer } from '../../context/player/playerContext';

const Player = () => {
    const { isPlaying, togglePlayPause } = usePlayer();

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg">
            <div className="flex items-center space-x-4 mt-2">
                {/* Play/Pause Button */}
                <button
                    className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-700 ring-2 ring-gray-600"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>
        </div>
    );
};

export default Player;


// // import React, { useState, useRef, useEffect } from 'react'
// // import { ref, getDownloadURL } from 'firebase/storage';
// // import { storage } from '../../firebase/firebaseconfig'
// // const Player = () => {

// //     const [audioUrl, setAudioUrl] = useState(null);
// //     const audioRef = useRef(null);

// //     useEffect(() => {
// //         const songRef = ref(storage, 'music/Aaj.mp3');

// //         getDownloadURL(songRef)
// //             .then((url) => {
// //                 setAudioUrl(url);
// //                 if (audioRef.current) {
// //                     audioRef.current.load(); // Reload audio element
// //                 }
// //             })
// //             .catch((err) => {
// //                 console.error('Error fetching audio URL:', err);
// //             });
// //     }, []);
// //     return (
// //         <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

// //             <div class="relative max-w-xl w-full h-36 bg-white rounded-lg shadow-lg overflow-hidden mb-32">
// //                 <div class="absolute inset-0 rounded-lg overflow-hidden bg-red-200">
// //                     <img src="https://images.unsplash.com/photo-1543794327-59a91fb815d1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=200&q=80" alt="" />
// //                     <div class="absolute inset-0 backdrop backdrop-blur-10 bg-gradient-to-b from-transparent to-black"></div>
// //                 </div>
// //                 <div class="absolute flex space-x-6 transform translate-x-6 translate-y-8">
// //                     <div class="w-36 h-36 rounded-lg shadow-lg overflow-hidden">
// //                         <img src="https://images.unsplash.com/photo-1543794327-59a91fb815d1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" alt="" />
// //                     </div>
// //                     <div class="text-white pt-12">
// //                         <h3 class="font-bold">Album</h3>
// //                         <div class="text-sm opacity-60">Super Interpret</div>
// //                         <div class="mt-8 text-gray-400">
// //                             <div class="flex items-center space-x-2 text-xs">
// //                                 <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                                     <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
// //                                     <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
// //                                 </svg>
// //                                 <span>Easy listening</span>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             <div class="max-w-xl bg-white rounded-lg shadow-lg overflow-hidden">
// //                 <div class="relative">
// //                     <img src="https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&h=250&q=80" class="object-cover" />
// //                     <div class="absolute p-4 inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-gray-900 backdrop backdrop-blur-5 text-white">
// //                         <h3 class="font-bold">Super Artist</h3>
// //                         <span class="opacity-70">Albumtitle</span>
// //                     </div>
// //                 </div>


// //                 <p>hello</p>
// //                 {audioUrl ? (
// //                     <audio ref={audioRef} controls preload="auto">
// //                         <source src={audioUrl} type="audio/mpeg" />
// //                         Your browser does not support the audio element.
// //                     </audio>
// //                 ) : (
// //                     <p>Loading audio...</p>
// //                 )}
// //                 {/* <audio controls class="w-full px-4 py-2">
// //                     <source src="./src/components/player/Aaj.mp3" type="audio/mpeg" />
// //                     Your browser does not support the audio tag.
// //                 </audio> */}
// //                 <div class="relative h-1 bg-gray-200">
// //                     <div class="absolute h-full w-1/2 bg-green-500 flex items-center justify-end">
// //                         <div class="rounded-full w-3 h-3 bg-white shadow"></div>
// //                     </div>
// //                 </div>

// //                 <div class="flex justify-between text-xs font-semibold text-gray-500 px-4 py-2">
// //                     <div>1:50</div>
// //                     <div class="flex space-x-3 p-2">
// //                         <button class="focus:outline-none">
// //                             <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                                 <polygon points="19 20 9 12 19 4 19 20"></polygon>
// //                                 <line x1="5" y1="19" x2="5" y2="5"></line>
// //                             </svg>
// //                         </button>
// //                         <button class="rounded-full w-8 h-8 flex items-center justify-center pl-0.5 ring-2 ring-gray-100 focus:outline-none">
// //                             <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                                 <polygon points="5 3 19 12 5 21 5 3"></polygon>
// //                             </svg>
// //                         </button>
// //                         <button class="focus:outline-none">
// //                             <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                                 <polygon points="5 4 15 12 5 20 5 4"></polygon>
// //                                 <line x1="19" y1="5" x2="19" y2="19"></line>
// //                             </svg>
// //                         </button>
// //                     </div>
// //                     <div>3:00</div>
// //                 </div>

// //                 <ul class="text-xs sm:text-base divide-y border-t cursor-default">
// //                     <li class="flex items-center space-x-3 hover:bg-gray-100">
// //                         <button class="p-3 hover:bg-green-500 group focus:outline-none">
// //                             <svg class="w-4 h-4 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                                 <polygon points="5 3 19 12 5 21 5 3"></polygon>
// //                             </svg>
// //                         </button>
// //                         <div class="flex-1">Artist - Title</div>
// //                         <div class="text-xs text-gray-400">2:58</div>
// //                         <button class="focus:outline-none pr-4 group">
// //                             <svg class="w-4 h-4 group-hover:text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                                 <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
// //                             </svg>
// //                         </button>
// //                     </li>
// //                 </ul>
// //             </div>
// //         </div>

// //     )
// // };

// // export default Player;
