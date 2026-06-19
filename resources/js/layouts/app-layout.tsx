import { Link, usePage } from '@inertiajs/react';
import { Sparkles, MessageCircle, Phone, User, Settings } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const url = usePage().url;

    // Check which tab is active
    const isDashboard = url === '/dashboard';
    const isChat = url.startsWith('/chat');
    const isCall = url.startsWith('/call');
    const isProfile = url.startsWith('/profile');
    const isSettings = url.startsWith('/settings');

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center font-sans antialiased">
            {/* Mobile Canvas Container */}
            <div className="w-full max-w-md min-h-screen bg-white shadow-2xl relative flex flex-col justify-between pb-20 overflow-hidden">
                
                {/* Main Content Area */}
                <main className="flex-1 w-full p-6 overflow-y-auto">
                    {children}
                </main>

                {/* Bottom Navigation Bar */}
                <div className={`absolute bottom-0 left-0 right-0 z-40 ${isChat ? 'bg-transparent pointer-events-none' : 'bg-white'}`}>
                    {/* Semicircular Cutout Mask */}
                    <div className={`absolute -top-9 left-1/2 -translate-x-1/2 size-18 rounded-full z-10 shadow-[0_-6px_10px_rgba(0,0,0,0.01)] ${isChat ? 'bg-transparent' : 'bg-white'}`} />
                    
                    {/* Floating Center Phone Button */}
                    <Link 
                        href="/call"
                        className={`absolute -top-7 left-1/2 -translate-x-1/2 z-20 size-14 rounded-full bg-linear-to-r from-[#E1005E] to-[#0052FF] flex items-center justify-center shadow-[0_6px_16px_rgba(225,0,94,0.35)] border-[3.5px] border-white active:scale-95 hover:opacity-95 transition-all cursor-pointer pointer-events-auto ${isCall ? 'ring-2 ring-offset-2 ring-[#E1005E]' : ''}`}
                    >
                        <Phone className="size-5 text-white fill-current rotate-90 translate-y-[0.5px]" />
                    </Link>

                    {/* Bottom Nav Bar Background */}
                    <nav className="relative h-16 bg-[#E1005E] flex items-center justify-between px-6 text-white rounded-t-[24px] shadow-[0_-4px_16px_rgba(225,0,94,0.15)] z-15 pointer-events-auto">
                        
                        {/* Tab 1: Dashboard (Sparkles) */}
                        <Link 
                            href="/dashboard" 
                            className="flex flex-col items-center justify-center w-12 h-full active:scale-95 transition-all relative cursor-pointer"
                        >
                            <Sparkles className={`size-5 transition-all ${isDashboard ? 'scale-110 opacity-100 text-white' : 'opacity-70 text-white/80'}`} />
                            {isDashboard && (
                                <span className="absolute bottom-1.5 size-1.5 bg-white rounded-full transition-all animate-pulse" />
                            )}
                        </Link>

                        {/* Tab 2: Chat (MessageSquare) */}
                        <Link 
                            href="/chat" 
                            className="flex flex-col items-center justify-center w-12 h-full active:scale-95 transition-all relative cursor-pointer mr-6"
                        >
                            <MessageCircle className={`size-5 transition-all ${isChat ? 'scale-110 opacity-100 text-white' : 'opacity-70 text-white/80'}`} />
                            {isChat && (
                                <span className="absolute bottom-1.5 size-1.5 bg-white rounded-full transition-all animate-pulse" />
                            )}
                        </Link>

                        {/* Spacer for center phone button */}
                        <div className="w-12 h-full" />

                        {/* Tab 3: Profile (User) */}
                        <Link 
                            href="/profile" 
                            className="flex flex-col items-center justify-center w-12 h-full active:scale-95 transition-all relative cursor-pointer ml-6"
                        >
                            <User className={`size-5 transition-all ${isProfile ? 'scale-110 opacity-100 text-white' : 'opacity-70 text-white/80'}`} />
                            {isProfile && (
                                <span className="absolute bottom-1.5 size-1.5 bg-white rounded-full transition-all animate-pulse" />
                            )}
                        </Link>

                        {/* Tab 4: Settings (Gear) */}
                        <Link 
                            href="/settings" 
                            className="flex flex-col items-center justify-center w-12 h-full active:scale-95 transition-all relative cursor-pointer"
                        >
                            <Settings className={`size-5 transition-all ${isSettings ? 'scale-110 opacity-100 text-white' : 'opacity-70 text-white/80'}`} />
                            {isSettings && (
                                <span className="absolute bottom-1.5 size-1.5 bg-white rounded-full transition-all animate-pulse" />
                            )}
                        </Link>

                    </nav>
                </div>

            </div>
        </div>
    );
}
