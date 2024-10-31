import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SparklesText from "../ui/sparkles-text.tsx";
import HyperText from "../ui/hyper-text";
import myContext from '../../context/data/myContext';
import { AiFillYoutube, AiFillInstagram, AiFillFacebook, AiFillSpotify } from "react-icons/ai";

export default function Footer() {
    const context = useContext(myContext);
    const { mode } = context;
    const year = new Date().getFullYear();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <footer

        >
            <div className="container mx-auto px-5 flex flex-col md:flex-row items-center justify-between">
                <Link to="/" className="flex items-center mb-4 md:mb-0">
                    <SparklesText size={30} text="DURSH" />
                </Link>
                <div className="text-center mb-4 md:mb-0">
                    <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Made with ❤️ by <a href="#" className="hover:text-indigo-500">
                            <HyperText className="text-3xl font-bold text-black dark:text-white" text="LAVISH GEHLOD" />
                        </a>
                    </p>
                    <p className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Exploring Creativity and Innovation · © {year}
                    </p>
                </div>
                <div className="flex space-x-6">
                    <a
                        className="text-gray-400 hover:text-indigo-500 transition-transform duration-200 transform hover:scale-125 hover:shadow-lg"
                        aria-label="Facebook"
                        href="https://www.facebook.com/durshmusicindia"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <AiFillFacebook size="25" />
                    </a>
                    <a
                        className="text-gray-400 hover:text-indigo-500 transition-transform duration-200 transform hover:scale-125 hover:shadow-lg"
                        aria-label="Instagram"
                        href="https://www.instagram.com/durshmusic"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <AiFillInstagram size="25" />
                    </a>
                    <a
                        className="text-gray-400 hover:text-indigo-500 transition-transform duration-200 transform hover:scale-125 hover:shadow-lg"
                        aria-label="Spotify"
                        href="https://www.spotify.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <AiFillSpotify size="25" />
                    </a>
                    <a
                        className="text-gray-400 hover:text-indigo-500 transition-transform duration-200 transform hover:scale-125 hover:shadow-lg"
                        aria-label="YouTube"
                        href="https://www.youtube.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <AiFillYoutube size="25" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
