import React, { useContext, useState } from 'react';
import MyContext from '../../context/data/myContext';
import Layout from '../../components/Layout/Layout';
import ordernot from '../../components/IMG/notorder.png';
import { doc } from 'firebase/firestore';
import { fireDB } from '../../firebase/firebaseconfig';
import LicenseGenerator from './LicenseGenerator';

function Order() {
    const userid = JSON.parse(localStorage.getItem('user')).user.uid;
    const context = useContext(MyContext);
    const { mode, loading, order } = context;
    const userOrders = order.filter(obj => obj.userid === userid);
    console.log("ye order he ", order);
    console.log("ye user ke order he ", userOrders);
    const handleSubmit = async () => {
        console.log("hii");
        try {
            const chut = "https://t.auntmia.com/nthumbs/2020-01-06/4887348/4887348_15.jpg";
            const response = await fetch('http://localhost:3000/send_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'lavishgehlod210204@gmail.com',
                    subject: 'Hello pagal ladki',
                    text: 'big boss dekhne se kuchh nahi hota beta kuchh or karo',
                    html: `<img src="${chut}" alt="image" style="max-width: 100%; height: auto;" />`,
                }),
            });

            const result = await response.text();
            if (response.ok) {
                console.log('Success:', result);
            } else {
                console.error('Error:', result);
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };


    return (
        <Layout>
            {/* {loading && <Loader />} */}
            {userOrders.length > 0 ? (
                <div className="h-full pt-10">
                    {userOrders.map((order, index) => (
                        <div key={index} className="mx-auto max-w-5xl justify-center px-6">
                            <div className="rounded-lg">
                                {order.cartItems.map((item) => {
                                    return (
                                        <div key={item.id} className="mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '' }}>
                                            <img src={item.imageUrl} alt="product-image" className="w-full rounded-lg sm:w-40" />
                                            <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                                <div className="mt-5 sm:mt-0">
                                                    <h1
                                                        className="text-lg md:text-lg font-bold text-gray-900"
                                                        style={{ color: mode === 'dark' ? 'white' : '', fontSize: '2.5rem' }}
                                                    >
                                                        {item.title}
                                                    </h1>

                                                    <p className="mt-1 text-xs text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>{item.description}</p>
                                                    <div className='flex flex-row item-center space-x-2'>

                                                        <label className="text-lg font-bold ">License: </label>
                                                        <p className="text-lg item-center">{item.selectedLicense.name}</p>
                                                    </div>
                                                    <div className='flex flex-row item-center space-x-2'>

                                                        <label className="text-lg font-bold ">Price: </label>
                                                        <p className="text-lg item-center">{item.selectedLicense.price}</p>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>{ }</p>
                                                </div>
                                            </div>
                                            <button onClick={handleSubmit}>sned</button>
                                            <LicenseGenerator />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <center>
                    <img className='flex justify-center' src={ordernot} alt="No Orders" />
                </center>
            )}
        </Layout>
    );
}

export default Order;
