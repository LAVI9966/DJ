import React from 'react'
import Meteors from "../ui/meteors"

const Hero = () => {
    return (
        <div
            className="hero relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
        >
            {/* Meteor background effect */}
            <Meteors number={30} />

            <div className="text-center relative z-10"> {/* Ensure text is above the meteors */}
                <h1 className="text-4xl md:text-6xl font-bold text-white">Discover Music</h1>
                <p className="text-lg mt-4 text-white">Explore the world of melodies</p>
                <div className="mt-6 space-x-4">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
                        Listen Now
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                        Top Hits
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">
                        New Releases
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Hero
