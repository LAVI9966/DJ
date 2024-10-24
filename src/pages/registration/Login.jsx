import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup
} from 'firebase/auth';
import { DNA, Triangle } from 'react-loader-spinner'

GoogleAuthProvider, signInWithPopup
import { auth, fireDB } from '../../firebase/firebaseconfig';
import { addDoc, collection, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [isloading, setisloading] = useState(false);

    const navigate = useNavigate();
    const handleKey = (event) => {
        if (event.key == 'Enter')
            login();
    }
    const login = async () => {
        try {
            setisloading(true)
            const result = await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login Successful");
            localStorage.setItem('user', JSON.stringify(result));
            navigate('/');
        } catch (error) {
            console.log(error)
        } finally {
            setisloading(false)
        }
    }
    const provider = new GoogleAuthProvider();
    const handleGoogleSignIn = async () => {
        try {
            setisloading(true);

            const result = await signInWithPopup(auth, provider);
            console.log("User Info", result.user);

            const userDocRef = doc(fireDB, "users", result.user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                const user = {
                    name: result.user.displayName,
                    uid: result.user.uid,
                    email: result.user.email,
                    time: Timestamp.now(),
                };
                const userRef = collection(fireDB, "users");

                await setDoc(userDocRef, user);
                console.log(user);
                toast.success("Sign Up Successfully");
            } else {
                toast.success("Login Successfully");
            }

            localStorage.setItem('user', JSON.stringify(result));
            navigate('/');
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
    return (
        <div className=' flex justify-center items-center h-screen'>
            <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                <div className="">
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Login</h1>
                </div>
                <div>
                    <input type="email"
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Email'
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onKeyDown={handleKey}
                        onChange={(e) => setPassword(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Password'
                    />
                </div>
                <div className=' flex justify-center mb-3'>
                    <button onClick={login}
                        className=' bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg'>
                        Login
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
                <div>
                    <h2 className='text-white'>Don't have an account <Link className=' text-yellow-500 font-bold' to={'/signup'}>Signup</Link></h2>
                </div>
                <div className=' flex justify-center mb-3'>
                    <button
                        onClick={handleGoogleSignIn}
                        className=' bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg'>
                        Continue With Goggle
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login