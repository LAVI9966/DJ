import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MyContext from '../../context/data/myContext';
import { toast } from "react-toastify"
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup
} from 'firebase/auth';
import { auth, fireDB } from '../../firebase/firebaseconfig';
import { addDoc, collection, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { DNA, Triangle } from 'react-loader-spinner'
function Signup() {
    console.log(auth)
    const [isloading, setisloading] = useState(false);
    const [name, setNamae] = useState("");
    const [artistName, setArtistName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const context = useContext(MyContext);
    const { loading, setLoading } = context;
    const handleKey = (event) => {
        if (event.key == "Enter")
            signup();
    }
    const signup = async () => {
        if (name === "" || email === "" || password === "") {
            return toast.error("All Field are Required")
        }

        try {
            setisloading(true);
            const users = await createUserWithEmailAndPassword(auth, email, password);
            console.log(users)

            const user = {
                name: name,
                artistName: artistName,
                uid: users.user.uid,
                email: users.user.email,
                time: Timestamp.now()

            }

            const userRef = collection(fireDB, "users");
            await addDoc(userRef, user);
            setNamae("");
            setEmail("");
            setPassword("");
            console.log('yes')
            localStorage.setItem('user', JSON.stringify(users))
            console.log(user);
            navigate('/')
        } catch (error) {
            console.error(error);
            // Error Toasts for Different Scenarios
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error("Popup closed before completing sign-in.");
            } else if (error.code === 'auth/network-request-failed') {
                toast.error("Network error. Please check your connection.");
            } else if (error.code === 'auth/email-already-in-use') {
                toast.error("Email is already associated with another account.");
            } else if (error.message.includes('setDoc')) {
                toast.error("Failed to save user data to Firestore.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setisloading(false);
        }
    }
    const provider = new GoogleAuthProvider();
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("User Info", result.user);
            console.log("User Info", result.user.displayName);
            const userDocRef = doc(fireDB, "users", result.user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                const user = {
                    name: result.user.displayName,
                    uid: result.user.uid,
                    email: result.user.email,
                    time: Timestamp.now()
                }
                const userRef = collection(fireDB, "users");
                await setDoc(userDocRef, user);
                console.log(user);
                toast.success("Sign Up Successfully");
                localStorage.setItem('user', JSON.stringify(result))
            } else {
                toast.success("Login Successfully");
                localStorage.setItem('user', JSON.stringify(result))
            }
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className=' flex justify-center items-center h-screen'>
            <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                <div className="">
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Signup</h1>
                </div>
                <div>
                    <input type="text"
                        name='name'
                        value={name}
                        onChange={(e) => setNamae(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Name'
                    />
                </div>
                <div>
                    <input type="text"
                        name='artistname'
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Artist Name'
                    />
                </div>
                <div>
                    <input type="email"
                        name='email'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Email'
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onKeyDown={handleKey}
                        onChange={(e) => { setPassword(e.target.value) }}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Password'
                    />
                </div>
                <div className=' flex justify-center mb-3'>
                    <button
                        onClick={signup}
                        className=' bg-red-500 w-full text-white font-bold  px-2 py-2 rounded-lg'>
                        Signup
                    </button>
                </div>
                <div>
                    <h2 className='text-white'>Have an account <Link className=' text-red-500 font-bold' to={'/login'}>Login</Link></h2>
                </div>
                <div className=' flex justify-center mb-3'>
                    <button
                        onClick={handleGoogleSignIn}
                        className=' bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg'>
                        Start With Goggle
                    </button>
                </div>
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
        </div>
    )
}

export default Signup