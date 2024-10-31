import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const PopDemo = ({ setshowspopup }) => {
    const { user, isLoading: authLoading, error: authError, getAccessTokenSilently } = useAuth0();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            setLoading(true);
            try {
                // Step 1: Get the Management API token with appropriate scope
                const token = await getAccessTokenSilently({
                    audience: 'https://dev-msjrwkev4m8lmvoq.us.auth0.com/api/v2/',
                    scope: 'read:users',
                });

                // Log the token for debugging
                console.log("Access Token:", token);

                // Step 2: Fetch user info using the access token
                const userResponse = await fetch(`https://dev-msjrwkev4m8lmvoq.us.auth0.com/api/v2/users/${user.sub}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Log response status for debugging
                if (!userResponse.ok) {
                    const errorData = await userResponse.json();
                    console.error("API Error:", errorData);
                    throw new Error(`Failed to fetch user info: ${errorData.message}`);
                }

                const userData = await userResponse.json();
                setUserInfo(userData);
                console.log("Fetched user info:", userData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Fetch user info if user exists and there is no loading from Auth0
        if (user && !authLoading && !authError) {
            fetchUserInfo();
        } else {
            setLoading(false); // Stop loading if Auth0 is still loading or there is an error
        }
    }, [user, authLoading, authError]); // Dependency array

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Loading...</h2>
                    <p className="text-gray-700">Please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Error</h2>
                    <p className="text-red-600">{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                        onClick={() => setshowspopup(false)} // Hide popup on button click
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Verification In Progress</h2>
                <p className="text-gray-700">Please wait while we verify your information.</p>

                <h3 className="font-semibold mt-4">User Information:</h3>
                <ul className="list-disc list-inside">
                    {userInfo && (
                        <>
                            <li><strong>Name:</strong> {userInfo.name}</li>
                            <li><strong>Email:</strong> {userInfo.email}</li>
                            <li><strong>Nickname:</strong> {userInfo.nickname}</li>
                            <li><strong>Picture:</strong> <img src={userInfo.picture} alt="User" className="w-16 h-16 rounded-full" /></li>
                            <li><strong>Sub:</strong> {userInfo.sub}</li>
                        </>
                    )}
                </ul>

                <button
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    onClick={() => setshowspopup(false)} // Hide popup on button click
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PopDemo;
