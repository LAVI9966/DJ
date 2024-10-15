import React, { useContext, useEffect } from 'react';
import Filter from '../../components/Filter/Filter';
import Layout from '../../components/Layout/Layout';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify'; // Assuming you are using react-toastify for notifications

function Allproducts() {
    const context = useContext(myContext);
    const {
        mode, product, searchkey, filterType
    } = context;

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    const addCart = (product) => {
        dispatch(addToCart(product));
        toast.success('Added to cart');
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <Filter />
            <div className=' container mx-auto px-4 mt-5 '>
                <div className="p-5 rounded-lg bg-gray-100 drop-shadow-xl border border-gray-200"
                    style={{
                        backgroundColor: mode === 'dark' ? '#282c34' : '',
                        color: mode === 'dark' ? 'white' : '',
                    }} >


                    <div className="p-6 px-0 overflow-scroll">
                        <table className="w-full mt-4 text-left table-auto min-w-max">
                            <thead>
                                <tr>
                                    <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Image</th>
                                    <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Title</th>
                                    <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Category</th>
                                    <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Price</th>
                                    <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product
                                    .filter((obj) => obj.title.toLowerCase().includes(searchkey || ''))
                                    .filter((obj) => obj.category.toLowerCase().includes(filterType || ''))
                                    .map((item, index) => {
                                        const { title, price, category, imageUrl, id } = item;
                                        return (
                                            <tr
                                                key={index}
                                                style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '' }}
                                                onClick={() => window.location.href = `/productinfo/${id}`}
                                            >
                                                <td className="p-4 border-b border-blue-gray-50">
                                                    <img
                                                        src={imageUrl}
                                                        alt={title}
                                                        className="inline-block h-9 w-9 !rounded-full object-cover object-center"
                                                    />
                                                </td>
                                                <td className="p-4 border-b border-blue-gray-50">
                                                    <p className="font-sans text-sm text-blue-gray-900">{title}</p>
                                                </td>
                                                <td className="p-4 border-b border-blue-gray-50">
                                                    <p className="font-sans text-sm text-blue-gray-900">{category}</p>
                                                </td>
                                                <td className="p-4 border-b border-blue-gray-50">
                                                    <p className="font-sans text-sm text-blue-gray-900">₹{price}</p>
                                                </td>
                                                <td className="p-4 border-b border-blue-gray-50">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevents triggering row click event
                                                            addCart(item);
                                                        }}
                                                        className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md"
                                                    >
                                                        Add To Cart
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Allproducts;