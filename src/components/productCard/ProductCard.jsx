import React, { useContext, useEffect } from 'react';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../../firebase/firebaseconfig';
import { usePlayer } from '../../context/player/playerContext';
import Play from '../player/play2';
// { title, time, bpm, price }
function ProductCard() {
    const { loadTrack, playNext, playPrevious } = usePlayer();
    const context = useContext(myContext);
    const { mode, product, searchkey, setsearchkey,
        filterType, setFilterType, filterPrice, setFilterPrice } = context;

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    console.log(cartItems);

    const addCart = (product) => {
        dispatch(addToCart(product));
        toast.success('Added to cart');
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const playmusic = async (item, index) => {
        console.log("ye me hu", item.fileUrl)
        loadTrack(item.fileUrl, product, index);
    }
    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-8 md:py-16 mx-auto">
                <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2"
                        style={{ color: mode === 'dark' ? 'white' : '' }}>
                        Our Latest Collection
                    </h1>
                    <div className="h-1 w-20 bg-pink-600 rounded"></div>
                </div>

                {/* Product Table */}
                <div className="p-6 px-0 ">
                    {/* <table class="w-full mt-4 text-left table-auto min-w-max">
                        <thead>
                            <tr>
                                <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p
                                        class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        one
                                    </p>
                                </th>
                                <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p
                                        class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        two
                                    </p>
                                </th>
                                <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p
                                        class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Three
                                    </p>
                                </th>
                                <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p
                                        class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        four
                                    </p>
                                </th>
                                <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p
                                        class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Five
                                    </p>
                                </th>
                                <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p
                                        class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Five
                                    </p>
                                </th>


                            </tr>
                        </thead>
                        <tbody>
                            {product
                                .filter((obj) => obj.title.toLowerCase().includes(searchkey || ''))
                                .filter((obj) => obj.category.toLowerCase().includes(filterType || ''))
                                .slice(0, 8)
                                .map((item, index) => {
                                    const { imageUrl, category, album, title, price, id, time, bpm } = item;
                                    return (
                                        <tr key={index} style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '' }}>
                                            <td class="p-4 border-b border-blue-gray-50">
                                                <div class="flex items-center gap-3">

                                                    <img src={imageUrl}
                                                        alt="John Michael"
                                                        class="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                                </div>
                                            </td>
                                            <td class="p-4 border-b border-blue-gray-50">
                                                <div class="flex items-center gap-3">

                                                    <div class="flex flex-col">
                                                        <p
                                                            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                            {title}
                                                        </p>
                                                        <p
                                                            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70">
                                                            {category}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="p-4 border-b border-blue-gray-50">
                                                <div class="flex items-center gap-3">

                                                    <div class="flex flex-col">
                                                        <p
                                                            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                            {album}
                                                        </p>

                                                    </div>
                                                </div>
                                            </td>
                                            <td class="p-4 border-b border-blue-gray-50">
                                                <div class="flex items-center gap-3">

                                                    <div class="flex flex-col">
                                                        <p
                                                            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                            {bpm}
                                                        </p>

                                                    </div>
                                                </div>
                                            </td>
                                            <td class="p-4 border-b border-blue-gray-50">
                                                <div class="flex items-center gap-3">

                                                    <div class="flex flex-col">
                                                        <p
                                                            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                            {time}
                                                        </p>

                                                    </div>
                                                </div>
                                            </td>
                                            <td class="p-4 border-b border-blue-gray-50">
                                                <div class="flex items-center gap-3">

                                                    <div class="flex flex-col">
                                                        <button
                                                            onClick={() => addCart(item)}
                                                            className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md"
                                                        >
                                                            Add To Cart
                                                        </button>

                                                    </div>
                                                </div>
                                            </td>





                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table> */}



                    <div className="overflow-x-auto mx-4 my-6"> {/* Added margin here */}
                        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg"> {/* Added shadow and rounded corners */}
                            <thead>
                                <tr className="bg-gray-200 text-gray-600">
                                    <th className="p-4 border-b">#</th>
                                    <th className="p-4 border-b">Image</th>
                                    <th className="p-4 border-b">Title & Category</th>
                                    <th className="p-4 border-b">Time</th>
                                    <th className="p-4 border-b">BPM</th>
                                    <th className="p-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-100">
                                        <td className="p-4 border-b">{index + 1}</td>
                                        <td className="p-4 border-b">
                                            <div onClick={() => { playmusic(item, index) }}>
                                                <img src={item.imageUrl} alt={item.title} className="h-12 w-12 rounded" />
                                            </div>
                                        </td>
                                        <td className="p-4 border-b">
                                            <div>{item.title}</div>
                                            <div className="text-gray-500">{item.category}</div>
                                        </td>
                                        <td className="p-4 border-b">{item.time}</td>
                                        <td className="p-4 border-b">{item.bpm}</td>
                                        <td className="p-4 border-b">
                                            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition">
                                                Add to Cart
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                </div>
            </div>

        </section>
    );
}

export default ProductCard;
