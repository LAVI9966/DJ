import React, { useContext } from 'react';
import MyContext from '../../context/data/myContext';

const PricingPage = () => {
    const plans = [
        {
            title: 'MP3 License',
            price: '$19.99',
            features: [
                'MP3 File',
                '100,000 Audio Streams',
                'Distribute up to 5,000 copies',
                '1 Music Video',
                '1 Year Validity'
            ],
            buttonText: 'Read License',
            popular: false
        },
        {
            title: 'WAV License',
            price: '$49.99',
            features: [
                'High Quality MP3 + WAV File',
                '1,000,000 Audio Streams',
                'Distribute up to 100,000 copies',
                '5 Music Videos',
                '10 Years Validity'
            ],
            buttonText: 'Read License',
            popular: true
        },
        {
            title: 'Trackouts License',
            price: '$99.99',
            features: [
                'MP3 + WAV File + Trackouts',
                'Unlimited Audio Streams',
                'Distribute Unlimited copies',
                'Unlimited Music Videos',
                'Unlimited Years Validity'
            ],
            buttonText: 'Read License',
            popular: false
        }
    ];

    const context = useContext(MyContext);
    const { licensingref, contactref, scrollToSection } = context;

    return (
        <div ref={licensingref} className="min-h-screen bg-[#111111] py-20 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                    Choose Your License
                </h1>
                <p className="text-lg text-gray-400">
                    Select the perfect licensing option for your music project
                </p>
            </div>

            {/* Plans Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`relative rounded-3xl ${plan.popular
                            ? 'bg-gradient-to-b from-blue-900/40 to-blue-900/20'
                            : 'bg-gray-900/40'
                            } backdrop-blur-sm border border-gray-700 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl`}
                    >
                        {/* Popular Badge */}
                        {plan.popular && (
                            <div className="absolute -top-5 inset-x-0 flex justify-center">
                                <span className="inline-flex px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold">
                                    Popular Choice
                                </span>
                            </div>
                        )}

                        {/* Plan Content */}
                        <div className="p-8">
                            {/* Plan Header */}
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-4">{plan.title}</h3>
                                <div className="flex justify-center items-baseline">
                                    <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                                </div>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-5 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-gray-300">
                                        <svg
                                            className={`w-5 h-5 ${plan.popular ? 'text-blue-400' : 'text-purple-400'
                                                } mr-3 flex-shrink-0`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Action Button */}
                            <button
                                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${plan.popular
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                                    : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:opacity-90'
                                    } shadow-lg`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Info */}
            <div className="max-w-3xl mx-auto mt-16 text-center">
                <p className="text-gray-400 text-sm">
                    All licenses include basic distribution rights and customer support.
                    <br />
                    For custom licensing options or questions, please{' '}
                    <a onClick={() => { scrollToSection(contactref) }} className="text-blue-400 hover:text-blue-300 underline">
                        contact us
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default PricingPage;