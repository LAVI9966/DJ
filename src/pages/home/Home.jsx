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
import { useState } from 'react'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";


const Home = () => {

    return (<>

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


// // // Create styles for the PDF




// import React, { useRef, useState } from "react";
// import SignatureCanvas from "react-signature-canvas";

// const SignaturePad = () => {
//     const sigCanvas = useRef(null); // Reference to SignatureCanvas
//     const [signature, setSignature] = useState(null); // Store signature data

//     // Save the signature as a base64 string and trigger download
//     const saveAsImage = () => {
//         if (sigCanvas.current.isEmpty()) {
//             alert("Please provide a signature first!");
//         } else {
//             const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
//             setSignature(dataURL); // Store the base64 data

//             // Create a temporary link element to trigger download
//             const link = document.createElement("a");
//             link.href = dataURL;
//             link.download = "signature.png";
//             link.click();
//         }
//     };

//     // Clear the canvas
//     const clearSignature = () => {
//         sigCanvas.current.clear();
//         setSignature(null);
//     };

//     return (
//         <div style={{ textAlign: "center", marginTop: "20px" }}>
//             <h2>Customer Signature</h2>
//             <SignatureCanvas
//                 ref={sigCanvas}
//                 penColor="black"
//                 canvasProps={{ width: 500, height: 200, className: "signatureCanvas" }}
//                 backgroundColor="#f5f5f5"
//             />

//             <div style={{ marginTop: "10px" }}>
//                 <button onClick={saveAsImage}>Save as Image</button>
//                 <button onClick={clearSignature} style={{ marginLeft: "10px" }}>Clear</button>
//             </div>

//             {signature && (
//                 <div style={{ marginTop: "20px" }}>
//                     <h3>Saved Signature Preview:</h3>
//                     <img src={signature} alt="Customer Signature" />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SignaturePad;
