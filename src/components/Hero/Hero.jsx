import React, { useContext } from 'react'
import Meteors from "../ui/meteors"
import bgimg from './background.jpg'
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { AnimatedSubscribeButton } from "../ui/animated-subscribe-button";
import { RainbowButton } from "../ui/rainbow-button";
import { Link } from 'react-router-dom';
import MyContext from '../../context/data/myContext';
const Hero = () => {
    const context = useContext(MyContext);
    const { beatsref, contactref, scrollToSection } = context;
    return (
        <div
            className="hero relative min-h-screen flex flex-col items-center bg-center bg-cover justify-center overflow-hidden bg-black"
            style={{ backgroundImage: `url(${bgimg})` }}
        >
            {/* <img src={bgimg} /> */}
            {/* Meteor background effect */}
            <Meteors number={30} />



            <div className={`text-center relative z-10 bg-[url(${bgimg})] h-76 bg-cover bg-center flex flex-col justify-center items-center`}>
                <h1 className="text-4xl md:text-6xl font-bold text-white">DURSH BEATS</h1>
                <p className="text-lg mt-4 text-white">Discover and license industry standard beats</p>
                <div className="mt-6 space-x-4">
                    <a href='#songs'>
                        <RainbowButton onClick={() => scrollToSection(beatsref)}>Listen Beats</RainbowButton>
                    </a>                   <button onClick={() => scrollToSection(contactref)} className="border border-white text-white bg-transparent hover:bg-white hover:text-black active:bg-white active:text-black font-bold py-2 px-4 rounded-md transition duration-200">
                        Contact for work
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Hero
