import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [tracks, setTracks] = useState([]); // Array to hold tracks
    const audioRef = useRef(new Audio());
    const [curritem, setCurrItem] = useState({}); // Set initial state as an empty object

    const loadTrack = (fileUrl, trackList, index) => {
        // If the audio is already playing, pause it before loading the new track
        if (audioRef.current.src) {
            audioRef.current.pause();
        }

        const currentTrack = trackList[index];
        setCurrItem(currentTrack);
        setTracks(trackList);
        setCurrentTrackIndex(index);
        setAudioUrl(fileUrl);
        audioRef.current.src = fileUrl;
        audioRef.current.load();
        audioRef.current.play(); // Play the new track
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(prev => !prev);
    };

    const playNext = () => {
        let nextIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(tracks[nextIndex].fileUrl, tracks, nextIndex);
    };

    const playPrevious = () => {
        let previousIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(tracks[previousIndex].fileUrl, tracks, previousIndex);
    };

    useEffect(() => {
        // Cleanup to pause audio and clear source on component unmount
        return () => {
            audioRef.current.pause();
            audioRef.current.src = ''; // Clear source to avoid memory leaks
        };
    }, []);

    return (
        <PlayerContext.Provider value={{ loadTrack, togglePlayPause, playNext, playPrevious, isPlaying, audioUrl, curritem }}>
            {children}
            <audio
                ref={audioRef}
                onEnded={playNext}
                onLoadedData={() => {
                    setIsPlaying(true)
                    console.log('Play hua')
                }}
            />

        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
