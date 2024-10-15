import React, { useContext, useState } from 'react'
import MyContext from '../../../context/data/myContext'
import { uploadMusicFile, addMusicTrack } from '../../../firebase/musicUploadwithdata'
import { toast } from 'react-toastify';
function AddProduct() {
    const context = useContext(MyContext);
    const { products, setproducts, addProduct } = context;

    const [file, setFile] = useState(null);
    const [imageUrl, setimageUrl] = useState(null);
    const [title, setTitle] = useState('song1');
    const [artist, setArtist] = useState('jj');
    const [album, setAlbum] = useState('hb');
    const [genre, setGenre] = useState('hbh');
    const [releaseDate, setReleaseDate] = useState('n ');
    const [description, setDescription] = useState('kn');
    const [category, setcategory] = useState('kn');
    const [time, setTime] = useState('12:65');
    const [bpm, setBPM] = useState('4664');

    const [licenses, setLicenses] = useState([
        { name: 'Silver', file: null, price: '5' },
        { name: 'Gold', file: null, price: '6' },
        { name: 'Platinum', file: null, price: '6' },
    ]);


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

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
        if (!file || !imageUrl || licenses.some((license) => !license.file || !license.price)) {
            toast.error('Please fill out all required fields.');
            return;
        }

        try {
            // Upload the main file and cover image
            const fileURL = await uploadMusicFile(file);
            const coverImageUrl = await uploadMusicFile(imageUrl);

            // Upload license files and gather their URLs with names
            const licenseData = await Promise.all(
                licenses.map(async (license) => {
                    const licenseUrl = await uploadMusicFile(license.file);
                    return {
                        name: license.name, // Save the license name
                        price: parseFloat(license.price),
                        licenseUrl,
                    };
                })
            );

            // Prepare the track metadata
            const track = {
                title,
                artist,
                album,
                genre,
                releaseDate: new Date(releaseDate).toISOString(),
                imageUrl: coverImageUrl,
                fileUrl: fileURL,
                description,
                category,
                time,
                bpm: parseInt(bpm),
                licenses: licenseData, // Save license data including names
                createdAt: new Date().toISOString(),
            };

            // Store metadata in Firestore
            await addMusicTrack(track);

            // Clear the form
            setFile(null);
            setimageUrl(null);
            setTitle('');
            setArtist('');
            setAlbum('');
            setGenre('');
            setReleaseDate('');
            setDescription('');
            setcategory('');
            setTime('');
            setBPM('');
            setLicenses([
                { name: 'Silver', file: null, price: '' },
                { name: 'Gold', file: null, price: '' },
                { name: 'Platinum', file: null, price: '' },
            ]);

            toast.success('🦄 Upload successful!');
        } catch (error) {
            console.error('Error uploading music:', error);
            toast.error('Error uploading music.');
        }
    };
    return (
        <>            <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-4">Upload Music</h1>
            <form className="space-y-4">
                <label className="mt-2 block text-sm font-medium text-gray-700">Select Music:</label>
                <input
                    type="file"
                    accept=".mp3,.wav,.ogg"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-700 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-offset-2"
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
                    placeholder="Artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full px-3 py-2 text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                    type="text"
                    placeholder="Album"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
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
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 resize-none min-h-[120px] text-base text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                    type="text"
                    placeholder="category"
                    value={category}
                    onChange={(e) => setcategory(e.target.value)}
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

                {/* License inputs with names */}
                {licenses.map((license, index) => (
                    <div key={index} className="mt-4">
                        <label className="font-medium text-gray-800">{license.name} License</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleLicenseChange(index, 'file', e.target.files[0])}
                            className="block w-full text-sm text-gray-700 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-offset-2"
                        />
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
            <button
                onClick={handleUpload}
                className="mt-6 w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md focus:outline-none"
            >
                Upload
            </button>
        </div></>
    );
}

export default AddProduct