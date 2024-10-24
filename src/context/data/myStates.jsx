import React, { useEffect, useState } from 'react'
import MyContext from './myContext'
import {
    Timestamp, addDoc, collection,
    doc, onSnapshot, orderBy, query,
    deleteDoc, setDoc,
    getDoc,
    getDocs
} from 'firebase/firestore';
import { fireDB } from '../../firebase/firebaseconfig';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyStates = ({ children }) => {
    const [mode, setMode] = useState('Light');
    const toggleMode = () => {
        if (mode == 'Light') {
            setMode('dark');
            document.body.style.backgroundColor = "black"
        } else {
            setMode('Light');
            document.body.style.backgroundColor = "white"
        }
    }

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
    }
    );
    const [licenses, setLicenses] = useState([
        { name: 'Silver', file: null, price: '' },
        { name: 'Gold', file: null, price: '' },
        { name: 'Platinum', file: null, price: '' },
    ]);

    const addProduct = async () => {
        if (products.title == null || products.price == null || products.imageUrl == null || products.category == null || products.description == null) {
            return toast.error("All field are required")
        }

        setLoading(true);

        try {
            const productRef = collection(fireDB, 'products');
            await addDoc(productRef, products);
            getProductData();
            toast.success("Add Product Successfully");
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const [product, setproduct] = useState([]);

    const getProductData = async () => {
        setLoading(true);
        try {
            // const q = query(
            //     collection(fireDB, 'products'),
            //     orderBy('time')
            // );
            // const data = onSnapshot(q, (QuerySnapshot) => {
            //     let productArray = [];
            //     QuerySnapshot.forEach((doc) => {
            //         productArray.push({ ...doc.data(), id: doc.id });
            //     });
            //     console.log("me getproduct function ka data hu", productArray)
            //     console.log("me hu gian ", product)
            //     setproduct(productArray);
            //     setLoading(false);

            // })
            // return () => data;
            console.log("hello")
            const response = await axios.get('http://localhost:3000/fetchallsongs');
            setproduct(response.data);
            setLoading(false);
            console.log("stste se product", response.data);
        } catch (error) {
            console.log(error)
            setLoading(false);
        }


    }


    useEffect(() => {
        getProductData();
    }, [])

    //update product  function
    const edithandle = (item) => {
        setproducts(item);
    }

    const updateProductFun = async () => {
        console.log("me click hora hu")
        setLoading(true);
        try {

            await setDoc(doc(fireDB, 'products', products.id), products)
            toast.success("Product Update successfully")
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 800)
            getProductData()
            setLoading(false);

        } catch (error) {
            console.log(error)
            setLoading(false);

        }
    }

    const deleteProduct = async (item) => {
        setLoading(true)
        try {
            getProductData();
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    const [order, setOrder] = useState([]);

    const getOrderData = async () => {
        setLoading(true);
        try {
            // Fetch orders from your MongoDB API endpoint
            const response = await axios.get('http://localhost:3000/allorders'); // Update with your actual API URL
            const orderArray = response.data; // Assuming the response contains the orders in the data field

            console.log("Fetched orders:", orderArray);
            setOrder(orderArray); // Update the state with the fetched orders
        } catch (error) {
            console.log("Error fetching orders:", error);
        } finally {
            setLoading(false); // Ensure loading is set to false in both success and error cases
        }
    };


    const [user, setUser] = useState([])
    const getUserData = async () => {
        setLoading(true);
        try {
            const result = await getDocs(collection(fireDB, "users"));
            const usersArray = [];
            result.forEach((doc) => {
                usersArray.push(doc.data());
                setLoading(false);
            })
            setUser(usersArray);
            console.log(usersArray);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrderData();
        getUserData();
    }, [])

    const [searchkey, setsearchkey] = useState('');
    const [filterType, setFilterType] = useState('');
    const [keyFilter, setKeyFilter] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    const [sliderlowervalue, setsliderlowervalue] = useState(40);
    const [slideruppervalue, setslideruppervalue] = useState(200);

    return (
        <MyContext.Provider value={{
            mode,
            toggleMode,
            loading,
            setLoading,
            products,
            setproducts,
            product,
            addProduct, getProductData,
            edithandle,
            keyFilter, setKeyFilter,
            sliderlowervalue, setsliderlowervalue,
            slideruppervalue, setslideruppervalue,
            updateProductFun,
            deleteProduct,
            order, user, searchkey, setsearchkey,
            filterType, setFilterType,
            filterPrice, setFilterPrice
        }}>
            {children}
        </MyContext.Provider>
    )
}

export default MyStates