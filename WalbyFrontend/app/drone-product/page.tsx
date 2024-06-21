"use client"
import React, { useEffect, useState } from 'react';
import { sendTextToOpenAi } from "@/utils/sendTextToOpenai";

const DroneProductPage: React.FC = () => {
    const [aiResponse, setAiResponse] = useState("");
    const [isListening, setIsListening] = useState(true);
    const [language, setLanguage] = useState("en-US");


    useEffect(() => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = language;

        recognition.onresult = async (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            const response = await sendTextToOpenAi(transcript, language, true, "Raj");
            setAiResponse(response);
            speakText(response);
        };

        recognition.onend = () => {
            if (isListening) {
                recognition.start();
            }
        };

        if (isListening) {
            recognition.start();
        }

        return () => {
            recognition.stop();
        };
    }, [isListening, language]);

    useEffect(() => {
        // Initial AI greeting
        const greetCustomer = async () => {
            const greeting = await sendTextToOpenAi("Greet the customer and introduce the drone", language, true, "Raj");
            setAiResponse(greeting);
            speakText(greeting);
        };
        greetCustomer();

        // Set up inactivity check
        const inactivityTimeout = setTimeout(() => {
            handleInactivity();
        }, 30000);

        return () => clearTimeout(inactivityTimeout);
    }, []);

    const speakText = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    };

    const handleInactivity = async () => {
        const inactivityPrompt = await sendTextToOpenAi("The customer has been inactive for 30 seconds", language, true, "Raj");
        setAiResponse(inactivityPrompt);
        speakText(inactivityPrompt);
    };


    const handleARClick = () => {
        window.open('https://technopia-vision-a9psuuxup-chiragsingh1711.vercel.app/', '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Premium Drone X1000</h1>
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 pr-4">
                    <img src="/drone.jpeg" alt="Drone X1000" className="w-full h-auto rounded-lg shadow-lg" />
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                    <p className="text-xl mb-4">{aiResponse}</p>
                    <button onClick={handleARClick} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                        View in AR
                    </button>
                    <button className="ml-4 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300">
                        Back to Home
                    </button>
                </div>
            </div>
        </div >
    );
};

export default DroneProductPage;