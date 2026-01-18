'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Movie } from '@/lib/tmdb';
import { addToHistory, getHistory } from '@/lib/history';

interface VideoPlayerProps {
    isOpen: boolean;
    onClose: () => void;
    movie: Movie | null;
    season?: number;
    episode?: number;
}

export function VideoPlayer({ isOpen, onClose, movie, season, episode }: VideoPlayerProps) {
    const [savedTime, setSavedTime] = useState<number>(0);

    // Retrieve saved time on mount
    useEffect(() => {
        if (movie && isOpen) {
            const history = getHistory();
            const item = history.find(h =>
                h.id === movie.id &&
                h.season === season &&
                h.episode === episode
            );
            if (item?.currentTime) {
                setTimeout(() => setSavedTime(item.currentTime || 0), 0);
                console.log(`Resuming ${movie.title} at ${item.currentTime}s`);
            } else {
                setTimeout(() => setSavedTime(0), 0);
            }
        }
    }, [movie, season, episode, isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            try {
                // Determine if data is string JSON or object
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

                if (data?.type === 'PLAYER_EVENT' && data?.data) {
                    const { event: playerEvent, progress, currentTime, duration } = data.data;

                    // Update history on specific events (pause or timeupdate)
                    if (playerEvent === 'pause' || playerEvent === 'timeupdate') {
                        if (movie) {
                            // Only update if we have valid time data
                            addToHistory(
                                movie,
                                season,
                                episode,
                                progress || 0,
                                currentTime || 0,
                                duration || 0
                            );
                        }
                    }
                }
            } catch (e) {
                // Ignore parsing errors for non-JSON messages
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [movie, season, episode]);

    if (!movie) return null;

    // Determine embed URL
    let embedUrl = `https://www.vidking.net/embed/movie/${movie.id}`;
    if (movie.media_type === 'tv' && season && episode) {
        embedUrl = `https://www.vidking.net/embed/tv/${movie.id}/${season}/${episode}`;
    }

    // Append auto-resume parameter
    if (savedTime > 10) { // Only resume if > 10 seconds in
        embedUrl += `?at=${Math.floor(savedTime)}`;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-red-600 rounded-full transition-colors z-[110] group"
                    >
                        <X className="group-hover:rotate-90 transition-transform" />
                    </button>

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="w-full h-full md:p-20 flex flex-col"
                    >
                        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.2)] border border-red-900/30 bg-black">
                            <iframe
                                src={embedUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
