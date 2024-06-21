"use client";
import React, { createContext, useState, ReactNode } from 'react';

interface AppContextType {
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType>({
	isPlaying: false,
	setIsPlaying: () => { },
});

interface IsPlayingProviderProps {
	children: ReactNode;
}

export const IsPlayingProvider: React.FC<IsPlayingProviderProps> = ({ children }) => {
	const [isPlaying, setIsPlaying] = useState(false);

	return (
		<AppContext.Provider value={{ isPlaying, setIsPlaying }}>
			{children}
		</AppContext.Provider>
	);
};