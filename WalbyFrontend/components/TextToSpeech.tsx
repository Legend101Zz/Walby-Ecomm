"use client";
import React, { FormEvent, useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../app/context/IsPlayingContext";
import { sendTextToOpenAi } from "@/utils/sendTextToOpenai";
import { ChatBotCanvas } from "./ChatBotCanvas";
import DroneProduct from "./DroneProduct";

interface TextToSpeechProps {
  onNavigateToDrone: () => void;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({ onNavigateToDrone }) => {
  const [userText, setUserText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isPlaying, setIsPlaying } = useContext(AppContext);
  const [speak, setSpeak] = useState(false);
  const [text, setText] = useState("");
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [isListening, setIsListening] = useState(false);
  const [showDroneProduct, setShowDroneProduct] = useState(false);
  const [continuousListening, setContinuousListening] = useState(false);


  const synth = useRef(window.speechSynthesis);
  const recognition = useRef<SpeechRecognition | null>(null);

  const languageOptions = [
    { value: "en-US", label: "English" },
    { value: "es-ES", label: "Español" },
    { value: "fr-FR", label: "Français" },
    { value: "de-DE", label: "Deutsch" },
    { value: "it-IT", label: "Italiano" },
    { value: "ja-JP", label: "日本語" },
    { value: "ko-KR", label: "한국어" },
    { value: "zh-CN", label: "中文 (简体)" },
    { value: "hi-IN", label: "हिन्दी" },
  ];

  useEffect(() => {
    if (continuousListening) {
      startListening();
    } else {
      stopListening();
    }
  }, [continuousListening]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = true;
      recognition.current.interimResults = false;
      recognition.current.lang = language;

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setUserText(transcript);
        handleUserInput(transcript);
      };

      recognition.current.onend = () => {
        if (continuousListening) {
          startListening();
        } else {
          setIsListening(false);
        }
      };
    }
  }, [language, continuousListening]);

  const handleARClick = () => {
    window.open('https://technopia-vision-a9psuuxup-chiragsingh1711.vercel.app/', '_blank');
  };

  const speakText = (textToSpeak: string) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language;
    utterance.rate = 1;

    synth.current.speak(utterance);
    setIsPlaying(true);
    setSpeak(true);
    setText(textToSpeak);
    setPlaying(true);

    utterance.onend = () => {
      setIsPlaying(false);
      setSpeak(false);
      setPlaying(false);
      if (continuousListening) {
        startListening();
      }
    };
  };

  const handleUserInput = async (input: string) => {
    setIsLoading(true);
    try {
      const message = await sendTextToOpenAi(input, language, false, "Raj");
      if (message.includes("SHOW_DRONE_PRODUCT")) {
        onNavigateToDrone();
      } else {
        speakText(message);
      }
    } catch (error) {
      console.error("Error:", error);
      speakText("I'm sorry, I encountered an error. Can you please repeat that?");
    } finally {
      setIsLoading(false);
      setUserText("");
    }
  };

  const startListening = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userText.trim() !== "") {
      handleUserInput(userText);
    }
  };

  return (
    <div className="relative h-full w-full">
      <ChatBotCanvas
        speak={speak}
        text={text}
        setSpeak={setSpeak}
        audioSource={audioSource}
        setAudioSource={setAudioSource}
        playing={playing}
        setPlaying={setPlaying}
      />
      <div className="absolute top-0 left-0 w-full z-50 p-4 bg-black bg-opacity-50">
        <form onSubmit={handleSubmit} className="flex justify-center items-center space-x-2">
          <input
            type="text"
            value={userText}
            className="bg-transparent w-[510px] border border-blue-600 outline-none rounded-lg placeholder:text-blue-400 p-2 text-white"
            onChange={(e) => setUserText(e.target.value)}
            placeholder="How can I assist you with your shopping today?"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="text-white p-2 border border-blue-600 rounded-lg disabled:text-gray-400 
            disabled:cursor-not-allowed disabled:bg-gray-700 hover:bg-blue-700 transition duration-300"
          >
            {isLoading ? "Processing..." : "Ask"}
          </button>
          <button
            type="button"
            onClick={() => setContinuousListening(!continuousListening)}
            className={`p-2 rounded-lg transition duration-300 ${continuousListening
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            {continuousListening ? "Stop Listening" : "Start Listening"}
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-blue-600 text-white p-2 rounded-lg"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </form>
      </div>
      {showDroneProduct && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
          <DroneProduct onARClick={handleARClick} />
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;