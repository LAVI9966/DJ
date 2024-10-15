import React, { createContext, useState, useContext, useRef } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebaseconfig';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [tracks, setTracks] = useState([]); // Array to hold tracks
    const audioRef = useRef(new Audio());
    const [curritem, setcurritem] = useState("");
    const loadTrack = (Url, trackList, index) => {
        setcurritem(trackList[index]);
        setTracks(trackList); // Save the list of tracks
        setCurrentTrackIndex(index); // Set the current track index
        setAudioUrl(Url);
        audioRef.current.src = Url; // Set the audio source
        audioRef.current.load();
        audioRef.current.play(); // Auto-play the loaded track
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(isPlaying);
    };

    const playNext = () => {
        let nextIndex = (currentTrackIndex + 1) % tracks.length; // Loop back to the start
        loadTrack(tracks[nextIndex].fileUrl, tracks, nextIndex);
    };

    const playPrevious = () => {
        let previousIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length; // Loop to the end
        loadTrack(tracks[previousIndex].fileUrl, tracks, previousIndex);
    };

    const loopCurrentTrack = () => {
        audioRef.current.loop = true; // Enable looping for the current track
    };

    return (
        <PlayerContext.Provider value={{ loadTrack, togglePlayPause, playNext, playPrevious, loopCurrentTrack, isPlaying, audioUrl, curritem }}>
            {children}
            <audio
                ref={audioRef}
                onEnded={playNext} // Automatically play the next track when current ends
                onLoadedData={() => setIsPlaying(true)}
            />
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
