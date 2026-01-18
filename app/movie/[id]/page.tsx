'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMovieDetails, Movie, TMDB_IMAGE_URL } from '@/lib/tmdb';
import { useModal } from '@/context/ModalContext';
import { Play, Star, Calendar, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function MoviePage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const [movie, setMovie] = useState<Movie | null>(null);
    const { openPlayer } = useModal();

    useEffect(() => {
        async function load() {
            if (id) {
                const data = await getMovieDetails(id as string);
                setMovie(data);
            }
        }
        load();
    }, [id]);

    if (!movie) return <div className="min-h-screen text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen pb-20 animate-in fade-in duration-500">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="fixed top-24 left-12 z-50 p-2 bg-black/40 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-colors"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Banner */}
            <div className="relative h-[70vh] w-full">
                {movie.backdrop_path ? (
                    <Image
                        src={`${TMDB_IMAGE_URL}${movie.backdrop_path}`}
                        alt={movie.title || 'Movie'}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

                <div className="absolute bottom-0 left-0 px-12 pb-12 w-full z-10">
                    <h1 className="text-6xl font-bold text-rose-50 mb-6 drop-shadow-2xl max-w-4xl leading-tight">{movie.title}</h1>

                    <div className="flex items-center gap-6 text-lg text-rose-200 font-medium mb-8">
                        <span className="flex items-center gap-2 text-green-400 font-bold bg-black/40 px-3 py-1 rounded-md backdrop-blur-sm">
                            {(movie.vote_average * 10).toFixed(0)}% Match
                        </span>
                        <span className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md backdrop-blur-sm">
                            <Calendar size={18} /> {movie.release_date?.split('-')[0]}
                        </span>
                        <span className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md backdrop-blur-sm">
                            <Star size={18} className="text-yellow-500" fill="currentColor" />
                            {movie.vote_average.toFixed(1)}
                        </span>
                    </div>

                    <button
                        onClick={() => openPlayer(movie)}
                        className="flex items-center gap-4 px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xl transition-all shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95 group"
                    >
                        <div className="p-1 bg-white rounded-full">
                            <Play fill="currentColor" size={20} className="text-red-600 ml-0.5" />
                        </div>
                        Play Movie
                    </button>
                </div>
            </div>

            <div className="px-12 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                    <p className="text-xl text-rose-100/80 leading-relaxed font-light">
                        {movie.overview}
                    </p>
                </div>

                <div className="space-y-6 text-rose-100/60 border-l border-white/10 pl-8">
                    <div>
                        <span className="block text-xs uppercase tracking-wider text-rose-50/40 mb-1">Status</span>
                        <span className="text-rose-50 font-medium">Released</span>
                    </div>
                    <div>
                        <span className="block text-xs uppercase tracking-wider text-rose-50/40 mb-1">Original Title</span>
                        <span className="text-rose-50 font-medium">{movie.title}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
