import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Calendar, Clock, ExternalLink } from 'lucide-react';
import MyContext from '../../context/data/myContext';
import Layout from '../../components/Layout/Layout';
import { MagicCard } from '../../components/ui/magic-card';
import { useTheme } from 'next-themes';
import axios from 'axios';
import LicenseGenerator from './LicenseGenerator';

const Order = () => {
    const userid = JSON.parse(localStorage.getItem('user')).uid;
    const context = useContext(MyContext);
    const { loading } = context;
    const [userOrders, setUserOrders] = useState([]);
    const [error, setError] = useState(null);
    const { theme } = useTheme();

    console.log("this is my console log ", userOrders)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetchOrders`, {
                    params: { userid }
                });
                setUserOrders(response.data.response);
            } catch (error) {
                console.error('Request failed:', error);
                setError('Failed to fetch orders. Please try again later.');
            }
        };
        fetchOrders();
    }, [userid]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
                {error ? (
                    <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-lg">
                        {error}
                    </div>
                ) : userOrders.length > 0 ? (
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-10">
                            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                My Orders
                            </h1>
                            <p className="text-gray-400 mt-2 text-sm md:text-base">
                                Manage and download your purchased tracks
                            </p>
                        </div>

                        {/* Orders List */}
                        {userOrders.map((order, orderIndex) => (
                            <div key={orderIndex} className="mb-8">
                                {/* Order Header */}
                                <div className="p-4 md:p-6 bg-gray-800 rounded-lg shadow-md mb-4">
                                    <div className="flex flex-wrap justify-between items-center text-gray-300 space-y-2 md:space-y-0">
                                        <div className="w-full md:w-auto">
                                            <p className="text-sm text-gray-400">Order ID</p>
                                            <p className="font-semibold break-all">{order._id}</p>
                                        </div>
                                        <div className="w-full md:w-auto">
                                            <p className="text-sm text-gray-400">Total Amount</p>
                                            <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div className="w-full md:w-auto">
                                            <p className="text-sm text-gray-400">Order Date</p>
                                            <p className="font-semibold">{formatDate(order.date)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4">
                                    {order.cartItems.map((item) => (
                                        <MagicCard
                                            key={item._id}
                                            className="bg-gray-900 border border-gray-800 rounded-lg hover:border-purple-500/70 transition-all duration-300 shadow-lg"
                                        >
                                            <div className="flex flex-col md:flex-row p-4 space-y-4 md:space-y-0">
                                                {/* Image Section */}
                                                <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover shadow-md"
                                                    />
                                                </div>

                                                {/* Content Section */}
                                                <div className="flex-1 px-4 md:px-6 mt-4 md:mt-0">
                                                    <div className="flex flex-col justify-between h-full">
                                                        <div>
                                                            <Link
                                                                to={`/order/${item.id}`}
                                                                state={{ item }}
                                                                className="text-xl md:text-2xl font-semibold text-gray-100 hover:text-purple-400 transition-colors flex items-center gap-2"
                                                            >
                                                                {item.title}
                                                                <ExternalLink className="w-4 h-4" />
                                                            </Link>

                                                            <div className="mt-3 flex gap-2 flex-wrap">
                                                                <span className="px-3 py-1 bg-purple-600/20 rounded-full text-xs md:text-sm text-purple-400 font-medium">
                                                                    {item.selectedLicense.name}
                                                                </span>
                                                                <span className="px-3 py-1 bg-green-600/20 rounded-full text-xs md:text-sm text-green-400 font-medium">
                                                                    ${item.selectedLicense.price.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <LicenseGenerator data={{ ...item }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </MagicCard>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <img
                            src="https://via.placeholder.com/200"
                            alt="No Orders"
                            className="max-w-xs opacity-80"
                        />
                        <p className="mt-4 text-gray-400">No orders found</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Order;
