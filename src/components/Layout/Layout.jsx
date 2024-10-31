import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Fotter'
const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen"> {/* Flexbox for vertical layout */}
            <Navbar />
            <div className="flex-grow content"> {/* Allow this div to grow */}
                {children}
            </div>
            <Footer /> {/* Always at the bottom */}
        </div>
    );
};

export default Layout;
