import React, { useContext, useEffect, useState } from 'react';
import MyContext from '../../context/data/myContext';
import Layout from '../../components/Layout/Layout';
import ordernot from '../../components/IMG/notorder.png';
import axios from 'axios';
import LicenseGenerator from './LicenseGenerator';
import { useTheme } from 'next-themes';
import { MagicCard } from '../../components/ui/magic-card';
const Order = () => {
    const userid = JSON.parse(localStorage.getItem('user')).uid;
    const context = useContext(MyContext);
    const { loading } = context;
    const [userOrders, setUserOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3000/fetchOrders', { params: { userid } });
                setUserOrders(response.data.response);
            } catch (error) {
                console.error('Request failed:', error);
                setError('Failed to fetch orders. Please try again later.');
            }
        };
        fetchOrders();
    }, [userid]);

    if (loading) {
        return <div>Loading...</div>;
    }
    const { theme } = useTheme();
    return (
        <Layout>

            {error && <div className="text-white text-center">{error}</div>}
            {userOrders.length > 0 ? (
                <div className="pt-10"> {/* Removed h-screen for better flexibility */}
                    {userOrders.map((order, index) => (
                        <div key={index} className="mx-auto max-w-5xl p-6 space-y-6">
                            {order.cartItems.map((item) => (

                                <MagicCard key={item.id} className="flex items-center bg-black shadow-lg rounded overflow-hidden mb-4">
                                    <div className='flex'>

                                        <img
                                            src={item.imageUrl}
                                            alt="Ordered Item"
                                            className="m-1 rounded w-48 h-48 object-cover"
                                            style={{ width: '300px', height: '300px' }} // Standard music cover size
                                        />
                                        <div className="px-6 py-4 flex-1">
                                            <div className="font-bold text-white text-xl mb-2">Title: {item.title}</div>
                                            <p className="text-white text-base">Select License: {item.selectedLicense.name}</p>
                                            <p className="text-white text-base">Price: ${item.selectedLicense.price}</p>
                                            <LicenseGenerator data={{ ...item }} />
                                        </div>
                                    </div>
                                </MagicCard>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <center>
                    <img className="flex justify-center" src={ordernot} alt="No Orders" />
                </center>
            )}
        </Layout>
    );
};

export default Order;
