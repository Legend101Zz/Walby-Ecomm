"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { TextToSpeech } from "@/components/TextToSpeech";

const AiAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleNavigateToDrone = () => {
        router.push('/drone-product');
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ width: '450px', height: '600px' }}>
                    <div className="p-4 bg-blue-700 text-white flex justify-between items-center">
                        <h3 className="font-semibold">WalBy Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-yellow-400">
                            Close
                        </button>
                    </div>
                    <TextToSpeech onNavigateToDrone={handleNavigateToDrone} />
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-700 text-white p-4 rounded-full shadow-lg hover:bg-blue-800 transition duration-300"
                >
                    Chat
                </button>
            )}
        </div>
    );
};

export default AiAssistant;