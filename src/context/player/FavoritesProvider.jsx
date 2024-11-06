// src/context/favorites/favoritesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFavorites = async () => {
        const userid = JSON.parse(localStorage.getItem('user'))?.uid;
        if (!userid) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-favorites`, {
                params: { userid }
            });
            setFavoriteSongs(response.data.songlist || []);
        } catch (error) {
            // console.error("Error fetching favorites:", error);
            // toast.error("Failed to load favorites");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFavorite = async (product) => {
        const userid = JSON.parse(localStorage.getItem('user'))?.uid;
        if (!userid) {
            toast.error("Please login to add favorites");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/add-to-favorites`, {
                songid: product._id,
                userid
            });

            // Optimistically update the UI
            if (isPresent(product._id)) {
                setFavoriteSongs(prev => prev.filter(song => song.songid !== product._id));
            } else {
                setFavoriteSongs(prev => [...prev, { songid: product._id }]);
            }

            toast.success(response.data.message);
            await fetchFavorites(); // Refresh favorites to ensure sync with server
        } catch (error) {
            console.error("Error updating favorites:", error);
            toast.error("Failed to update favorites");
            await fetchFavorites(); // Refresh in case of error to ensure UI is in sync
        }
    };

    const isPresent = (songId) => {
        return favoriteSongs.some(song => song.songid === songId);
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <FavoritesContext.Provider value={{
            favoriteSongs,
            isLoading,
            toggleFavorite,
            isPresent,
            fetchFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};