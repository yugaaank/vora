import { Movie } from './tmdb';

export interface HistoryItem extends Movie {
    lastWatched: number; // Timestamp
    season?: number;
    episode?: number;
    progress?: number; // 0 to 1
    currentTime?: number; // seconds
    duration?: number; // seconds
}

const HISTORY_KEY = 'vora_watch_history';

export function getHistory(): HistoryItem[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse history", e);
        return [];
    }
}

export function addToHistory(movie: Movie, season?: number, episode?: number, progress: number = 0, currentTime: number = 0, duration: number = 0) {
    if (typeof window === 'undefined') return;

    try {
        const history = getHistory();

        // Remove existing entry for this movie if it exists (to move it to top)
        const filtered = history.filter(h => h.id !== movie.id);

        const newItem: HistoryItem = {
            ...movie,
            lastWatched: Date.now(),
            season,
            episode,
            progress,
            currentTime,
            duration
        };

        // Add to beginning
        const updated = [newItem, ...filtered].slice(0, 20); // Keep last 20 items

        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

        // Dispatch event for other components to update if needed
        window.dispatchEvent(new Event('history-updated'));
    } catch (e) {
        console.error("Failed to save history", e);
    }
}

export function removeFromHistory(movieId: number) {
    if (typeof window === 'undefined') return;

    try {
        const history = getHistory();
        const updated = history.filter(h => h.id !== movieId);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('history-updated'));
    } catch (e) {
        console.error("Failed to remove from history", e);
    }
}
