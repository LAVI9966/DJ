import React, { useEffect, useRef, useState } from 'react';
import MyContext from './myContext';
import {
    Timestamp, addDoc, collection,
    doc, setDoc, getDocs
} from 'firebase/firestore';
import { fireDB } from '../../firebase/firebaseconfig';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyStates = ({ children }) => {
    const [mode, setMode] = useState('dark');
    const [loading, setLoading] = useState(false);
    const [products, setproducts] = useState({
        file: null,
        title: null,
        album: null,
        genre: null,
        releaseDate: null,
        bpm: null,
        price: null,
        imageUrl: null,
        category: null,
        description: null,
        time: Timestamp.now(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        )
    });
    const [product, setproduct] = useState([]);
    const [order, setOrder] = useState([]);
    const [user, setUser] = useState([]);
    const [searchkey, setsearchkey] = useState('');
    const [filterType, setFilterType] = useState('');
    const [keyFilter, setKeyFilter] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    const [sliderlowervalue, setsliderlowervalue] = useState(40);
    const [slideruppervalue, setslideruppervalue] = useState(200);

    // New favorites-related state
    const [favSongs, setFavSongs] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);

    const toggleMode = () => {
        if (mode === 'Light') {
            setMode('dark');
            document.body.style.backgroundColor = "black";
            document.body.style.color = "white";
        } else {
            setMode('Light');
            document.body.style.backgroundColor = "white";
            document.body.style.color = "white";
        }
    };

    const addProduct = async () => {
        if (!products.title || !products.price || !products.imageUrl || !products.category || !products.description) {
            return toast.error("All fields are required");
        }

        setLoading(true);
        try {
            const productRef = collection(fireDB, 'products');
            await addDoc(productRef, products);
            getProductData();
            toast.success("Add Product Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    const getProductData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetchallsongs`);
            setproduct(response.data);
            console.log("state se product", response.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const getOrderData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/allorders`);
            setOrder(response.data);
        } catch (error) {
            console.log("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };


    // New favorites-related functions
    const fetchFavSongs = async () => {
        const userid = JSON.parse(localStorage.getItem('user'))?.uid;
        if (!userid) return;

        setFavoritesLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-favorites`, {
                params: { userid }
            });
            setFavSongs(response.data.songlist || []);
        } catch (error) {
            // console.error("Error fetching favorites:", error);
            // toast.error("Failed to load favorites");
        } finally {
            setFavoritesLoading(false);
        }
    };

    const handleFavoriteToggle = async (product) => {
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
            await fetchFavSongs();
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error updating favorites:", error);
            toast.error("Failed to update favorites");
        }
    };

    const isPresent = (songId) => {
        return favSongs.some(song => song.songid === songId);
    };

    // Initialize data
    useEffect(() => {
        getProductData();
        getOrderData();

        fetchFavSongs();
    }, []);

    const edithandle = (item) => {
        setproducts(item);
    };

    const updateProductFun = async () => {
        setLoading(true);
        try {
            await setDoc(doc(fireDB, 'products', products.id), products);
            toast.success("Product Updated successfully");
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 800);
            getProductData();
        } catch (error) {
            console.log(error);
            toast.error("Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async () => {
        setLoading(true);
        try {
            await getProductData();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete product");
        } finally {
            setLoading(false);
        }
    };
    const beatsref = useRef(null);
    const contactref = useRef(null);
    const licensingref = useRef(null);
    const servicesref = useRef(null);
    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start' // Aligns the top of the section with the top of the viewport
        });
    };
    return (
        <MyContext.Provider value={{
            mode,
            toggleMode,
            loading,
            setLoading,
            products,
            setproducts,
            product,
            addProduct,
            getProductData,
            edithandle,
            keyFilter,
            setKeyFilter,
            sliderlowervalue,
            setsliderlowervalue,
            slideruppervalue,
            setslideruppervalue,
            updateProductFun,
            deleteProduct,
            order,
            user,
            searchkey,
            setsearchkey,
            filterType,
            setFilterType,
            filterPrice,
            setFilterPrice,
            // New favorites-related values
            favSongs,
            favoritesLoading,
            handleFavoriteToggle,
            isPresent,
            fetchFavSongs,
            beatsref, licensingref, servicesref,
            contactref, scrollToSection
        }}>
            {children}
        </MyContext.Provider>
    );
};

export default MyStates;