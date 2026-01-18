'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTVDetails, getTVSeasonDetails, TMDB_IMAGE_URL, TVShowDetails, SeasonDetails, Movie } from '@/lib/tmdb';
import { getHistory } from '@/lib/history';
import { useModal } from '@/context/ModalContext';
import { Play, Star, Calendar, ArrowLeft, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import clsx from 'clsx';

export default function TVShowPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    // We treat the TV show as a 'Movie' type for the player
    const [show, setShow] = useState<TVShowDetails | null>(null);
    const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [loadingSeason, setLoadingSeason] = useState(false);
    const [lastEpisode, setLastEpisode] = useState<number | undefined>(undefined);

    const { openPlayer } = useModal();

    useEffect(() => {
        async function loadShow() {
            if (id) {
                const details = await getTVDetails(Number(id));
                setShow(details);

                if (details) {
                    // Check history
                    const history = getHistory();
                    const historyItem = history.find(h => h.id === Number(id));

                    if (historyItem && historyItem.season) {
                        setSelectedSeason(historyItem.season);
                        setLastEpisode(historyItem.episode);
                    } else if (details.seasons?.length) {
                        const firstSeason = details.seasons.find(s => s.season_number > 0) || details.seasons[0];
                        setSelectedSeason(firstSeason.season_number);
                    }
                }
            }
        }
        loadShow();
    }, [id]);

    useEffect(() => {
        async function loadSeason() {
            if (show && selectedSeason) {
                setLoadingSeason(true);
                const data = await getTVSeasonDetails(show.id, selectedSeason);
                setSeasonDetails(data);
                setLoadingSeason(false);
            }
        }
        loadSeason();
    }, [show, selectedSeason]);

    if (!show) return <div className="min-h-screen text-white flex items-center justify-center">Loading...</div>;

    // Helper to play
    const handlePlay = (s: number, e: number) => {
        const movieObj: Movie = { ...show, media_type: 'tv' };
        openPlayer(movieObj, s, e);
    };

    return (
        <div className="min-h-screen pb-20 animate-in fade-in duration-500">
            <button
                onClick={() => router.back()}
                className="fixed top-24 left-12 z-50 p-2 bg-black/40 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-colors"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Banner */}
            <div className="relative h-[70vh] w-full">
                {show.backdrop_path ? (
                    <Image
                        src={`${TMDB_IMAGE_URL}${show.backdrop_path}`}
                        alt={show.name || 'Show'}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

                <div className="absolute bottom-0 left-0 px-12 pb-12 w-full z-10">
                    <h1 className="text-6xl font-bold text-rose-50 mb-6 drop-shadow-2xl max-w-4xl leading-tight">{show.name}</h1>

                    <div className="flex items-center gap-6 text-lg text-rose-200 font-medium mb-8">
                        <span className="flex items-center gap-2 text-green-400 font-bold bg-black/40 px-3 py-1 rounded-md backdrop-blur-sm">
                            {(show.vote_average * 10).toFixed(0)}% Match
                        </span>
                        <span className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md backdrop-blur-sm">
                            <Calendar size={18} /> {show.release_date?.split('-')[0]}
                        </span>
                        <span className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md backdrop-blur-sm">
                            {show.number_of_seasons} Seasons
                        </span>
                    </div>

                    <button
                        onClick={() => handlePlay(selectedSeason, lastEpisode || 1)}
                        className="flex items-center gap-4 px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xl transition-all shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95"
                    >
                        <div className="p-1 bg-white rounded-full">
                            <Play fill="currentColor" size={20} className="text-red-600 ml-0.5" />
                        </div>
                        {lastEpisode ? `Resume S${selectedSeason} E${lastEpisode}` : 'Start Watching'}
                    </button>
                </div>
            </div>

            <div className="px-12 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-8">
                <div className="lg:col-span-2 space-y-12">
                    <div className="text-xl text-rose-100/80 leading-relaxed font-light">
                        {show.overview}
                    </div>

                    {/* Episodes Section */}
                    <div>
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <h3 className="text-3xl font-bold text-white">Episodes</h3>

                            <div className="relative group">
                                <select
                                    value={selectedSeason}
                                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                                    className="appearance-none bg-black/40 border border-white/20 text-rose-50 rounded-lg px-6 py-3 pr-12 font-bold text-lg outline-none cursor-pointer focus:border-red-500 hover:bg-white/10 transition-colors"
                                >
                                    {show.seasons?.map((season) => (
                                        <option key={season.season_number} value={season.season_number} className="bg-obsidian text-rose-50">
                                            {season.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-50 pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {loadingSeason ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : seasonDetails ? (
                                seasonDetails.episodes.map((episode) => (
                                    <div
                                        key={episode.id}
                                        onClick={() => handlePlay(selectedSeason, episode.episode_number)}
                                        className="flex gap-6 p-6 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/10 items-center"
                                    >
                                        <div className="text-2xl font-bold text-rose-50/30 w-8 flex-shrink-0 flex items-center justify-center">
                                            {episode.episode_number}
                                        </div>

                                        <div className="relative w-48 h-28 flex-shrink-0 bg-neutral-800 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
                                            {episode.still_path ? (
                                                <Image
                                                    src={`${TMDB_IMAGE_URL}${episode.still_path}`}
                                                    alt={episode.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                    <span className="text-xs text-white/20">No Image</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/50">
                                                    <Play fill="currentColor" size={20} className="text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-xl text-rose-50 group-hover:text-red-500 transition-colors truncate pr-4">
                                                    {episode.name}
                                                </h4>
                                                <span className="text-sm text-rose-50/40 font-mono mt-1">
                                                    {episode.runtime ? `${episode.runtime}m` : ''}
                                                </span>
                                            </div>
                                            <p className="text-base text-rose-100/60 line-clamp-2 leading-relaxed">
                                                {episode.overview}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="space-y-6 text-rose-100/60 border-l border-white/10 pl-8 h-fit sticky top-32">
                    <div>
                        <span className="block text-xs uppercase tracking-wider text-rose-50/40 mb-1">Status</span>
                        <span className="text-rose-50 font-medium">Running</span>
                    </div>
                    <div>
                        <span className="block text-xs uppercase tracking-wider text-rose-50/40 mb-1">Original Name</span>
                        <span className="text-rose-50 font-medium">{show.name}</span>
                    </div>
                    <div>
                        <span className="block text-xs uppercase tracking-wider text-rose-50/40 mb-1">Vote Average</span>
                        <span className="text-rose-50 ">{show.vote_average.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
