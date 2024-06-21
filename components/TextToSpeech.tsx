"use client";
import React, { FormEvent, useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../app/context/IsPlayingContext";
import { sendTextToOpenAi } from "@/utils/sendTextToOpenai";
import { ChatBotCanvas } from "./ChatBotCanvas";

export const TextToSpeech: React.FC = () => {
  const [userText, setUserText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isPlaying, setIsPlaying } = useContext(AppContext);
  const [speak, setSpeak] = useState(false);
  const [text, setText] = useState("");
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [isListening, setIsListening] = useState(false);

  const synth = useRef(window.speechSynthesis);
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = false;
      recognition.current.lang = language;

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserText(transcript);
        handleUserInput(transcript);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

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
    };
  };

  const handleUserInput = async (input: string) => {
    setIsLoading(true);
    try {
      const message = await sendTextToOpenAi(input, language);
      speakText(message);
    } catch (error) {
      let errorMessage = "An error occurred";
      if (error instanceof Error) errorMessage = error.message;
      console.log(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
      setUserText("");
    }
  };

  const handleUserText = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userText === "") return alert("Please enter text");
    handleUserInput(userText);
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
        <form
          onSubmit={handleUserText}
          className="flex justify-center items-center space-x-2"
        >
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
            onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-lg transition duration-300 ${isListening
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            {isListening ? "Stop" : "Speak"}
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-blue-600 text-white p-2 rounded-lg"
          >
            <option value="en-US">English</option>
            <option value="es-ES">Español</option>
            <option value="fr-FR">Français</option>
            <option value="de-DE">Deutsch</option>
            <option value="it-IT">Italiano</option>
            <option value="ja-JP">日本語</option>
            <option value="ko-KR">한국어</option>
            <option value="zh-CN">中文 (简体)</option>
            <option value="hi-IN">हिन्दी</option>

          </select>
        </form>
      </div>
    </div>
  );
};