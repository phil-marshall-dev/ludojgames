import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
    const { id } = useParams();
    return (
        <div className="container text-center mt-5">
            <h1>User Page for User ID: {id}</h1>
        </div>
    )
};

export default ProfilePage;