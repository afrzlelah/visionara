import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Share2, Edit3, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Profile() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <>
            <Head title="Profile User" />

            <div className="flex flex-col gap-6 w-full font-sans antialiased pb-6 selection:bg-[#E1005E]/10 selection:text-[#E1005E]">
                
                {/* Header */}
                <div className="flex items-center gap-1.5 self-start">
                    <h1 className="text-2xl font-extrabold text-[#E1005E] tracking-tight font-Outfit">
                        Profile User
                    </h1>
                    <ChevronDown className="size-6 text-[#E1005E] translate-y-[2px]" />
                </div>

                {/* Profile Card Container */}
                <div className="w-full p-5 rounded-[24px] border-2 border-[#E1005E] bg-white relative flex flex-col gap-4 shadow-[0_4px_16px_rgba(225,0,94,0.03)]">
                    
                    <div className="flex items-start gap-4">
                        {/* Avatar Wrapper with blue/purple/pink gradient ring */}
                        <div className="relative size-20 rounded-full p-[3px] bg-linear-to-tr from-[#E1005E] via-[#5C2CD5] to-[#0052FF] flex items-center justify-center shrink-0">
                            {user.photo_url ? (
                                <img 
                                    src={user.photo_url} 
                                    alt={user.name} 
                                    className="size-full rounded-full object-cover border border-white"
                                />
                            ) : (
                                <div className="size-full rounded-full bg-neutral-100 flex items-center justify-center border border-white text-2xl font-black text-[#E1005E] font-Outfit">
                                    {userInitial}
                                </div>
                            )}
                        </div>

                        {/* User Details */}
                        <div className="flex flex-col gap-1.5 pt-1.5">
                            <h2 className="text-xl font-bold text-[#E1005E] leading-tight font-Outfit truncate max-w-[200px]">
                                {user.name}
                            </h2>
                            <p className="text-xs font-extrabold text-[#E1005E]/80 tracking-wide font-sans">
                                {user.role === 'volunteer' ? 'Volunteer' : 'Support Seeker'}
                            </p>
                            <p className="text-xs font-semibold text-neutral-500 font-sans">
                                {user.phone || 'No phone number'}
                            </p>
                        </div>
                    </div>

                    {/* Bio Paragraph */}
                    <div className="mt-1 pl-1">
                        <p className="text-xs text-neutral-400 font-bold italic leading-relaxed">
                            Bio: Always ready to help and support those in need. Compassion is our guiding light.
                        </p>
                    </div>

                </div>

                {/* Edit & Share Buttons wrapped in bordered container */}
                <div className="w-full p-4 rounded-[20px] border border-[#E1005E]/50 bg-white flex items-center gap-4">
                    
                    <Link 
                        href="/settings/profile"
                        className="flex-1 py-3 rounded-[14px] bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] transition-all font-bold text-[#E1005E] text-center text-xs md:text-sm flex items-center justify-center gap-1.5 select-none cursor-pointer"
                    >
                        <Edit3 className="size-4" />
                        Edit Profile
                    </Link>

                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: user.name,
                                    text: `Check out ${user.name}'s profile on Optira!`,
                                    url: window.location.href,
                                });
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Profile link copied to clipboard!');
                            }
                        }}
                        className="flex-1 py-3 rounded-[14px] bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] transition-all font-bold text-[#E1005E] text-center text-xs md:text-sm flex items-center justify-center gap-1.5 select-none cursor-pointer"
                    >
                        <Share2 className="size-4" />
                        Share Profile
                    </button>

                </div>

                {/* Friends Box Container */}
                <div className="w-full p-4.5 rounded-[20px] border border-[#E1005E]/50 bg-white hover:bg-neutral-50 transition-colors cursor-pointer select-none">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-[#E1005E]/10 flex items-center justify-center">
                                <Users className="size-4.5 text-[#E1005E]" />
                            </div>
                            <span className="text-sm font-extrabold text-[#E1005E]">
                                Friends
                            </span>
                        </div>
                        <ChevronRight className="size-5 text-[#E1005E]" />
                    </div>
                </div>

            </div>
        </>
    );
}

Profile.layout = (page: any) => <AppLayout children={page} />;
