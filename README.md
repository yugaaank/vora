# v0ra

A **Next.js-based video streaming platform** focused on fast content discovery and instant playback — not a Netflix clone.

Live demo: [https://v0ra.vercel.app/](https://v0ra.vercel.app/)

---

## What This Is (and What It Isn’t)

### This is:

* A modern Next.js streaming site
* API-driven, no hardcoded content
* Dynamic routing for movies & TV shows
* Fast navigation with minimal friction
* Built for exploration, not endless scrolling

### This is not:

* A Netflix clone
* A UI copy of any existing platform
* A recommendation-engine-heavy product
* A bloated auth-driven SaaS app

---

## Features

* 🎬 Movie & TV metadata from **TMDB**
* 📺 Video streaming via an external video API
* 🔗 Dynamic routes for movies and shows
* ⚡ Fast page loads using Next.js
* 🎨 Modern, responsive UI
* 🌙 Clean, distraction-free layout
* 🧭 Content-first navigation
* 🔄 Server-side and client-side data fetching

---

## Tech Stack

* **Framework:** Next.js
* **Language:** JavaScript / TypeScript
* **Styling:** CSS / Tailwind / Custom styles
* **APIs:**

  * TMDB API (metadata)
  * External Video Streaming API (playback)
* **Deployment:** Vercel

---

## How It Works

1. **TMDB API** provides movies, TV shows, posters, ratings, and descriptions
2. **Dynamic Routing**

   * `/movie/[id]`
   * `/tv/[id]`
3. **Video API** resolves a playable stream using the content ID
4. **UI Layer** adapts dynamically based on content type

---

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_VIDEO_API_URL=your_video_api_endpoint
```

---

## Getting Started

```bash
git clone https://github.com/your-username/v0ra.git
cd v0ra
npm install
npm run dev
```

Visit `http://localhost:3000` to view the app.

---

## Deployment

Optimized for **Vercel**.

```bash
npm run build
npm run start
```

---

## Legal Note

* This project does **not** host any video content
* All metadata is provided by **TMDB**
* Streaming links are fetched from third-party APIs
* Intended for educational and experimental use

---

## Credits

* TMDB for movie and TV data
* Next.js for the framework
* Vercel for hosting

---

## Author

Built by **Yug**
