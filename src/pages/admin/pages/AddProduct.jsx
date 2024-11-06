import React, { useContext, useState } from 'react'
import MyContext from '../../../context/data/myContext'
import { uploadMusicFile, addMusicTrack } from '../../../firebase/musicUploadwithdata'
import { toast } from 'react-toastify';
import { DNA, Triangle } from 'react-loader-spinner'

function AddProduct() {
    const context = useContext(MyContext);
    const { products, getProductData, setproducts, addProduct } = context;
    const [isloading, setisloading] = useState(false);
    const [mp3File, setMp3File] = useState(null);
    const [wavFile, setWavFile] = useState(null);
    const [mp3Url, setmp3Url] = useState(null);
    const [coverUrl, setCoverUrl] = useState(null);
    const [zipFile, setZipFile] = useState(null);
    const [imageUrl, setimageUrl] = useState(null);
    const [title, setTitle] = useState('qqw');
    const [key, setKey] = useState('sdf')
    const [genre, setGenre] = useState('asdaf');
    const [releaseDate, setReleaseDate] = useState('');
    const [time, setTime] = useState('12');
    const [bpm, setBPM] = useState('12');

    const [licenses, setLicenses] = useState([
        { name: 'MP3 License', price: '21' },
        { name: 'WAV License', price: '23' },
        { name: 'Trackouts License', price: '43' },
    ]);

    const handleMp3Change = (e) => {
        setMp3File(e.target.files[0]);
    };

    // const handleWavChange = (e) => {
    //     setWavFile(e.target.files[0]);
    // };

    // const handleZipChange = (e) => {
    //     setZipFile(e.target.files[0]);
    // };

    const handleCoverImageChange = (e) => {
        setimageUrl(e.target.files[0]);
    };

    const handleLicenseChange = (index, field, value) => {
        setLicenses((prevLicenses) => {
            const updatedLicenses = [...prevLicenses];
            updatedLicenses[index][field] = value;
            return updatedLicenses;
        });
    };

    const handleUpload = async () => {
        if (!mp3File || !wavFile || !zipFile || !imageUrl || licenses.some((license) => !license.price)) {
            console.log("mp3 filr ", mp3File, "wav file ", wavFile, "zip file ", zipFile, "image url ", imageUrl)
            toast.error('Please fill out all required fields.');
            return;
        }

        try {
            // Upload the music files and cover image
            setisloading(true);
            const mp3Files = await uploadMusicFile(mp3File);
            // const wavFiles = await uploadMusicFile(wavFile);
            // const zipFiles = await uploadMusicFile(zipFile);
            const coverImages = await uploadMusicFile(imageUrl);

            // Prepare the track metadata
            const track = {
                title,
                genre,
                key,
                releaseDate: new Date(releaseDate).toISOString(),
                image: coverImages,
                mp3File: mp3Files,
                wavFile,
                coverUrl,
                mp3Url,
                zipFile,
                time,
                bpm: parseInt(bpm),
                licenses: licenses.map((license) => ({
                    name: license.name,
                    price: parseFloat(license.price),
                })),
                createdAt: new Date().toISOString(),
            };

            // Store metadata in Firestore
            await addMusicTrack(track);


            // Clear the form
            // setMp3File(null);
            // setWavFile(null);
            // setZipFile(null);
            // setimageUrl(null);
            // setTitle('');
            // setGenre('');
            // setKey('');
            // setReleaseDate('');
            // setTime('');
            // setBPM('');
            // setLicenses([
            //     { name: 'Silver', price: '' },
            //     { name: 'Gold', price: '' },
            //     { name: 'Platinum', price: '' },
            // ]);

            toast.success('🦄 Upload successful!');
            getProductData()
        } catch (error) {
            console.error('Error uploading music:', error);
            toast.error('Error uploading music.');
        } finally {
            setisloading(false);
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold mb-4">Upload Music</h1>
                <form className="space-y-4">
                    <label className="mt-2 block text-sm font-medium text-gray-700">Select MP3:</label>
                    <input
                        type="file"
                        accept=".mp3"
                        onChange={handleMp3Change}
                        className="block w-full text-sm text-gray-700 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-offset-2"
                    />
                    <label className="mt-2 block text-sm font-medium text-gray-700">Cover Gdrive</label>
                    <input
                        type="text"
                        placeholder="Wav Link"
                        value={coverUrl}
                        onChange={(e) => setCoverUrl(e.target.value)}
                        className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <label className="mt-2 block text-sm font-medium text-gray-700">MP3 Gdrive</label>
                    <input
                        type="text"
                        placeholder="Wav Link"
                        value={mp3Url}
                        onChange={(e) => setmp3Url(e.target.value)}
                        className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <label className="mt-2 block text-sm font-medium text-gray-700">Wav Gdrive</label>
                    <input
                        type="text"
                        placeholder="Wav Link"
                        value={wavFile}
                        onChange={(e) => setWavFile(e.target.value)}
                        className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />


                    {/* <input
                        type="file"
                        accept=".mp3"
                        onChange={handleWavChange}
                        className="block w-full text-sm text-gray-700 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-offset-2"
                    /> */}
                    <label className="mt-2 block text-sm font-medium text-gray-700">Zip Gdrive</label>
                    {/* <input
                        type="file"
                        accept=".zip"
                        onChange={handleZipChange}
                        className="block w-full text-sm text-gray-700 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-offset-2"
                    /> */}
                    <input
                        type="text"
                        placeholder="Zip file"
                        value={zipFile}
                        onChange={(e) => setZipFile(e.target.value)}
                        className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <label className="mt-2 block text-sm font-medium text-gray-700">Select Cover Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="block w-full text-sm text-gray-700 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-offset-2"
                    />
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <input
                        type="text"
                        placeholder="key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="text"
                        placeholder="Genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="date"
                        placeholder="Release Date"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />


                    <input
                        type="text"
                        placeholder="Time (MM:SS)"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="number"
                        placeholder="BPM"
                        value={bpm}
                        onChange={(e) => setBPM(e.target.value)}
                        className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    {/* License inputs with prices only */}
                    {licenses.map((license, index) => (
                        <div key={index} className="mt-4">
                            <label className="font-medium text-gray-800">{license.name} License</label>
                            <input
                                type="number"
                                placeholder="Price"
                                value={license.price}
                                onChange={(e) => handleLicenseChange(index, 'price', e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                    ))}
                </form>
                {!isloading &&
                    <button
                        onClick={handleUpload}
                        className="mt-6 w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md focus:outline-none"
                    >
                        Upload
                    </button>
                }
                {isloading && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Triangle
                            visible={true}
                            height="80"
                            width="80"
                            color="#4fa94d"
                            ariaLabel="triangle-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default AddProduct;