'use client';

export default function LikedPage() {
    return (
        <div className="pt-32 px-12 min-h-screen">
            <h2 className="text-4xl font-bold text-rose-50 mb-6 border-l-4 border-red-600 pl-4">
                Liked Content
            </h2>
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-red-900/30 rounded-2xl bg-red-950/10">
                <p className="text-rose-300/50 italic text-xl">You haven't liked anything yet.</p>
            </div>
        </div>
    );
}
