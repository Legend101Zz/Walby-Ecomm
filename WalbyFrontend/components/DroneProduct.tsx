"use client"
import React from 'react';

interface DroneProductPageProps {
    onARClick: () => void;
}

const DroneProductPage: React.FC<DroneProductPageProps> = ({ onARClick }) => {
    return (
        <div className="bg-white p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Premium Drone X1000</h1>
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 pr-4">
                    <img src="/walam.png" alt="Drone X1000" className="w-full h-auto rounded-lg shadow-lg" />
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                    <p className="text-xl mb-4">Experience the future of aerial photography with our Premium Drone X1000.</p>
                    <ul className="list-disc list-inside mb-4">
                        <li>4K Ultra HD Camera</li>
                        <li>30 Minutes Flight Time</li>
                        <li>5km Control Range</li>
                        <li>Obstacle Avoidance System</li>
                        <li>Foldable Design for Easy Transport</li>
                    </ul>
                    <p className="text-2xl font-bold mb-4">Price: ₹74,999</p>
                    <button onClick={onARClick} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                        View in AR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DroneProductPage;