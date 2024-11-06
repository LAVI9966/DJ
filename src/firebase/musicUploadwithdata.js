import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';
import { fireDB } from './firebaseconfig';
import axios from 'axios';
export const uploadMusicFile = async (file) => {
    try {
        if (!file) {
            throw new Error("No file provided.");
        }

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "oqqpsascs5tst"); // Your preset name
        data.append("cloud_name", "dxvhzvf5j");      // Replace with your cloud name

        const res = await fetch("https://api.cloudinary.com/v1_1/dxvhzvf5j/raw/upload", {
            method: "POST",
            body: data,
        });

        const uploadResponse = await res.json();
        if (!res.ok) {
            throw new Error(uploadResponse.error.message);
        }

        console.log("Uploaded File URL:", uploadResponse);
        return { url: uploadResponse.url, publicId: uploadResponse.public_id };
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

export const addMusicTrack = async (track) => {
    try {
        // const docRef = await addDoc(collection(fireDB, 'products'), track);
        // console.log('Document written with ID ', docRef.id);

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/addproduct`, track);
        console.log(response);
        return response;
    } catch (error) {
        console.log('Error adding document', error)
    }
}