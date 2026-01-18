export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL;

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    media_type?: 'movie' | 'tv';
    name?: string; // For TV shows
}

export async function getTrendingMovies(): Promise<Movie[]> {
    if (!TMDB_API_KEY || TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        console.warn('TMDB API Key is missing. Returning mock data.');
        return MOCK_MOVIES;
    }

    try {
        const res = await fetch(
            `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}

export async function getMovieDetails(id: number | string): Promise<Movie | null> {
    if (!TMDB_API_KEY) return null;
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
            { next: { revalidate: 3600 } }
        );
        if (!response.ok) {
            console.error(`Error fetching movie details for ID ${id}: ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

export async function searchMovies(query: string): Promise<Movie[]> {
    if (!TMDB_API_KEY) return [];
    try {
        const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Error searching movies", error);
        return [];
    }
}

export interface TVShowDetails extends Movie {
    number_of_seasons: number;
    seasons: {
        season_number: number;
        episode_count: number;
        name: string;
    }[];
    number_of_episodes: number;
    last_episode_to_air?: {
        air_date: string;
        episode_number: number;
        id: number;
        name: string;
        overview: string;
        production_code: string;
        runtime: number;
        season_number: number;
        show_id: number;
        still_path: string;
        vote_average: number;
        vote_count: number;
    };
}

export interface Episode {
    id: number;
    name: string;
    overview: string;
    still_path: string | null;
    vote_average: number;
    episode_number: number;
    season_number: number;
    runtime?: number;
    air_date?: string;
}

export interface SeasonDetails {
    _id: string;
    air_date: string;
    episodes: Episode[];
    name: string;
    overview: string;
    id: number;
    poster_path: string | null;
    season_number: number;
}

export async function getTVDetails(id: number): Promise<TVShowDetails | null> {
    if (!TMDB_API_KEY) return null;
    try {
        const res = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching TV details", error);
        return null;
    }
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<SeasonDetails | null> {
    if (!TMDB_API_KEY) return null;
    try {
        const res = await fetch(`${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching TV season details", error);
        return null;
    }
}

export async function getPopularMovies(): Promise<Movie[]> {
    if (!TMDB_API_KEY) return [];
    try {
        const res = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching popular movies", error);
        return [];
    }
}

export async function getTopRatedMovies(): Promise<Movie[]> {
    if (!TMDB_API_KEY) return [];
    try {
        const res = await fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching top rated movies", error);
        return [];
    }
}

export async function getTrendingTVShows(): Promise<Movie[]> {
    if (!TMDB_API_KEY) return [];
    try {
        const res = await fetch(`${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching trending TV shows", error);
        return [];
    }
}

export async function searchMulti(query: string): Promise<Movie[]> {
    if (!TMDB_API_KEY) return [];
    try {
        const res = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        // Filter for only movie and tv
        const results = data.results?.filter((item: Movie) => item.media_type === 'movie' || item.media_type === 'tv') || [];
        return results;
    } catch (error) {
        console.error("Error searching multi", error);
        return [];
    }
}

// Genre IDs
const GENRES = {
    ACTION: 28,
    ADVENTURE: 12,
    COMEDY: 35,
    CRIME: 80,
    DOCUMENTARY: 99,
    DRAMA: 18,
    FAMILY: 10751,
    FANTASY: 14,
    HISTORY: 36,
    HORROR: 27,
    MUSIC: 10402,
    MYSTERY: 9648,
    ROMANCE: 10749,
    SCIFI: 878,
    THRILLER: 53,
    WAR: 10752,
    WESTERN: 37,
    TV_ACTION_ADVENTURE: 10759,
    TV_COMEDY: 35,
    TV_CRIME: 80,
    TV_DRAMA: 18,
    TV_FAMILY: 10751,
    TV_KIDS: 10762,
    TV_MYSTERY: 9648,
    TV_NEWS: 10763,
    TV_REALITY: 10764,
    TV_SCIFI_FANTASY: 10765,
    TV_SOAP: 10766,
    TV_TALK: 10767,
    TV_WAR_POLITICS: 10768,
    TV_WESTERN: 37,
};

async function fetchFromTMDB(endpoint: string, params: string = ''): Promise<Movie[]> {
    if (!TMDB_API_KEY) return [];
    try {
        const res = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}${params}&language=en-US`);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
}

export async function getUpcomingMovies() { return fetchFromTMDB('/movie/upcoming'); }

// Genre Fetchers (Movies)
export async function getActionMovies() { return fetchFromTMDB('/discover/movie', `&with_genres=${GENRES.ACTION}`); }
export async function getComedyMovies() { return fetchFromTMDB('/discover/movie', `&with_genres=${GENRES.COMEDY}`); }
export async function getHorrorMovies() { return fetchFromTMDB('/discover/movie', `&with_genres=${GENRES.HORROR}`); }
export async function getRomanceMovies() { return fetchFromTMDB('/discover/movie', `&with_genres=${GENRES.ROMANCE}`); }
export async function getDocumentaries() { return fetchFromTMDB('/discover/movie', `&with_genres=${GENRES.DOCUMENTARY}`); }
export async function getSciFiMovies() { return fetchFromTMDB('/discover/movie', `&with_genres=${GENRES.SCIFI}`); }

// TV Fetchers
export async function getTopRatedTV() { return fetchFromTMDB('/tv/top_rated'); }
export async function getTVActionAdventure() { return fetchFromTMDB('/discover/tv', `&with_genres=${GENRES.TV_ACTION_ADVENTURE}`); }
export async function getTVComedy() { return fetchFromTMDB('/discover/tv', `&with_genres=${GENRES.TV_COMEDY}`); }
export async function getTVDrama() { return fetchFromTMDB('/discover/tv', `&with_genres=${GENRES.TV_DRAMA}`); }
export async function getTVSciFiFantasy() { return fetchFromTMDB('/discover/tv', `&with_genres=${GENRES.TV_SCIFI_FANTASY}`); }

// Fallback Mock Data
const MOCK_MOVIES: Movie[] = [
    {
        id: 1,
        title: 'Neon Rain',
        overview: 'A cyberpunk noir thriller set in 2089.',
        poster_path: null,
        backdrop_path: null,
        vote_average: 8.5,
        release_date: '2025-01-01'
    },
    {
        id: 2,
        title: 'Void Walker',
        overview: 'Deep space exploration gone wrong.',
        poster_path: null,
        backdrop_path: null,
        vote_average: 7.9,
        release_date: '2025-02-15'
    }
];
