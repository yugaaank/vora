'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Star, X } from 'lucide-react';
import { Movie, TMDB_IMAGE_URL } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

interface MovieRowProps {
    title: string;
    movies: Movie[];
    isLarge?: boolean; // Option for larger cards (like Netflix "Top 10" or Trending)
    onRemove?: (id: number) => void;
}

export function MovieRow({ title, movies, isLarge = false, onRemove }: MovieRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [isMoved, setIsMoved] = useState(false);

    const handleClick = (direction: 'left' | 'right') => {
        setIsMoved(true);
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo =
                direction === 'left'
                    ? scrollLeft - clientWidth
                    : scrollLeft + clientWidth;

            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <div className="space-y-4 md:space-y-6 my-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="w-56 cursor-pointer text-xl font-bold transition duration-200 text-rose-50 hover:text-white pl-12 border-l-4 border-red-600 ml-12 md:text-2xl">
                {title}
            </h2>

            <div className="group relative md:-ml-2">
                <ChevronLeft
                    className={clsx(
                        "absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 bg-black/50 rounded-full p-2 text-white",
                        !isMoved && "hidden"
                    )}
                    onClick={() => handleClick('left')}
                />

                <div
                    ref={rowRef}
                    className="flex items-center space-x-4 overflow-x-scroll scrollbar-hide md:space-x-4 md:p-2 pl-12 pr-12"
                >
                    {movies.map((movie) => {
                        const href = movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;

                        return (
                            <div
                                key={movie.id}
                                className={clsx(
                                    "relative h-40 min-w-[200px] cursor-pointer transition duration-200 ease-out md:h-52 md:min-w-[280px] hover:scale-105 hover:z-50 rounded-lg overflow-hidden border border-white/10 bg-white/5",
                                    isLarge // Large is currently same size but could be customized. Let's make it portrait for default, landscape for "isLarge"? 
                                    // Actually netflix rows are usually landscape thumbnails (backdrop).
                                    // Let's switch to backdrop for rows, it looks richer.
                                    // Portrait is for grids. Rows usually use backdrops.
                                    // Except "My List" or specific poster rows.
                                    // I'll use backdrop path for these rows.
                                )}
                            >
                                <Link href={href} className="block w-full h-full">
                                    {movie.backdrop_path || movie.poster_path ? (
                                        <Image
                                            src={`${TMDB_IMAGE_URL}${movie.backdrop_path || movie.poster_path}`}
                                            alt={movie.title || movie.name || 'Movie'}
                                            fill
                                            className="rounded-sm object-cover md:rounded"
                                            sizes="300px"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-xs text-white">
                                            No Image
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">{movie.title || movie.name}</h4>
                                        <div className="flex items-center gap-2 text-[10px] text-white/70">
                                            <span className="text-green-400 font-bold">{(movie.vote_average * 10).toFixed(0)}% Match</span>
                                            <span>{movie.release_date?.split('-')[0]}</span>
                                        </div>
                                        {/* Progress Bar for History */}
                                        {'progress' in movie && (movie as Movie & { progress: number }).progress > 0 && (
                                            <div className="w-full h-0.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-red-600 rounded-full"
                                                    style={{ width: `${(movie as Movie & { progress: number }).progress * 100}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {onRemove && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onRemove(movie.id);
                                        }}
                                        className="absolute top-2 right-2 z-50 p-1.5 bg-black/60 hover:bg-red-600 rounded-full text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-90 hover:scale-110"
                                        title="Remove from Continue Watching"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                <ChevronRight
                    className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 bg-black/50 rounded-full p-2 text-white"
                    onClick={() => handleClick('right')}
                />
            </div>
        </div>
    );
}
