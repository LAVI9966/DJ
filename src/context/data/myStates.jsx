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

const MyStates = ({ children }) => {
    const [mode, setMode] = useState('Light');
    const toggleMode = () => {
        if (mode == 'Light') {
            setMode('dark');
            document.body.style.backgroundColor = "rgb(17,24,39)"
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
            const q = query(
                collection(fireDB, 'products'),
                orderBy('time')
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let productArray = [];
                QuerySnapshot.forEach((doc) => {
                    productArray.push({ ...doc.data(), id: doc.id });
                });
                console.log("me getproduct function ka data hu", productArray)
                console.log("me hu gian ", product)
                setproduct(productArray);
                setLoading(false);

            })
            return () => data;
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

            await deleteDoc(doc(fireDB, 'products', item.id));
            toast.success('Product Deleted Successfully')
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
            const result = await getDocs(collection(fireDB, 'order'))
            const orderArray = [];
            result.forEach((doc) => {
                orderArray.push(doc.data());
                setLoading(false);
            })
            console.log("hui hui pui", orderArray);
            setOrder(orderArray);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

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
    const [filterPrice, setFilterPrice] = useState('');

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
            edithandle,
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