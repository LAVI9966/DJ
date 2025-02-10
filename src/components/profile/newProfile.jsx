import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { User, MapPin, Phone, Star, Mail, Calendar } from 'lucide-react';
import FavoriteSongsList from './SongCard';
import Layout from '../Layout/Layout';
const UserRegistrationFlow = () => {
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
    const [isLoading, setIsLoading] = useState(true);
    const [existingUserData, setExistingUserData] = useState(null);
    const [favSongs, setFavSongs] = useState([]);
    const [formData, setFormData] = useState({
        legalName: '',
        artistName: '',
        pincode: '',
        streetAddress: '',
        state: '',
        country: '',
        phoneNumber: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    // Load user data from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            toast.error("Session expired, please login again.");
        }
    }, []);

    // Check user status and fetch existing data
    useEffect(() => {
        const checkUserStatus = async () => {
            if (!isAuthenticated || !user) {
                setIsLoading(false);
                return;
            }

            if (!user.email_verified) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getuser`, {
                    params: { email: user.email }
                });
                console.log("This is response data ", response.data)

                if (response.data) {
                    setExistingUserData(response.data);

                    // Fetch favorite songs
                    const favoritesResponse = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/get-favorites`,
                        { params: { userid: response.data.uid } }
                    );

                    setFavSongs(favoritesResponse.data.songlist || []);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (error.response.status == 404) {

                    toast.info("No songs Added to Favorite");
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkUserStatus();
    }, [user, isAuthenticated]);
    const [songDetails, setSongDetails] = useState([]);

    // Add this new useEffect after your existing useEffect
    useEffect(() => {
        const fetchSongDetails = async () => {
            if (!favSongs.length) return;

            try {
                // Create an array of promises for all song fetch requests
                const songPromises = favSongs.map(song =>
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetchsong`, {
                        params: { songid: song.songid }
                    })
                );

                // Wait for all requests to complete
                const responses = await Promise.all(songPromises);

                // Extract the song data from responses
                const songsData = responses.map(response => response.data);
                setSongDetails(songsData);
                console.log("here it is song details ", songDetails)
            } catch (error) {
                console.error("Error fetching song details:", error);
                toast.error("Failed to fetch some song details");
            }
        };

        fetchSongDetails();
    }, [favSongs]); // Dependency on favSongs

    //    Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const submitData = {
                ...formData,
                email: userData?.email,
                uid: userData?.uid
            };

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/adduser`, {
                chato: submitData
            });

            setSubmissionSuccess(true);
            toast.success("Profile updated successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 mx-auto mb-4" />
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
                        <button
                            onClick={loginWithRedirect}
                            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!user.email_verified) {
        return (
            <Layout>
                <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
                        <h2 className="text-2xl font-bold text-red-700 mb-4">
                            Email Verification Required
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Please verify your email address to complete your profile.
                            Check your inbox for a verification link.
                        </p>
                        <button
                            onClick={loginWithRedirect}
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (existingUserData) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
                    <div className="w-full bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
                        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-pink-500 to-red-500 p-1">
                                        <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
                                                {existingUserData.artistName?.[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800" />
                                </div>

                                <div className="text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-white">
                                        {existingUserData.artistName}
                                        <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400">
                                            Verified Artist
                                        </span>
                                    </h1>
                                    <p className="text-gray-400 mt-1">{existingUserData.genre}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                                        <span className="text-gray-300 flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            {existingUserData.followers} followers
                                        </span>
                                        <span className="text-gray-300 flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-blue-400" />
                                            Joined {formatDate(existingUserData.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
                            <div className="space-y-4">
                                <InfoItem
                                    icon={<User className="w-5 h-5 text-blue-400 mt-1" />}
                                    label="Legal Name"
                                    value={existingUserData.legalName}
                                />
                                <InfoItem
                                    icon={<MapPin className="w-5 h-5 text-blue-400 mt-1" />}
                                    label="Address"
                                    value={
                                        <>
                                            <p className="text-white">{existingUserData.streetAddress}</p>
                                            <p className="text-white">
                                                {existingUserData.state}, {existingUserData.country} - {existingUserData.pincode}
                                            </p>
                                        </>
                                    }
                                />
                                <InfoItem
                                    icon={<Phone className="w-5 h-5 text-blue-400 mt-1" />}
                                    label="Phone"
                                    value={existingUserData.phoneNumber}
                                />
                                <InfoItem
                                    icon={<Mail className="w-5 h-5 text-blue-400 mt-1" />}
                                    label="Email"
                                    value={existingUserData.email}
                                />
                            </div>
                        </div>
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
                            >
                                Favorites Songs
                            </motion.h1>
                            <FavoriteSongsList songs={songDetails}></FavoriteSongsList>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
                <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-4xl font-extrabold text-center text-blue-400 mb-8">
                            Complete Your Profile
                        </h2>

                        <FormFields formData={formData} handleInputChange={handleInputChange} />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>

                        {submissionSuccess && (
                            <p className="text-green-400 text-center mt-4">
                                Submission Successful!
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </Layout>
    );
};

// Helper Components
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        {icon}
        <div>
            <p className="text-gray-400 text-sm">{label}</p>
            {typeof value === 'string' ? <p className="text-white">{value}</p> : value}
        </div>
    </div>
);

const FormFields = ({ formData, handleInputChange }) => {
    const fields = [
        { id: 'legalName', label: 'Legal Name', placeholder: 'Enter your full legal name' },
        { id: 'artistName', label: 'Artist Name', placeholder: 'Enter your artist name' },
        { id: 'streetAddress', label: 'Street Address', placeholder: 'Enter your street address' },
        { id: 'pincode', label: 'Pincode', placeholder: 'Enter 6-digit pincode' },
        { id: 'state', label: 'State', placeholder: 'Enter your state' },
        { id: 'country', label: 'Country', placeholder: 'Enter your country' },
        { id: 'phoneNumber', label: 'Phone Number', placeholder: 'Enter 10-digit phone number', fullWidth: true },
    ];

    return (
        <>
            <div className="grid md:grid-cols-2 gap-6">
                {fields.map(field => !field.fullWidth && (
                    <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-semibold text-gray-300 mb-2">
                            {field.label}
                        </label>
                        <input
                            id={field.id}
                            type="text"
                            name={field.id}
                            value={formData[field.id]}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                            placeholder={field.placeholder}
                        />
                    </div>
                ))}
            </div>
            {fields.filter(field => field.fullWidth).map(field => (
                <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-semibold text-gray-300 mb-2">
                        {field.label}
                    </label>
                    <input
                        id={field.id}
                        type="text"
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                        placeholder={field.placeholder}
                    />
                </div>
            ))}
        </>
    );
};

export default UserRegistrationFlow;