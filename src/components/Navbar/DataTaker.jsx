import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    User, Mail, Phone, MapPin, Globe, X
} from 'lucide-react';

const ProfileEditForm = ({ onClose, initialData = {}, onSubmit }) => {
    const [formData, setFormData] = React.useState({
        legalName: initialData.legalName || '',
        artistName: initialData.artistName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        streetAddress: initialData.streetAddress || '',
        state: initialData.state || '',
        country: initialData.country || '',
        pincode: initialData.pincode || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="w-full max-w-2xl bg-gray-900 text-white border-gray-800">
            <CardHeader className="relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-400 hover:text-white" />
                </button>
                <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-200">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Legal Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <Input
                                        name="legalName"
                                        value={formData.legalName}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                                        placeholder="Enter legal name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-300">Artist Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <Input
                                        name="artistName"
                                        value={formData.artistName}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                                        placeholder="Enter artist name"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-200">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                                        placeholder="Enter email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-300">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <Input
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-200">Address Information</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Street Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <Input
                                        name="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={handleChange}
                                        className="bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                                        placeholder="Enter street address"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">State</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <Input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                                            placeholder="Enter state"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-300">Country</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <Input
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                                            placeholder="Enter country"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-300">Pincode</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <Input
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className="bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                                            placeholder="Enter pincode"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProfileEditForm;