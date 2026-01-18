'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movie } from '@/lib/tmdb';
import { VideoPlayer } from '@/components/VideoPlayer';
import { addToHistory } from '@/lib/history';

interface PlayOptions {
    movie: Movie;
    season?: number;
    episode?: number;
}

interface ModalContextType {
    openPlayer: (movie: Movie, season?: number, episode?: number) => void;
    closePlayer: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [playOptions, setPlayOptions] = useState<PlayOptions | null>(null);

    const openPlayer = (movie: Movie, season?: number, episode?: number) => {
        setPlayOptions({ movie, season, episode });
        // Add to history immediately when opening player
        addToHistory(movie, season, episode);
    };

    const closePlayer = () => {
        setPlayOptions(null);
    };

    return (
        <ModalContext.Provider value={{ openPlayer, closePlayer }}>
            {children}

            <VideoPlayer
                isOpen={!!playOptions}
                onClose={closePlayer}
                movie={playOptions?.movie || null}
                season={playOptions?.season}
                episode={playOptions?.episode}
            />
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
