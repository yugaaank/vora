"use client";
import { useState, useEffect } from 'react';
import { MovieRow } from '@/components/MovieRow';
import {
    getTrendingTVShows,
    getTopRatedTV,
    getTVActionAdventure,
    getTVComedy,
    getTVDrama,
    getTVSciFiFantasy,
    Movie
} from '@/lib/tmdb';

export default function TVPage() {
    const [trending, setTrending] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [action, setAction] = useState<Movie[]>([]);
    const [comedy, setComedy] = useState<Movie[]>([]);
    const [drama, setDrama] = useState<Movie[]>([]);
    const [scifi, setSciFi] = useState<Movie[]>([]);

    useEffect(() => {
        async function loadData() {
            setTrending(await getTrendingTVShows());
            setTopRated(await getTopRatedTV());
            setAction(await getTVActionAdventure());
            setComedy(await getTVComedy());
            setDrama(await getTVDrama());
            setSciFi(await getTVSciFiFantasy());
        }
        loadData();
    }, []);

    return (
        <div className="flex flex-col gap-4 pt-24 pb-20 animate-in fade-in duration-500 bg-obsidian min-h-screen">
            <div className="px-12 mb-4">
                <h1 className="text-4xl font-bold text-white mb-2">TV Shows</h1>
                <p className="text-white/40">Binge-worthy series for every mood.</p>
            </div>

            <div className="space-y-4">
                <MovieRow title="Trending Series" movies={trending} isLarge />
                <MovieRow title="Top Rated TV" movies={topRated} />
                <MovieRow title="Action & Adventure" movies={action} />
                <MovieRow title="Sci-Fi & Fantasy" movies={scifi} />
                <MovieRow title="Comedy" movies={comedy} />
                <MovieRow title="Drama" movies={drama} />
            </div>
        </div>
    );
}
