import React, { useContext, useEffect, useState } from 'react';
import MyContext from '../../context/data/myContext';
import Layout from '../../components/Layout/Layout';
import ordernot from '../../components/IMG/notorder.png';
import axios from 'axios';
import LicenseGenerator from './LicenseGenerator';

function Order() {
    const userid = JSON.parse(localStorage.getItem('user')).uid;
    console.log("hello bhai", userid)
    const context = useContext(MyContext);
    const { mode, loading, order } = context;
    const [userOrders, setuserOrder] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3000/fetchOrders', { params: { userid } });
                console.log("feched user odere", response.data.response);
                setuserOrder(response.data.response);
            } catch (error) {
                console.error('Request failed:', error);
            }
        };
        fetchOrders();
    }, [userid]);

    return (
        <Layout>
            {userOrders.length > 0 ? (
                <div className="h-screen pt-10">
                    {userOrders.map((order, index) => (
                        <div key={index} className="mx-auto max-w-5xl p-6 space-y-6">
                            {order.cartItems.map((item) => {

                                const data = {
                                    ...item,
                                }
                                return (
                                    <div key={item.id} className="flex items-center bg-white shadow-lg rounded overflow-hidden">
                                        <img
                                            src={item.imageUrl}
                                            alt="Ordered Item"
                                            className="m-1 rounded w-48 h-48 object-cover"
                                            style={{ width: '300px', height: '300px' }} // Standard music cover size
                                        />
                                        <div className="px-6 py-4 flex-1">
                                            <div className="font-bold text-xl mb-2">Title: {item.title}</div>
                                            <p className="text-gray-700 text-base">Select License: {item.selectedLicense.name}</p>
                                            <p className="text-gray-700 text-base">Price: {item.selectedLicense.price}</p>

                                            <LicenseGenerator data={data} />
                                        </div>
                                    </div>
                                );
                            })}
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

}

export default Order;
