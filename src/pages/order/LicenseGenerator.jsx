import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, Document, Line, Image, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from "../../firebase/firebaseconfig"
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

const LicenseDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>DURSH: Premium License</Text>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>License Agreement</Text>
                <View style={styles.line} />

                <Text style={styles.text}>
                    THIS LICENCE AGREEMENT is made on "DAY DATE YEAR" ("Effective Date") by and between "LEGAL NAME", professionally known as "STAGE NAME" and living at "ADDRESS", "COUNTRY" (hereinafter referred to as the "Licensee") and Durgesh Gurjar, professionally known as DURSH and living at 97/A, Pandit Dindayal Upadhyay Nagar, Sukhliya, Indore, India (hereinafter referred to as the "Licensor").
                    Licensor warrants that it controls the mechanical rights in and to the copyrighted musical works entitled "BEAT NAME" ("Composition") as of and prior to the date first written above.
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
                    In consideration for the rights granted under this agreement, Licensee shall pay to licensor the sum of "PRIZE" Indian Rupee and other good and valuable consideration, payable to Durgesh Gurjar, receipt of which is hereby acknowledged. If the Licensee fails to account to the Licensor, timely complete the payments provided for hereunder, or perform its other obligations hereunder, including having insufficient bank balance, the licensor shall have the right to terminate License upon written notice to the Licensee.
                    Such termination shall render the recording, manufacture and/or distribution of Recordings for which monies have not been paid subject to and actionable infringements under applicable law, including, without limitation, the United States Copyright Act, as amended.

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

const LicenseGenerator = () => {

    const handleSubmit = async () => {
        try {
            const pdfDoc = <LicenseDocument />;
            const pdfBlob = await pdf(pdfDoc).toBlob(); // Generate PDF Blob

            const formData = new FormData();
            formData.append('to', 'durshbeats@gmail.com');
            formData.append('subject', 'Hello, Product Information');
            formData.append('text', 'hahahahhahahahahahahhahahahhahahahahhahhahahahahahhahah');
            formData.append('html', `<h1>Mail Agya <h1>`);
            formData.append('attachment', pdfBlob, 'license_agreement.pdf');

            const response = await fetch('http://localhost:3000/send_email', {
                method: 'POST',
                body: formData,
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
        <div style={{ padding: '20px' }}>
            <PDFDownloadLink
                document={<LicenseDocument />}
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

            <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-900 py-2 px-4 rounded"
            >
                Send Email with License
            </button>
        </div>
    );
};

export default LicenseGenerator;
