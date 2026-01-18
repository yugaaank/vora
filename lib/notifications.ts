import { getHistory } from './history';
import { getTVDetails } from './tmdb';

export interface NotificationItem {
    showId: number;
    showName: string;
    newSeason: number;
    newEpisode: number;
    posterPath?: string;
    // Optional details for richer UI
    episodeName?: string;
    backdropPath?: string;
}

export async function checkNewEpisodes(): Promise<NotificationItem[]> {
    const history = getHistory();
    // Filter for TV shows that have a season/episode logged
    const distinctShows = history.filter(h => h.media_type === 'tv' && h.season && h.episode);

    // Deduplicate by ID
    const uniqueShows = Array.from(new Set(distinctShows.map(s => s.id)))
        .map(id => distinctShows.find(s => s.id === id)!);

    const notifications: NotificationItem[] = [];

    for (const show of uniqueShows) {
        try {
            const details = await getTVDetails(show.id);
            if (!details || !details.last_episode_to_air) continue;

            const latest = details.last_episode_to_air;
            if (!latest.air_date) continue;

            // Check if aired recently (last 14 days)
            const airDate = new Date(latest.air_date);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - airDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 14) {
                // Check if the user has already seen this or if it's ahead
                // For simplicity, if it's effectively "new" (released recently) and ahead of what they watched, we notify.
                // Or just notify if it's recent, assuming they might have missed it. 
                // Let's stick to the recent check + strictly ahead of history.

                const lastWatchedSeason = show.season || 0;
                const lastWatchedEpisode = show.episode || 0;

                const isNewer = latest.season_number > lastWatchedSeason ||
                    (latest.season_number === lastWatchedSeason && latest.episode_number > lastWatchedEpisode);

                if (isNewer) {
                    notifications.push({
                        showId: show.id,
                        showName: show.name || show.title || 'Unknown Show',
                        newSeason: latest.season_number,
                        newEpisode: latest.episode_number,
                        posterPath: show.poster_path || undefined,
                        episodeName: latest.name,
                        backdropPath: latest.still_path || undefined
                    });
                }
            }
        } catch (e) {
            console.error(`Failed to check notifications for show ${show.id}`, e);
        }
    }

    return notifications;
}
