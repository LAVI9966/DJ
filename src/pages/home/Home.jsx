import React, { useContext } from 'react'
import Layout from '../../components/Layout/Layout'
import MyContext from '../../context/data/myContext.jsx'
import Hero from '../../components/Hero/Hero.jsx'
import Filter from '../../components/Filter/Filter.jsx'
import ProductCard from '../../components/productCard/ProductCard.jsx'
import Testimonial from '../../components/testimonials/Testimonials.jsx'
import Track from '../../components/track/Track.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Home = () => {

    return (
        <>

            <Layout>
                <Hero></Hero>
                <Filter></Filter>
                <ProductCard></ProductCard>
                <div className='flex justify-center -mt-10 mb-4'>
                    <Link to={'/allproducts'}>
                        <button className='bg-gray-300 px-5 py-2 rounded-xl'>See More </button>
                    </Link>
                </div>
                <Track></Track>
                <Testimonial></Testimonial>
            </Layout>
        </>
    )
}
export default Home