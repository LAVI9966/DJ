import React, { useState, useEffect, useId } from 'react';
import { PDFDownloadLink, Document, Line, Image, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from "../../firebase/firebaseconfig"
import { useAuth0 } from '@auth0/auth0-react';
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
    },
    title: {
        fontSize: 15,
        marginBottom: 0,
        textAlign: 'left',
        fontWeight: '900',
    },
    sectionTitle: {
        fontSize: 13,
        marginBottom: 2,
        fontWeight: '900',
    },
    section: {
        marginBottom: 15,
    },
    text: {
        fontSize: 10,
        marginBottom: 10,
    },
    footer: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 'auto',
        color: 'black',
    },
    line: {
        marginBottom: 5,
        height: 1,
        backgroundColor: 'black',
    },
})
const LicenseGenerator = ({ data }) => {
    const [userformail, setuserformail] = useState([]);
    const [AllcartItemsOfUser, setAllCartItemOfUser] = useState([]);
    const { user, isLoading } = useAuth0();
    const userid = JSON.parse(localStorage.getItem('user'));
    //have user info from db
    const [userData, setUserData] = useState({})

    function getStructuredDate(dateInput) {
        // Create a Date object from the input
        const date = new Date(dateInput);

        // Check if the date is valid
        if (isNaN(date)) {
            return 'Invalid Date';
        }

        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading 0 if necessary
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
        const year = date.getFullYear();

        // Return in the format "DD-MM-YYYY"
        var dick = `${day}-${month}-${year}`;
        return dick
    }


    //abhi tak ye nniche wala use effect jo he wo ek email se sare cart ko map  kar ke sare items ko jo he ek arry medera he 
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fethcdoc`, { params: { email: userid?.email } });
                setuserformail(response.data); // Update `userformail` state asynchronously

                // Directly calculate `cartItemsArray` using `response.data`
                const cartItemsArray = response.data.flatMap(item => item.cartItems || []);
                setAllCartItemOfUser(cartItemsArray);
            } catch (error) {
            }
        };
        const fetchUserData = async () => {
            try {
                // Sending GET request with email parameter
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getuser`, {
                    params: { email: userid?.email } // Attaching email as query parameter
                });
                setUserData(response.data);
            } catch (error) {
            }
        };
        fetchUserData();
        getUser();
    }, [user]);

    const LicenseDocumentTracout = ({ }) => (

        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>DURSH: Trackouts License</Text>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>License Agreement</Text>
                    <View style={styles.line} />

                    <Text style={styles.text}>
                        THIS LICENCE AGREEMENT is made on {getStructuredDate(data.date)} ("Effective Date") by and between {userData.legalName}, professionally known as {userData.artistName} and living at {userData.streetAddress}, {userData.country} (hereinafter referred to as the "Licensee") and Durgesh Gurjar, professionally known as DURSH and living at 97/A, Pandit Dindayal Upadhyay Nagar, Sukhliya, Indore, India (hereinafter referred to as the "Licensor").
                        Licensor warrants that it controls the mechanical rights in and to the copyrighted musical works entitled {data.title} ("Composition") as of and prior to the date first written above.
                        The Composition, including the music thereof, was composed by Durgesh Gurjar ("Songwriter") managed under the Licensor.
                    </Text>

                    <Text style={styles.sectionTitle}>Master Use</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee a non-exclusive license (this "License") to record vocal synchronization to the Composition partly or in its entirety and substantially in its original form ("Master Recording").
                    </Text>

                    <Text style={styles.sectionTitle}>Distribution Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee a non-exclusive license to use the Master Recording in the reproduction, duplication, manufacture, and distribution of phonograph records, cassette tapes, compact disk, digital downloads, other miscellaneous audio and digital recordings, and any lifts and versions thereof (collectively, the "Recordings", and individually, a "Recording") worldwide for the pressing or selling a total of unlimited copies of such Recordings or any combination of such Recordings.
                    </Text>

                    <Text style={styles.sectionTitle}>Streaming Rights</Text>
                    <Text style={styles.text}>
                        Additionally, licensee shall be permitted to distribute unlimited free internet downloads or streams for non-profit and non-commercial use. This license allows unlimited monetized audio streams to sites like Spotify or Apple Music.
                    </Text>

                    <Text style={styles.sectionTitle}>Synchronization Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants limited synchronization rights for 1 monetized music video streamed online (YouTube, Vimeo, etc..) for unlimited streams in total on all websites. A separate synchronization license will need to be purchased for distribution of video to Television, Film, or Video game.
                    </Text>

                    <Text style={styles.sectionTitle}>Performance Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee a non-exclusive license to use the Master Recording in unlimited non-profit performances, shows, or concerts. Licensee may receive compensation from performances with this license.
                    </Text>

                    <Text style={styles.sectionTitle}>Broadcast Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee broadcasting rights for unlimited radio stations.
                    </Text>

                    <Text style={styles.sectionTitle}>Credit</Text>
                    <Text style={styles.text}>
                        Licensee shall acknowledge the original authorship of the Composition appropriately and reasonably in all media and performance formats under the name "DURSH" in writing where possible and vocally otherwise.
                    </Text>

                    <Text style={styles.sectionTitle}>Consideration</Text>
                    <Text style={styles.text}>
                        In consideration for the rights granted under this agreement, Licensee shall pay to Licensor the sum of {data.selectedLicense.price} Indian Rupee and other good and valuable consideration, payable to Durgesh Gurjar, receipt of which is hereby acknowledged. If the Licensee fails to account to the Licensor, timely complete the payments provided for hereunder, or perform its other obligations hereunder, including having insufficient bank balance, the licensor shall have the right to terminate License upon written notice to the Licensee.
                        Such termination shall render the recording, manufacture and/or distribution of Recordings for which monies have not been paid subject to and actionable infringements under applicable law, including, without limitation, the Indian Copyright Act, as amended.
                    </Text>

                    <Text style={styles.sectionTitle}>Delivery</Text>
                    <Text style={styles.text}>
                        The Composition shall be delivered as high quality MP3 File + WAV File + Trackout Files, as such terms are understood in the music industry, via email to an email address that Licensee provided to Licensor. Licensee shall receive an email with an attachment or link to download the Composition.
                    </Text>

                    <Text style={styles.sectionTitle}>Term</Text>
                    <Text style={styles.text}>
                        The Term of this Agreement shall be 100 years and this license shall expire on the 100-year anniversary of the Effective Date.
                    </Text>

                    <Text style={styles.sectionTitle}>Audio Samples</Text>
                    <Text style={styles.text}>
                        3rd party sample clearance is the responsibility of the Licensee.
                    </Text>

                    <Text style={styles.sectionTitle}>Restrictions</Text>
                    <Text style={styles.text}>
                        The rights granted to Licensee are NON-TRANSFERABLE and that Licensee may not transfer or assign any of its rights hereunder to any third-party.
                        This restriction includes, but is not limited to, use of the Composition and/or Master Recording in television, commercials, film/movies, theatrical works, video games, and in any other form on the Internet which is not expressly permitted herein. Licensee shall not have the right to license or sublicense any use of the Composition or of the Master Recording, in whole or in part, for any so-called "samples".
                        Licensee shall not engage in any unlawful copying, streaming, duplicating, selling, lending, renting, hiring, broadcasting, uploading, or downloading to any database, servers, computers, peer-to-peer sharing, or other file sharing services, posting on websites, or distribution of the Composition in the form, or a substantially similar form, as delivered to Licensee.
                        Licensee may send the Composition file to any individual musician, engineer, studio manager, or other person who is working on the Master Recording.
                    </Text>

                    <Text style={styles.sectionTitle}>Ownership</Text>
                    <Text style={styles.text}>
                        The Licensor is and shall remain the sole owner and holder of all right, title, and interest in the Composition, including all copyrights to and in the sound recording and the underlying musical compositions written and composed by Licensor.
                    </Text>

                    <Text style={styles.sectionTitle}>Writer's Share and Publishing Rights</Text>
                    <Text style={styles.text}>
                        With respect to the publishing rights and ownership of the underlying Composition embodied in the Master Recording, the Licensee and the Licensor hereby acknowledge and agree that it shall be owned/split between them as follows:
                        Licensor shall own and control 50% of the so-called "Writer's Share" of the underlying Composition.
                        Licensor shall own, control, and administer 50% of the so-called "Publisher's Share" of the underlying Composition embodied in the Master Recording.
                    </Text>

                    <Text style={styles.sectionTitle}>Governing Law</Text>
                    <Text style={styles.text}>
                        This License is governed by and shall be construed under the law of India, without regard to the conflicts of laws principles thereof.
                    </Text>
                </View>
            </Page>
        </Document>

    );
    const LicenseDocumentWav = ({ }) => (

        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>DURSH: WAV License</Text>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>License Agreement</Text>
                    <View style={styles.line} />

                    <Text style={styles.text}>
                        THIS LICENCE AGREEMENT is made on {getStructuredDate(data.date)} ("Effective Date") by and between {userData.legalName}, professionally known as {userData.artistName} and living at {userData.streetAddress}, {userData.country} (hereinafter referred to as the "Licensee") and Durgesh Gurjar, professionally known as DURSH and living at 97/A, Pandit Dindayal Upadhyay Nagar, Sukhliya, Indore, India (hereinafter referred to as the "Licensor").
                        Licensor warrants that it controls the mechanical rights in and to the copyrighted musical works entitled {data.title} ("Composition") as of and prior to the date first written above.
                        The Composition, including the music thereof, was composed by Durgesh Gurjar ("Songwriter") managed under the Licensor.
                    </Text>

                    <Text style={styles.sectionTitle}>Master Use</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee a non-exclusive license (this "License") to record vocal synchronization to the Composition partly or in its entirety and substantially in its original form ("Master Recording").
                    </Text>

                    <Text style={styles.sectionTitle}>Distribution Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee a non-exclusive license to use the Master Recording in the reproduction, duplication, manufacture, and distribution of phonograph records, cassette tapes, compact disk, digital downloads, other miscellaneous audio and digital recordings, and any lifts and versions thereof (collectively, the "Recordings", and individually, a "Recording") worldwide for the pressing or selling a total of 100000 copies of such Recordings or any combination of such Recordings.
                    </Text>

                    <Text style={styles.sectionTitle}>Streaming Rights</Text>
                    <Text style={styles.text}>
                        Additionally, licensee shall be permitted to distribute unlimited free internet downloads or streams for non-profit and non-commercial use. This license allows 1000000 monetized audio streams to sites like Spotify or Apple Music.
                    </Text>

                    <Text style={styles.sectionTitle}>Synchronization Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants limited synchronization rights for 1 monetized music video streamed online (YouTube, Vimeo, etc..) for 1000000 streams in total on all websites. A separate synchronization license will need to be purchased for distribution of video to Television, Film, or Video game.
                    </Text>

                    <Text style={styles.sectionTitle}>Performance Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee a non-exclusive license to use the Master Recording in unlimited non-profit performances, shows, or concerts. Licensee may receive compensation from performances with this license.
                    </Text>

                    <Text style={styles.sectionTitle}>Broadcast Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee broadcasting rights for 10 radio stations.
                    </Text>

                    <Text style={styles.sectionTitle}>Credit</Text>
                    <Text style={styles.text}>
                        Licensee shall acknowledge the original authorship of the Composition appropriately and reasonably in all media and performance formats under the name "DURSH" in writing where possible and vocally otherwise.
                    </Text>

                    <Text style={styles.sectionTitle}>Consideration</Text>
                    <Text style={styles.text}>
                        In consideration for the rights granted under this agreement, Licensee shall pay to Licensor the sum of {data.selectedLicense.price} Indian Rupee and other good and valuable consideration, payable to Durgesh Gurjar, receipt of which is hereby acknowledged. If the Licensee fails to account to the Licensor, timely complete the payments provided for hereunder, or perform its other obligations hereunder, including having insufficient bank balance, the licensor shall have the right to terminate License upon written notice to the Licensee.
                        Such termination shall render the recording, manufacture and/or distribution of Recordings for which monies have not been paid subject to and actionable infringements under applicable law, including, without limitation, the Indian Copyright Act, as amended.
                    </Text>

                    <Text style={styles.sectionTitle}>Delivery</Text>
                    <Text style={styles.text}>
                        The Composition shall be delivered as high quality MP3 File + WAV File, as such terms are understood in the music industry, via email to an email address that Licensee provided to Licensor. Licensee shall receive an email with an attachment or link to download the Composition.
                    </Text>

                    <Text style={styles.sectionTitle}>Term</Text>
                    <Text style={styles.text}>
                        The Term of this Agreement shall be 10 years and this license shall expire on the 10-year anniversary of the Effective Date.
                    </Text>

                    <Text style={styles.sectionTitle}>Audio Samples</Text>
                    <Text style={styles.text}>
                        3rd party sample clearance is the responsibility of the Licensee.
                    </Text>

                    <Text style={styles.sectionTitle}>Restrictions</Text>
                    <Text style={styles.text}>
                        The rights granted to Licensee are NON-TRANSFERABLE and that Licensee may not transfer or assign any of its rights hereunder to any third-party.
                        This restriction includes, but is not limited to, use of the Composition and/or Master Recording in television, commercials, film/movies, theatrical works, video games, and in any other form on the Internet which is not expressly permitted herein. Licensee shall not have the right to license or sublicense any use of the Composition or of the Master Recording, in whole or in part, for any so-called "samples".
                        Licensee shall not engage in any unlawful copying, streaming, duplicating, selling, lending, renting, hiring, broadcasting, uploading, or downloading to any database, servers, computers, peer-to-peer sharing, or other file sharing services, posting on websites, or distribution of the Composition in the form, or a substantially similar form, as delivered to Licensee.
                        Licensee may send the Composition file to any individual musician, engineer, studio manager, or other person who is working on the Master Recording.
                    </Text>

                    <Text style={styles.sectionTitle}>Ownership</Text>
                    <Text style={styles.text}>
                        The Licensor is and shall remain the sole owner and holder of all right, title, and interest in the Composition, including all copyrights to and in the sound recording and the underlying musical compositions written and composed by Licensor.
                    </Text>

                    <Text style={styles.sectionTitle}>Writer's Share and Publishing Rights</Text>
                    <Text style={styles.text}>
                        With respect to the publishing rights and ownership of the underlying Composition embodied in the Master Recording, the Licensee and the Licensor hereby acknowledge and agree that it shall be owned/split between them as follows:
                        Licensor shall own and control 50% of the so-called "Writer's Share" of the underlying Composition.
                        Licensor shall own, control, and administer 50% of the so-called "Publisher's Share" of the underlying Composition embodied in the Master Recording.
                    </Text>

                    <Text style={styles.sectionTitle}>Governing Law</Text>
                    <Text style={styles.text}>
                        This License is governed by and shall be construed under the law of India, without regard to the conflicts of laws principles thereof.
                    </Text>
                </View>
            </Page>
        </Document>
    );
    const LicenseDocumentMp3 = ({ }) => (

        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>DURSH: MP3 License</Text>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>License Agreement</Text>
                    <View style={styles.line} />

                    <Text style={styles.text}>
                        THIS LICENCE AGREEMENT is made on {getStructuredDate(data.date)} ("Effective Date") by and between {userData.legalName}, professionally known as {userData.artistName} and living at {userData.streetAddress}, {userData.state},  {userData.country} (hereinafter referred to as the "Licensee") and Durgesh Gurjar, professionally known as DURSH and living at 97/A, Pandit Dindayal Upadhyay Nagar, Sukhliya, Indore, India (hereinafter referred to as the "Licensor").
                        Licensor warrants that it controls the mechanical rights in and to the copyrighted musical works entitled {data.title} ("Composition") as of and prior to the date first written above.
                        The Composition, including the music thereof, was composed by Durgesh Gurjar ("Songwriter") managed under the Licensor.

                    </Text>
                    <Text style={styles.sectionTitle}>Master Use</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee a non-exclusive license (this "License") to record vocal synchronization to the Composition partly or in its entirety and substantially in its original form ("Master Recording").

                    </Text>
                    <Text style={styles.sectionTitle}>Distribution Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee a non-exclusive license to use the Master Recording in the reproduction, duplication, manufacture, and distribution of phonograph records, cassette tapes, compact disk, digital downloads, other miscellaneous audio and digital recordings, and any lifts and versions thereof (collectively, the "Recordings", and individually, a "Recording") worldwide for the pressing or selling a total of 5000 copies of such Recordings or any combination of such Recordings.

                    </Text>

                    <Text style={styles.sectionTitle}>Streaming Rights</Text>
                    <Text style={styles.text}>
                        Additionally, licensee shall be permitted to distribute unlimited free internet downloads or streams for non-profit and non-commercial use. This license allows 100000 monetized audio streams to sites like Spotify or Apple Music.

                    </Text>


                    <Text style={styles.sectionTitle}>Synchronization Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants limited synchronization rights for 1 monetized music video streamed online (YouTube, Vimeo, etc..) for 100000 streams in total on all websites. A separate synchronization license will need to be purchased for distribution of video to Television, Film or Video game.

                    </Text>
                    <Text style={styles.sectionTitle}>Performance Rights</Text>
                    <Text style={styles.text}>
                        The Licensor here by grants to Licensee a non-exclusive license to use the Master Recording in unlimited non-profit performances, shows, or concerts.
                        Licensee may not receive compensation from performances with this license.

                    </Text>
                    <Text style={styles.sectionTitle}>Broadcast Rights</Text>
                    <Text style={styles.text}>
                        The Licensor hereby grants to Licensee broadcasting rights for 1 radio stations.

                    </Text>
                    <Text style={styles.sectionTitle}>Credit</Text>
                    <Text style={styles.text}>
                        Licensee shall acknowledge the original authorship of the Composition appropriately and reasonably in all media and performance formats under the name "DURSH" in writing where possible and vocally otherwise.

                    </Text>
                    <Text style={styles.sectionTitle}> Consideration</Text>
                    <Text style={styles.text}>
                        In consideration for the rights granted under this agreement, Licensee shall pay to licensor the sum of {data.selectedLicense.price} Indian Rupee and other good and valuable consideration, payable to Durgesh Gurjar, receipt of which is hereby acknowledged. If the Licensee fails to account to the Licensor, timely complete the payments provided for hereunder, or perform its other obligations hereunder, including having insufficient bank balance, the licensor shall have the right to terminate License upon written notice to the Licensee.
                        Such termination shall render the recording, manufacture and/or distribution of Recordings for which monies have not been paid subject to and actionable infringements under applicable law, including, without limitation, the Indian Copyright Act, as amended.

                    </Text>
                    <Text style={styles.sectionTitle}>Delivery</Text>
                    <Text style={styles.text}>
                        The Composition shall be delivered as high quality MP3 File, as such terms are understood in the music industry, via email to an email address that Licensee provided to Licensor.
                        Licensee shall receive an email from containing an attachment or link from which they can download the Composition.

                    </Text>
                    <Text style={styles.sectionTitle}>Term</Text>
                    <Text style={styles.text}>
                        The Term of this Agreement shall be 1 years and this license shall expire on the 1 year anniversary of the Effective Date.

                    </Text>
                    <Text style={styles.sectionTitle}>Audio Samples</Text>
                    <Text style={styles.text}>
                        3rd party sample clearance is the responsibility of the Licensee.

                    </Text>
                    <Text style={styles.sectionTitle}>Restrictions</Text>
                    <Text style={styles.text}>
                        The rights granted to Licensee are NON-TRANSFERABLE and that Licensee may not transfer or assign any of its rights hereunder to any third-party. This restriction includes, but is not limited to, use of the Composition and/or Master Recording in television, commercials, film/movies, theatrical works, video games, and in any other form on the Internet which is not expressly permitted herein. Licensee shall not have the right to license or sublicense any use of the Composition or of the Master Recording, in whole or in part, for any so-called "samples".
                        Licensee shall not engage in any unlawful copying, streaming, duplicating, selling, lending, renting, hiring, broadcasting, uploading, or downloading to any database, servers, computers, peer to peer sharing, or other file sharing services, posting on websites, or distribution of the Composition in the form, or a substantially similar form, as delivered to Licensee.
                        Licensee may send the Composition file to any individual musician, engineer, studio manager or other person who is working on the Master Recording.

                    </Text>
                    <Text style={styles.sectionTitle}>Ownership</Text>
                    <Text style={styles.text}>
                        The Licensor is and shall remain the sole owner and holder of all right, title, and interest in the Composition, including all copyrights to and in the sound recording and the underlying musical compositions written and composed by Licensor.
                    </Text>

                    <Text style={styles.sectionTitle}>Writer's Share and Publishing Rights</Text>
                    <Text style={styles.text}>
                        With respect to the publishing rights and ownership of the underlying Composition embodied in the Master Recording, the Licensee and the Licensor hereby acknowledge and agree that it shall be owned/split between them as follows: Licensor shall own and control 50% of the so-called "Writer's Share" of the underlying Composition. Licensor shall own, control, and administer 50% of the so-called "Publisher's Share" of the underlying Composition embodied in the Master Recording.
                    </Text>
                    <Text style={styles.sectionTitle}>Governing Law</Text>
                    <Text style={styles.text}>
                        This License is governed by and shall be construed under the law of India, without regard to the conflicts of laws principles thereof.

                    </Text>

                    {/* <Image src="https://t.auntmia.com/nthumbs/2020-01-06/4887348/4887348_15.jpg" style={{ width: '100%', marginBottom: 10 }} /> */}
                </View>
            </Page>
        </Document>
    );
    const [songdataformail, setsongdataformail] = useState(null);

    const [userkijankari, setuserkijankari] = useState(null);
    const handleSubmit = async () => {
        console.log('submitting');
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getuser`, { params: { email: userid.email } });
            setuserkijankari(response.data);
        } catch (error) {
            console.log(error);
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetchsong`, { params: { songid: data.id } });
            setsongdataformail(response.data);

        } catch (error) {
            console.log(error);
        }
        try {
            let pdfDoc;
            let pdfBlob;
            let formData = new FormData();
            console.log('userid', userid);
            const licenseType = data.selectedLicense.name;
            const songa = songdataformail.title;
            const recipientEmails = userid.email;

            formData.append('to', recipientEmails);
            formData.append('subject', `Music License - ${licenseType}`);

            // Email base template
            const emailText = `
                Hey ${userkijankari.artistName},
    
                Thank you for your purchase from DURSH Beats!
    
                Your beat files are ready to download. Please find your license agreement and files attached to this email.
    
                Note: When releasing your project, please credit “Produced by DURSH”.
    
                If you have any questions, just reply to this email. Happy creating!
    
                Enjoy,
                DURSH
            `;

            // Append plain text content
            formData.append('text', emailText);

            // Base HTML content with styling
            let emailHtml = `
                <div style="font-family: Arial, sans-serif; color: black; line-height: 1.6;">
                    <h2 style="color: #4CAF50; border-bottom: 1px solid #4CAF50; padding-bottom: 10px;">Thank you for your purchase!</h2>
                    <p style="font-size: 16px; color: black;">Hey ${userkijankari.artistName},</p>
                    <p style="font-size: 16px; color: black;">Thank you for your purchase from DURSH Beats! Your beat files are ready to download. Please find your <strong>${licenseType}</strong>  agreement for the <strong> ${songa} </strong>attached to this email.</p>
                    <p style="font-size: 16px; color: black;">You can also download your Files by clicking the buttons below.</p>
                    
                </div>
            `;

            // License-specific attachments and download links with styled buttons
            if (licenseType === "MP3 License") {
                pdfDoc = <LicenseDocumentMp3 />;
                pdfBlob = await pdf(pdfDoc).toBlob();

                emailHtml += `
                    <div style="margin-top: 20px;">
                        <a href="${songdataformail.mp3Url}" download="your_file.mp3" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin: 5px 0;">Download MP3 File</a>
                    </div>
                `;
                formData.append('attachment', pdfBlob, 'license_agreement_MP3.pdf');

            } else if (licenseType === "WAV License") {
                pdfDoc = <LicenseDocumentWav />;
                pdfBlob = await pdf(pdfDoc).toBlob();

                emailHtml += `
                    <div style="margin-top: 20px;">
                        <a href="${songdataformail.mp3Url}" download="your_file.mp3" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin: 5px 0;">Download MP3 File</a>
                        <a href="${songdataformail.wavFile}" download="your_file.wav" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin: 5px 0;">Download WAV File</a>
                    </div>
                `;
                formData.append('attachment', pdfBlob, 'license_agreement_WAV.pdf');

            } else if (licenseType === "Trackouts License") {
                pdfDoc = <LicenseDocumentTracout />;
                pdfBlob = await pdf(pdfDoc).toBlob();

                emailHtml += `
                    <div style="margin-top: 20px;">
                        <a href="${songdataformail.mp3Url}" download="your_file.mp3" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin: 5px 0;">Download MP3 File</a>
                        <a href="${songdataformail.wavFile}" download="your_file.wav" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin: 5px 0;">Download WAV File</a>
                        <a href="${songdataformail.zipFile}" download="your_file.zip" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin: 5px 0;">Download Trackout Zip File</a>
                    </div>
                `;
                formData.append('attachment', pdfBlob, 'license_agreement_TRACKOUT.pdf');
            }
            emailHtml += `<p style="font-size: 16px; color: black;">Note: When releasing your project, please credit “Produced by DURSH”.</p>
                    <p style="font-size: 16px; color: black;">If you have any questions, just reply to this email. Happy creating!</p>
                    <p style="font-size: 16px; color: black;"><strong>Enjoy,</strong></p>
                    <p style="font-size: 16px; color: black;"><strong>DURSH</strong></p>`
            // Append the HTML content
            formData.append('html', emailHtml);

            // Send the email
            const emailResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send_email`, {
                method: 'POST',
                body: formData,
            });

            if (!emailResponse.ok) {
                console.log('Email sending failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const DownloadLicence = () => {
        if (data.selectedLicense.name === "MP3 License") {
            return <LicenseDocumentMp3></LicenseDocumentMp3>
        } else if (data.selectedLicense.name === "WAV License") {
            return <LicenseDocumentWav></LicenseDocumentWav>
        } else if (data.selectedLicense.name === "Trackouts License") {
            return <LicenseDocumentTracout></LicenseDocumentTracout>
        }
    }
    return (
        <div style={{ padding: '20px' }}>
            <PDFDownloadLink
                document={DownloadLicence()}
                fileName="license_agreement.pdf"
                style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'background-color 0.3s, transform 0.2s',
                    display: 'inline-block',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'green')}
            >
                {({ loading }) => (loading ? 'Generating...' : 'Download License')}
            </PDFDownloadLink>
            <button className='btn' onClick={handleSubmit}>click me</button>
            <button
                onClick={handleSubmit}
                style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'background-color 0.3s, transform 0.2s',
                    display: 'inline-block',
                }}
            >
                Send Email with License
            </button>
        </div>
    );
};

export default LicenseGenerator;
