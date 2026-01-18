'use client';

import { Home, Compass, Film, History, Heart, Bell, Tv, User } from 'lucide-react';
import { checkNewEpisodes, NotificationItem } from '@/lib/notifications';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Tv, label: 'TV Shows', href: '/tv' },
    { icon: Film, label: 'Movies', href: '/movies' },
    { icon: History, label: 'History', href: '/history' },
    { icon: Heart, label: 'Liked', href: '/liked' },
];

export function Sidebar() {
    const pathname = usePathname();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        checkNewEpisodes().then(setNotifications);
    }, []);

    return (
        <aside className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col items-center py-6 px-2 z-50 glass-panel rounded-full min-h-[60vh] justify-between transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02]">
            <div className="mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30 ring-2 ring-white/10" />
            </div>

            <nav className="flex-1 flex flex-col gap-6 w-full items-center justify-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={clsx(
                                'p-3 rounded-full transition-all duration-300 group relative',
                                isActive
                                    ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />

                            {isActive && (
                                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                            )}

                            {/* Tooltip */}
                            <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 backdrop-blur-md rounded-md text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8 relative">
                <button
                    onClick={() => notifications.length > 0 && setShowPopup(!showPopup)}
                    className={clsx(
                        "p-3 rounded-full hover:bg-white/10 transition-colors relative",
                        notifications.length > 0 ? "text-white hover:text-red-400" : "text-white/40"
                    )}
                >
                    <Bell size={22} />
                    {notifications.length > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-black" />
                    )}
                </button>

                {/* Notification Popup */}
                {showPopup && notifications.length > 0 && (
                    <div className="absolute left-full bottom-0 ml-4 w-64 bg-black/90 border border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-2xl">
                        <h4 className="text-white font-bold mb-2 text-sm">New Episodes</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                            {notifications.map((notif) => (
                                <Link
                                    href={`/tv/${notif.showId}`}
                                    key={notif.showId}
                                    className="block text-xs text-white/70 border-b border-white/5 pb-2 last:border-0 last:pb-0 hover:bg-white/5 transition-colors rounded px-2 -mx-2"
                                    onClick={() => setShowPopup(false)}
                                >
                                    <p className="font-semibold text-rose-300">{notif.showName}</p>
                                    <p>S{notif.newSeason} E{notif.newEpisode} is out!</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
