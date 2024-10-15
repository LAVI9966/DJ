import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';
import { fireDB } from './firebaseconfig';
export const uploadMusicFile = async (file) => {
    try {
        const storageRef = ref(storage, `music/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.log('Error uploading file:', error);
        throw error
    }
};

export const addMusicTrack = async (track) => {
    try {
        const docRef = await addDoc(collection(fireDB, 'products'), track);
        console.log('Document written with ID ', docRef.id);
    } catch (error) {
        console.log('Error adding document', error)
    }
}