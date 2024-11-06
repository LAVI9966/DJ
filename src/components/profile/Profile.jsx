import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "../ui/card";
import {
    User, Mail, Phone, MapPin, Calendar, CheckCircle,
    Settings, LogOut, Bell, Edit, Camera, Globe
} from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
const FullPageProfile = () => {
    const { user } = useAuth0();
    const [fetchedUser, setfetchedUser] = useState("");
    const [isUser, setisUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {

            try {
                console.log(user)
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getuser`, { params: { email: user?.email } });
                console.log("Response from fetchUser: ", response.data);
                setisUser(response.data);
            } catch (error) {
                console.log("errrrr", error)
            }
        }
        fetchUser();
    })

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <></>
        // <div className="min-h-screen bg-black">
        //     {/* Navigation Bar */}
        //     <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        //         <div className="max-w-7xl mx-auto flex justify-between items-center">
        //             <div className="text-white text-xl font-bold">Profile Dashboard</div>
        //             <div className="flex items-center space-x-4">
        //                 <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
        //                     <Bell size={20} />
        //                 </button>
        //                 <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
        //                     <Settings size={20} />
        //                 </button>
        //                 <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
        //                     <LogOut size={20} />
        //                 </button>
        //             </div>
        //         </div>
        //     </nav>

        //     <div className="max-w-7xl mx-auto px-4 py-8">
        //         {/* Profile Header */}
        //         <div className="relative mb-8">
        //             <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
        //             <div className="absolute -bottom-16 left-8 flex items-end">
        //                 <div className="relative">
        //                     <div className="w-32 h-32 bg-gray-800 rounded-full border-4 border-black flex items-center justify-center">
        //                         <User size={64} className="text-gray-400" />
        //                     </div>
        //                     <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
        //                         <Camera size={16} className="text-white" />
        //                     </button>
        //                 </div>
        //                 <div className="ml-6 mb-4">
        //                     <div className="flex items-center gap-3">
        //                         <h1 className="text-3xl font-bold text-white">{user.artistName}</h1>
        //                         {user.verified && (
        //                             <CheckCircle className="text-blue-400" size={24} />
        //                         )}
        //                     </div>
        //                     <p className="text-gray-400">@{user.legalName.toLowerCase().replace(' ', '')}</p>
        //                 </div>
        //             </div>
        //             <div className="absolute right-8 bottom-8">
        //                 <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
        //                     <Edit size={16} />
        //                     Edit Profile
        //                 </button>
        //             </div>
        //         </div>

        //         {/* Main Content */}
        //         <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        //             {/* Left Column - Personal Info */}
        //             <Card className="bg-gray-900 border-gray-800 text-white">
        //                 <CardContent className="p-6">
        //                     <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
        //                     <div className="space-y-6">
        //                         <div className="flex items-center gap-4">
        //                             <User className="text-blue-400" size={24} />
        //                             <div>
        //                                 <p className="text-sm text-gray-400">Legal Name</p>
        //                                 <p className="font-medium">{user.legalName}</p>
        //                             </div>
        //                         </div>
        //                         <div className="flex items-center gap-4">
        //                             <Mail className="text-green-400" size={24} />
        //                             <div>
        //                                 <p className="text-sm text-gray-400">Email</p>
        //                                 <p className="font-medium">{user.email}</p>
        //                             </div>
        //                         </div>
        //                         <div className="flex items-center gap-4">
        //                             <Phone className="text-yellow-400" size={24} />
        //                             <div>
        //                                 <p className="text-sm text-gray-400">Phone</p>
        //                                 <p className="font-medium">{user.phoneNumber}</p>
        //                             </div>
        //                         </div>
        //                         <div className="flex items-center gap-4">
        //                             <Calendar className="text-purple-400" size={24} />
        //                             <div>
        //                                 <p className="text-sm text-gray-400">Member Since</p>
        //                                 <p className="font-medium">{formatDate(user.createdAt.$date)}</p>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </CardContent>
        //             </Card>

        //             {/* Middle Column - Location */}
        //             <Card className="bg-gray-900 border-gray-800 text-white">
        //                 <CardContent className="p-6">
        //                     <h2 className="text-xl font-semibold mb-6">Location</h2>
        //                     <div className="space-y-6">
        //                         <div className="flex items-start gap-4">
        //                             <MapPin className="text-red-400" size={24} />
        //                             <div>
        //                                 <p className="text-sm text-gray-400">Street Address</p>
        //                                 <p className="font-medium">{user.streetAddress}</p>
        //                             </div>
        //                         </div>
        //                         <div className="flex items-start gap-4">
        //                             <Globe className="text-indigo-400" size={24} />
        //                             <div>
        //                                 <p className="text-sm text-gray-400">Region</p>
        //                                 <p className="font-medium">{user.state}, {user.country}</p>
        //                                 <p className="text-sm text-gray-400 mt-1">Pincode: {user.pincode}</p>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </CardContent>
        //             </Card>

        //             {/* Right Column - Account Details */}
        //             <Card className="bg-gray-900 border-gray-800 text-white">
        //                 <CardContent className="p-6">
        //                     <h2 className="text-xl font-semibold mb-6">Account Details</h2>
        //                     <div className="space-y-6">
        //                         <div className="flex items-center gap-4">
        //                             <div className="p-2 bg-blue-500/10 rounded-lg">
        //                                 <CheckCircle className="text-blue-400" size={24} />
        //                             </div>
        //                             <div>
        //                                 <p className="font-medium">Verified Account</p>
        //                                 <p className="text-sm text-gray-400">Your account is verified</p>
        //                             </div>
        //                         </div>
        //                         <div className="flex items-center gap-4">
        //                             <div className="p-2 bg-purple-500/10 rounded-lg">
        //                                 <User className="text-purple-400" size={24} />
        //                             </div>
        //                             <div>
        //                                 <p className="font-medium">Artist Profile</p>
        //                                 <p className="text-sm text-gray-400">Known as "{user.artistName}"</p>
        //                             </div>
        //                         </div>
        //                         <div className="pt-4 border-t border-gray-800">
        //                             <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
        //                                 <Settings size={16} />
        //                                 Account Settings
        //                             </button>
        //                         </div>
        //                     </div>
        //                 </CardContent>
        //             </Card>
        //         </div>
        //     </div>
        // </div>
    );
};

export default FullPageProfile;