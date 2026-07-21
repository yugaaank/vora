# v0ra

A video streaming platform built with Next.js. Pulls movie and TV metadata from TMDB, streams via an external video API. Content-first navigation, fast page loads, no bloat.

Live: [v0ra.vercel.app](https://v0ra.vercel.app/)

## Install

```bash
git clone https://github.com/yugaaank/vora
cd vora
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_VIDEO_API_URL=your_video_api_endpoint
```

## Usage

```bash
npm run dev
```

Open `http://localhost:3000`.

## Tech

Next.js, TypeScript, Tailwind CSS. TMDB API for metadata, external video API for playback. Deployed on Vercel.

## License

MIT
