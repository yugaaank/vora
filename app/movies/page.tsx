'use client';

import { useState, useEffect } from 'react';
import { MovieRow } from '@/components/MovieRow';
import {
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getActionMovies,
    getComedyMovies,
    getHorrorMovies,
    getRomanceMovies,
    getSciFiMovies,
    getDocumentaries,
    Movie
} from '@/lib/tmdb';

export default function MoviesPage() {
    const [popular, setPopular] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [upcoming, setUpcoming] = useState<Movie[]>([]);
    const [action, setAction] = useState<Movie[]>([]);
    const [comedy, setComedy] = useState<Movie[]>([]);
    const [horror, setHorror] = useState<Movie[]>([]);
    const [romance, setRomance] = useState<Movie[]>([]);
    const [scifi, setSciFi] = useState<Movie[]>([]);

    useEffect(() => {
        async function loadData() {
            setPopular(await getPopularMovies());
            setTopRated(await getTopRatedMovies());
            setUpcoming(await getUpcomingMovies());
            setAction(await getActionMovies());
            setComedy(await getComedyMovies());
            setHorror(await getHorrorMovies());
            setRomance(await getRomanceMovies());
            setSciFi(await getSciFiMovies());
        }
        loadData();
    }, []);

    return (
        <div className="flex flex-col gap-4 pt-24 pb-20 animate-in fade-in duration-500 bg-obsidian min-h-screen">
            <div className="px-12 mb-4">
                <h1 className="text-4xl font-bold text-white mb-2">Movies</h1>
                <p className="text-white/40">Explore the latest and greatest films.</p>
            </div>

            <div className="space-y-4">
                <MovieRow title="Popular Now" movies={popular} isLarge />
                <MovieRow title="Top Rated" movies={topRated} />
                <MovieRow title="Upcoming Releases" movies={upcoming} />
                <MovieRow title="Action & Adventure" movies={action} />
                <MovieRow title="Comedies" movies={comedy} />
                <MovieRow title="Sci-Fi & Fantasy" movies={scifi} />
                <MovieRow title="Horror" movies={horror} />
                <MovieRow title="Romance" movies={romance} />
            </div>
        </div>
    );
}
