'use client';

import Image from 'next/image';
import { Play, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Movie, TMDB_IMAGE_URL } from '@/lib/tmdb';
import { useRouter } from 'next/navigation';

interface HeroProps {
    movies: Movie[];
    onPlay: (movie: Movie) => void;
}

export function Hero({ movies = [], onPlay }: HeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    // Auto-advance carousel
    useEffect(() => {
        if (movies.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % movies.length);
        }, 8000); // 8 seconds per slide
        return () => clearInterval(interval);
    }, [movies.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    };

    if (!movies || movies.length === 0) {
        // Fallback skeleton or loading state
        return <div className="h-[85vh] w-full bg-obsidian flex items-center justify-center text-rose-300">Loading Cinema...</div>;
    }

    const currentMovie = movies[currentIndex];

    const handleInfo = () => {
        const route = currentMovie.media_type === 'tv' ? `/tv/${currentMovie.id}` : `/movie/${currentMovie.id}`;
        router.push(route);
    };

    return (
        <div className="relative h-[85vh] w-full overflow-hidden group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        {currentMovie.backdrop_path ? (
                            <Image
                                src={`${TMDB_IMAGE_URL}${currentMovie.backdrop_path}`}
                                alt={currentMovie.title}
                                fill
                                className="object-cover object-top"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-900" />
                        )}

                        {/* Cinematic Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent" />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end pb-32 px-16 max-w-5xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentMovie.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-white/80 tracking-[0.3em] text-sm font-semibold uppercase mb-6 flex items-center gap-3">
                            <span className="w-12 h-[1px] bg-white/50 inline-block" /> Trending Now
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 text-white drop-shadow-2xl line-clamp-2 leading-[0.9]">
                            {currentMovie.title}
                        </h1>

                        <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed line-clamp-3 font-light">
                            {currentMovie.overview}
                        </p>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => onPlay(currentMovie)}
                                className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                            >
                                <Play fill="currentColor" size={20} />
                                Watch Now
                            </button>
                            <button
                                onClick={handleInfo}
                                className="flex items-center gap-3 px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95"
                            >
                                <Info size={20} />
                                More Info
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute right-16 bottom-32 flex gap-4 z-20">
                <button onClick={handlePrev} className="p-4 rounded-full bg-black/20 hover:bg-white/10 border border-white/5 transition-colors text-white backdrop-blur-xl">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={handleNext} className="p-4 rounded-full bg-black/20 hover:bg-white/10 border border-white/5 transition-colors text-white backdrop-blur-xl">
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-16 left-16 flex gap-3 z-20">
                {movies.slice(0, 5).map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === (currentIndex % 5) ? 'w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/20'}`}
                    />
                ))}
            </div>
        </div>
    );
}
