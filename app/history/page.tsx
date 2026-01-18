'use client';
import { useState, useEffect } from 'react';
import { MovieRow } from '@/components/MovieRow';
import { getHistory, HistoryItem, removeFromHistory } from '@/lib/history';
import { useModal } from '@/context/ModalContext';

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        setHistory(getHistory());

        const handleHistoryUpdate = () => setHistory(getHistory());
        window.addEventListener('history-updated', handleHistoryUpdate);
        return () => window.removeEventListener('history-updated', handleHistoryUpdate);
    }, []);

    const handleRemove = (id: number) => {
        removeFromHistory(id);
    };

    return (
        <div className="flex flex-col gap-12 pt-32 pb-20 animate-in fade-in duration-500 min-h-screen">
            <div className="px-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 border-l-4 border-red-600 pl-4">Watch History</h1>
                    <p className="text-white/40 pl-5">Continue where you left off.</p>
                </div>
            </div>

            {history.length > 0 ? (
                <div className="-mt-4">
                    <MovieRow
                        title="Your History"
                        movies={history}
                        onRemove={handleRemove}
                    />
                </div>
            ) : (
                <div className="px-12 text-white/30 text-lg italic pl-16">
                    No history yet. Start watching something!
                </div>
            )}
        </div>
    );
}
