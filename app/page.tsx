'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { MovieRow } from '@/components/MovieRow';
import {
  getTrendingMovies,
  getTrendingTVShows,
  getTopRatedMovies,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  Movie
} from '@/lib/tmdb';
import { useModal } from '@/context/ModalContext';
import { getHistory, HistoryItem, removeFromHistory } from '@/lib/history';
import { checkNewEpisodes, NotificationItem } from '@/lib/notifications';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [newEpisodeAlert, setNewEpisodeAlert] = useState<NotificationItem | null>(null);

  const { openPlayer } = useModal();

  useEffect(() => {
    async function loadData() {
      setMovies(await getTrendingMovies());
      setTvShows(await getTrendingTVShows());
      setTopRated(await getTopRatedMovies());
      setActionMovies(await getActionMovies());
      setComedyMovies(await getComedyMovies());
      setHorrorMovies(await getHorrorMovies());
    }
    loadData();
  }, []);

  // ... (rest of history and notification effects unchanged)
  useEffect(() => {
    setHistory(getHistory());

    const handleHistoryUpdate = () => setHistory(getHistory());
    window.addEventListener('history-updated', handleHistoryUpdate);
    return () => window.removeEventListener('history-updated', handleHistoryUpdate);
  }, []);

  useEffect(() => {
    async function check() {
      const updates = await checkNewEpisodes();
      if (updates.length > 0) {
        // Show the first one as an alert
        setNewEpisodeAlert(updates[0]);
        // Auto dismiss after 5s
        setTimeout(() => setNewEpisodeAlert(null), 5000);
      }
    }
    check();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-20 bg-obsidian min-h-screen">

      {/* Alert Toast */}
      {newEpisodeAlert && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right duration-500 fade-out slide-out-to-right">
          <div className="bg-red-600/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-white/10 flex items-start gap-4 max-w-sm">
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">New Episode!</h4>
              <p className="text-sm opacity-90">
                <span className="font-semibold">{newEpisodeAlert.showName}</span> S{newEpisodeAlert.newSeason} E{newEpisodeAlert.newEpisode} is available now.
              </p>
            </div>
            <button onClick={() => setNewEpisodeAlert(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Hero plays directly */}
      <Hero movies={movies} onPlay={(m) => openPlayer(m)} />

      <div className="-mt-32 relative z-20 space-y-4">
        {history.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <MovieRow
              title="Continue Watching"
              movies={history}
              onRemove={(id) => removeFromHistory(id)}
            />
          </div>
        )}
        <MovieRow title="Trending Now" movies={movies} isLarge />
        <MovieRow title="Top Rated Movies" movies={topRated} />
        <MovieRow title="Popular TV Shows" movies={tvShows} />
        <MovieRow title="Action Thrillers" movies={actionMovies} />
        <MovieRow title="Comedies" movies={comedyMovies} />
        <MovieRow title="Scary Movies" movies={horrorMovies} />
      </div>
    </div>
  );
}
