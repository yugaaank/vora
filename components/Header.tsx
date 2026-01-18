'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Bell, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { searchMulti, Movie, TMDB_IMAGE_URL } from '@/lib/tmdb';
import { useModal } from '@/context/ModalContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);

    const router = useRouter();
    const { openPlayer } = useModal();

    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    useEffect(() => {
        if (searchQuery.length > 2) {
            const delayDebounceFn = setTimeout(async () => {
                const results = await searchMulti(searchQuery);
                setSearchResults(results.slice(0, 5));
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            // Avoid synchronous state update in effect
            const timer = setTimeout(() => setSearchResults([]), 0);
            return () => clearTimeout(timer);
        }
    }, [searchQuery]);

    return (
        <>
            <header
                className={clsx(
                    'fixed top-0 left-0 right-0 h-24 z-40 transition-all duration-500 px-12 flex items-center justify-between',
                    isScrolled ? 'bg-obsidian/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
                )}
            >
                <div className="flex items-center gap-4 pl-20"> {/* Padding to clear sidebar */}
                    <h1 className="text-2xl font-semibold tracking-wide text-white/90 font-sans">
                        Vora <span className="font-light text-white/50">Crimson</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative" ref={searchRef}>
                        <div className={clsx(
                            "flex items-center transition-all duration-300 overflow-hidden shadow-lg",
                            isSearchOpen
                                ? "w-[600px] bg-black/40 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-xl"
                                : "w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex justify-center cursor-pointer"
                        )}
                            onClick={() => !isSearchOpen && setIsSearchOpen(true)}
                        >
                            {isSearchOpen && (
                                <input
                                    type="text"
                                    placeholder="Search library..."
                                    className="bg-transparent border-none outline-none text-white text-lg w-full placeholder:text-white/20 font-light tracking-wide"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    isSearchOpen ? setIsSearchOpen(false) : setIsSearchOpen(true);
                                    if (isSearchOpen) setSearchQuery('');
                                }}
                                className={clsx(
                                    "text-white/60 hover:text-white transition-colors",
                                    isSearchOpen ? "ml-4" : "mx-auto"
                                )}
                            >
                                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {isSearchOpen && searchResults.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    className="absolute top-full right-0 mt-4 w-[600px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
                                >
                                    {searchResults.map((movie) => (
                                        <div
                                            key={movie.id}
                                            onClick={() => {
                                                const route = movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;
                                                router.push(route);
                                                setIsSearchOpen(false);
                                                setSearchQuery('');
                                            }}
                                            className="flex gap-5 p-5 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/5 last:border-b-0 group"
                                        >
                                            {/* Poster */}
                                            <div className="relative w-14 h-20 bg-white/5 flex-shrink-0 rounded-lg overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                {movie.poster_path ? (
                                                    <Image
                                                        src={`${TMDB_IMAGE_URL}${movie.poster_path}`}
                                                        alt={movie.title || movie.name || 'Poster'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">No Img</div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="text-base font-semibold text-white/90 leading-tight group-hover:text-white transition-colors">
                                                        {movie.title || movie.name}
                                                    </h4>
                                                    {movie.vote_average > 0 && (
                                                        <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                                                            ★ {movie.vote_average.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40">
                                                        {movie.media_type === 'tv' ? 'Series' : 'Film'}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                                    {movie.release_date && (
                                                        <span className="text-xs text-white/40">
                                                            {movie.release_date.split('-')[0]}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed font-light">
                                                    {movie.overview || "No overview available."}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </header>
        </>
    );
}
