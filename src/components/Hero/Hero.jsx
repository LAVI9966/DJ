import React from 'react'
import bgimg from '../IMG/Pc.jpg'


const Hero = () => {
    return (
        <div className="flex flex-col items-center justify-center  bg-no-repeat bg-cover min-w-full p-4" style={{ backgroundImage: `url(${bgimg})`, height: "90vh" }}>

        </div>
    )
}

export default Hero