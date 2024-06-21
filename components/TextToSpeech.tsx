"use client";
import React, { FormEvent, useContext, useState } from "react";
import { AppContext } from "../app/context/IsPlayingContext";
import { sendTextToOpenAi } from "@/utils/sendTextToOpenai";
import { ChatBotCanvas } from "./ChatBotCanvas";

export const TextToSpeech: React.FC = () => {
  const [userText, setUserText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isPlaying, setIsPlaying } = useContext(AppContext);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const voices = synth?.getVoices();

  const [speak, setSpeak] = useState(false);
  const [text, setText] = useState("");
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const seletedVoice = voices?.find((voice) => voice.name === "Tessa");

  const speakText = (textToSpeak: string) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1;
    utterance.voice = seletedVoice!;

    synth?.speak(utterance);
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

  async function handleUserText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (userText === "") return alert("Please enter text");
    setIsLoading(true);
    try {
      const message = await sendTextToOpenAi(userText);
      speakText(message);
    } catch (error) {
      let message = "";
      if (error instanceof Error) message = error.message;
      console.log(message);
    } finally {
      setIsLoading(false);
      setUserText("");
    }
  }

  return (
    <div className="relative h-screen flex flex-col">
      <div className="absolute top-0 left-0 w-full z-50 p-4 bg-black bg-opacity-50">
        <form
          onSubmit={handleUserText}
          className="flex justify-center items-center space-x-2"
        >
          <input
            type="text"
            value={userText}
            className="bg-transparent w-[510px] border border-[#b00c3f]/80 outline-none rounded-lg placeholder:text-[#b00c3f] p-2 text-[#b00c3f]"
            onChange={(e) => setUserText(e.target.value)}
            placeholder="What do you want to know human...."
          />
          <button
            disabled={isLoading}
            className="text-[#b00c3f] p-2 border border-[#b00c3f] rounded-lg disabled:text-blue-100 
            disabled:cursor-not-allowed disabled:bg-gray-500 hover:scale-110 hover:bg-[#b00c3f] hover:text-black duration-300 transition-all"
          >
            {isLoading ? "thinking..." : "Ask"}
          </button>
        </form>
      </div>
      <div className="flex-grow">
        <ChatBotCanvas
          speak={speak}
          text={text}
          setSpeak={setSpeak}
          audioSource={audioSource}
          setAudioSource={setAudioSource}
          playing={playing}
          setPlaying={setPlaying}
        />
      </div>
    </div>
  );
};