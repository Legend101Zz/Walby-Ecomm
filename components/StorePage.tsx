// components/StorePage.tsx
import React, { useState } from 'react';
import { TextToSpeech } from './TextToSpeech';
import DroneProductPage from './DroneProduct';

const StorePage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<'home' | 'drone'>('home');

    const handlePageChange = (page: 'home' | 'drone') => {
        setCurrentPage(page);
    };

    const handleARClick = () => {
        window.open('https://google.com', '_blank');  // Replace with your actual AR demo link
    };

    return (
        <div className="relative h-screen w-full">
            {currentPage === 'home' ? (
                <div className="flex items-center justify-center h-full">
                    <h1 className="text-3xl font-bold">Welcome to our Drone Store, Raj!</h1>
                </div>
            ) : (
                <DroneProductPage onARClick={handleARClick} />
            )}
            <TextToSpeech onPageChange={handlePageChange} currentPage={currentPage} />
        </div>
    );
};

export default StorePage;