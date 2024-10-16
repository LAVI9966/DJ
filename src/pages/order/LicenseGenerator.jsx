import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold', // Bold style for section titles
    },
    section: {
        marginBottom: 15,
    },
    text: {
        marginBottom: 10,
    },
    footer: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 'auto',
        color: 'grey',
    },
});

// PDF component that structures the license document
const LicenseDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text >DURSH: Premium License</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>License Agreement</Text>
                <Text style={styles.text}>
                    THIS LICENCE AGREEMENT is made on {new Date().toLocaleDateString()} ("Effective Date") by and between "Legal name",
                    professionally known as "Stage name" and living at "Address", "Country" (hereinafter referred to as the "Licensee") and
                    Durgesh Gurjar, professionally known as DURSH and living at Indore, India (hereinafter referred to as the "Licensor").
                </Text>
                <Text style={styles.text}>
                    Licensor warrants that it controls the mechanical rights in and to the copyrighted musical works entitled Khwab Dekhe
                    ("Composition") as of and prior to the date first written above.
                </Text>
                <Text style={styles.text}>
                    The Composition, including the music thereof, was composed by Durgesh Gurjar ("Songwriter") managed under the
                    Licensor.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Master Use</Text>
                <Text style={styles.text}>
                    The Licensor hereby grants to Licensee a non-exclusive license (this "License") to record vocal synchronization to the
                    Composition partly or in its entirety and substantially in its original form ("Master Recording").
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Distribution Rights</Text>
                <Text style={styles.text}>
                    The Licensor hereby grants to Licensee a non-exclusive license to use the Master Recording in the reproduction,
                    duplication, manufacture, and distribution of phonograph records, cassette tapes, compact disks, digital downloads, and
                    other miscellaneous audio and digital recordings.
                </Text>
                <Text style={styles.text}>
                    This license allows for the pressing or selling a total of 10,000 copies of such Recordings or any combination of such
                    Recordings.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Streaming Rights</Text>
                <Text style={styles.text}>
                    Additionally, the Licensee shall be permitted to distribute unlimited free internet downloads or streams for non-profit
                    and non-commercial use. This license allows 500,000 monetized audio streams to sites like Spotify or Apple Music.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Synchronization Rights</Text>
                <Text style={styles.text}>
                    The Licensor hereby grants limited synchronization rights for 1 monetized music video streamed online (YouTube,
                    Vimeo, etc.) for 500,000 streams in total on all websites.
                </Text>
                <Text style={styles.text}>
                    A separate synchronization license will need to be purchased for distribution of video to Television, Film, or Video
                    game.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Performance Rights</Text>
                <Text style={styles.text}>
                    The Licensor hereby grants to Licensee a non-exclusive license to use the Master Recording in unlimited non-profit
                    performances, shows, or concerts. Licensee may receive compensation from performances with this license.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Broadcast Rights</Text>
                <Text style={styles.text}>
                    The Licensor hereby grants to Licensee broadcasting rights for 2 radio stations.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Credit</Text>
                <Text style={styles.text}>
                    Licensee shall acknowledge the original authorship of the Composition appropriately and reasonably in all media and
                    performance formats under the name "DURSH" in writing where possible and vocally otherwise.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Consideration</Text>
                <Text style={styles.text}>
                    In consideration for the rights granted under this agreement, Licensee shall pay to Licensor the sum of 100.00 US
                    dollars and other good and valuable consideration, payable to Durgesh Gurjar, receipt of which is hereby acknowledged.
                </Text>
                <Text style={styles.text}>
                    If the Licensee fails to account to the Licensor, timely complete the payments provided for hereunder, or perform its
                    other obligations hereunder, including having insufficient bank balance, the Licensor shall have the right to terminate
                    License upon written notice to the Licensee.
                </Text>
            </View>

            <Text style={styles.footer}>
                This license is governed by the law of India.
            </Text>
        </Page>
    </Document>
);

// Main component to handle user input and generate the PDF
const LicenseGenerator = () => {
    return (
        <div style={{ padding: '20px' }}>
            {/* <h2>Generate License</h2> */}

            <PDFDownloadLink
                document={<LicenseDocument />}
                fileName="license_agreement.pdf"
                style={{
                    marginTop: '20px',
                    padding: '12px 24px', // Increased padding for better click area
                    backgroundColor: 'green', // Bootstrap primary color
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '16px', // Larger font for better readability
                    transition: 'background-color 0.3s, transform 0.2s', // Transition for hover effect
                    display: 'inline-block', // Inline block for proper spacing
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')} // Darker shade on hover
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'green')} // Reset color on leave
            >
                {({ blob, url, loading, error }) =>
                    loading ? 'Generating...' : 'Download License'
                }
            </PDFDownloadLink>
        </div>
    );
};


export default LicenseGenerator;
