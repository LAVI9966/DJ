import React, { useContext } from 'react';
import MyContext from '../../context/data/myContext';
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Check, Sparkles } from "lucide-react";

const ServicesPage = () => {
    const services = [
        {
            title: 'Mix Master',
            description: 'Achieve a professional, polished sound with our expert mixing and mastering services.',
            price: '49.99 ₹',
            features: [
                'Professional mixing & mastering',
                'Industry-standard techniques',
                'Clear & balanced sound',
                'Radio-ready output',
                'Detailed audio enhancement',
                '2 free revisions'
            ],
            popular: false
        },
        {
            title: 'Custom Beat',
            description: 'Unlock your creativity with our custom beat production services.',
            price: '199.99 ₹',
            features: [
                'Unique, original composition',
                'Tailored to your style',
                'High-quality sound files',
                'Full ownership rights',
                'Multiple format delivery',
                'Unlimited revisions'
            ],
            popular: true
        }
    ];

    const context = useContext(MyContext);
    const { servicesref } = context;

    return (
        <div
            ref={servicesref}
            className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Our Services
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Take your music to the next level with our professional audio services
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {services.map((service, index) => (
                        <Card
                            key={index}
                            className={`relative overflow-hidden transition-all duration-300 hover:scale-105 bg-gray-900/50 backdrop-blur-sm border-gray-800 ${service.popular ? 'ring-2 ring-purple-500' : ''
                                }`}
                        >
                            {service.popular && (
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-purple-500 text-white">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-white">
                                    {service.title}
                                </CardTitle>
                                <p className="text-gray-400">{service.description}</p>
                            </CardHeader>

                            <CardContent>
                                <div className="text-3xl font-bold text-white mb-6">
                                    {service.price}
                                    <span className="text-sm text-gray-400 font-normal"> /project</span>
                                </div>

                                <ul className="space-y-3">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-center text-gray-300">
                                            <Check className="w-5 h-5 mr-2 text-green-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                {/* <Button
                                    className={`w-full ${service.popular
                                        ? 'bg-purple-600 hover:bg-purple-700'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                >
                                    Get Started
                                </Button> */}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;