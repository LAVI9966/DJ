import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Fotter'

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='content'>{children}</div>
            <Footer></Footer>
        </div>
    )
}

export default Layout