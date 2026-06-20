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
    const isAiVision = url.startsWith('/aivision');
    const isChat = url.startsWith('/chat');
    const isCall = url.startsWith('/call');
    const isProfile = url.startsWith('/profile');
    const isSettings = url.startsWith('/settings');

    return (
        <div className="min-h-screen bg-neutral-50 flex font-sans antialiased">
            {/* Main Canvas Container */}
            <div className="w-full min-h-screen relative flex flex-col overflow-hidden">
                
                {/* Main Content Area */}
                <main className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-10 pb-32 md:pb-36 overflow-y-auto">
                    {children}
                </main>

                {/* Bottom Navigation Bar */}
                <div className={`fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-0 md:pb-6 ${isChat ? 'bg-transparent pointer-events-none' : ''}`}>
                    <div className="relative w-full md:w-auto md:min-w-[480px]">
                        {/* Semicircular Cutout Mask (Mobile only) */}
                        <div className={`absolute -top-9 left-1/2 -translate-x-1/2 size-18 rounded-full z-10 shadow-[0_-6px_10px_rgba(0,0,0,0.01)] md:hidden ${isChat ? 'bg-transparent' : 'bg-white'}`} />
                        
                        {/* Floating Center Phone Button */}
                        <Link 
                            href="/call"
                            className={`absolute -top-7 md:-top-6 left-1/2 -translate-x-1/2 z-20 size-14 md:size-16 rounded-full bg-linear-to-r from-[#E1005E] to-[#0052FF] flex items-center justify-center shadow-[0_6px_16px_rgba(225,0,94,0.35)] border-[3.5px] border-white md:border-4 active:scale-95 hover:opacity-95 transition-all cursor-pointer pointer-events-auto ${isCall ? 'ring-2 ring-offset-2 ring-[#E1005E]' : ''}`}
                        >
                            <Phone className="size-5 md:size-6 text-white fill-current rotate-90 translate-y-[0.5px]" />
                        </Link>

                        {/* Bottom Nav Bar Background */}
                        <nav className="relative h-16 md:h-[72px] bg-[#E1005E] flex items-center justify-between px-6 md:px-8 text-white rounded-t-[24px] md:rounded-[36px] shadow-[0_-4px_16px_rgba(225,0,94,0.15)] md:shadow-[0_8px_32px_rgba(225,0,94,0.25)] z-15 pointer-events-auto">
                            
                            {/* Tab 1: AI Vision (Sparkles) */}
                            <Link 
                                href="/aivision" 
                                className="flex flex-col items-center justify-center w-12 h-full active:scale-95 transition-all relative cursor-pointer"
                            >
                                <Sparkles className={`size-5 md:size-6 transition-all ${isAiVision ? 'scale-110 opacity-100 text-white' : 'opacity-70 text-white/80'}`} />
                                {isAiVision && (
                                    <span className="absolute bottom-1.5 md:bottom-2 size-1.5 bg-white rounded-full transition-all animate-pulse" />
                                )}
                            </Link>

                            {/* Tab 2: Chat (MessageSquare) */}
                            <Link 
                                href="/chat" 
                                className="flex flex-col items-center justify-center w-12 h-full active:scale-95 transition-all relative cursor-pointer mr-6 md:mr-8"
                            >
                                <MessageCircle className={`size-5 md:size-6 transition-all ${isChat ? 'scale-110 opacity-100 text-white' : 'opacity-70 text-white/80'}`} />
                                {isChat && (
                                    <span className="absolute bottom-1.5 md:bottom-2 size-1.5 bg-white rounded-full transition-all animate-pulse" />
                                )}
                            </Link>

                            {/* Spacer for center phone button */}
                            <div className="w-12 md:w-16 h-full" />

                            {/* Tab 3: Profile (User) */}
                            <Link 
                                href="/profile" 
                                className="flex flex-col items-center justify-center w-12 h-full active:scale-95 transition-all relative cursor-pointer ml-6 md:ml-8"
                            >
                                <User className={`size-5 md:size-6 transition-all ${isProfile ? 'scale-110 opacity-100 text-white' : 'opacity-70 text-white/80'}`} />
                                {isProfile && (
                                    <span className="absolute bottom-1.5 md:bottom-2 size-1.5 bg-white rounded-full transition-all animate-pulse" />
                                )}
                            </Link>

                            {/* Tab 4: Settings (Gear) */}
                            <Link 
                                href="/settings" 
                                className="flex flex-col items-center justify-center w-12 h-full active:scale-95 transition-all relative cursor-pointer"
                            >
                                <Settings className={`size-5 md:size-6 transition-all ${isSettings ? 'scale-110 opacity-100 text-white' : 'opacity-70 text-white/80'}`} />
                                {isSettings && (
                                    <span className="absolute bottom-1.5 md:bottom-2 size-1.5 bg-white rounded-full transition-all animate-pulse" />
                                )}
                            </Link>

                        </nav>
                    </div>
                </div>

            </div>
        </div>
    );
}
