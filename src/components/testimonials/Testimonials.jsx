import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';
import { useTheme } from 'next-themes';
import { MagicCard } from '../../components/ui/magic-card';
import { BorderBeam } from "../../components/ui/border-beam";

function Testimonial() {
    const context = useContext(myContext);
    const { mode } = context;
    const { theme } = useTheme();

    return (
        <div>
            <section className="text-gray-600 body-font mb-10">
                <div className="container px-5 py-10 mx-auto">
                    <h1 className="text-center text-4xl md:text-5xl font-bold" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        Buy beats simple, safe and secure
                    </h1>
                    <div className="flex flex-wrap justify-center mt-8">
                        {['Select Beats', 'Checkout', 'Check Inbox'].map((title, index) => (
                            <div key={index} className="p-3 md:w-1/3 sm:w-1/2 w-full">
                                <MagicCard
                                    className="cursor-pointer flex flex-col items-center justify-center shadow-2xl mx-6 my-4 p-6 h-full w-full"
                                    gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
                                >
                                    <h2 className="title-font font-medium text-lg md:text-xl text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{title}</h2>
                                    <p className="leading-relaxed text-sm md:text-base">
                                        {index === 0 && "Select the beats you want and choose a license. Don't forget to take advantage of any active bulk deals or discounts!"}
                                        {index === 1 && "Proceed to Checkout by clicking the cart button at the player's top right."}
                                        {index === 2 && "Check your inbox shortly for an email with download links to your HQ audio files, license agreement(s), and stream(i/a)."}
                                    </p>
                                </MagicCard>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Testimonial;
