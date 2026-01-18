'use client';
import { useState, useEffect } from 'react';
import { MovieRow } from '@/components/MovieRow';
import { getPopularMovies, Movie } from '@/lib/tmdb';

export default function ExplorePage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        async function load() {
            setMovies(await getPopularMovies());
        }
        load();
    }, []);

    return (
        <div className="pt-32 min-h-screen">
            <div className="px-12 mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 border-l-4 border-red-600 pl-4">Explore</h1>
                <p className="text-white/40 pl-5">Discover what's popular right now.</p>
            </div>

            <MovieRow title="Popular Movies" movies={movies} isLarge />
        </div>
    );
}
