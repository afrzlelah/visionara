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
                <div className="flex items-center gap-1.5 self-start mb-6">
                    <h1 className="text-xl font-extrabold text-[#E1005E] tracking-tight font-Outfit">
                        Profile User
                    </h1>
                    <ChevronDown className="size-4 text-[#E1005E]" />
                </div>

                {/* Profile Card Container */}
                <div className="w-full pt-4 pb-5 px-5 rounded-[16px] border border-[#E1005E] bg-white relative shadow-sm mt-8">
                    
                    {/* Avatar overlapping the top border */}
                    <div className="absolute -top-10 left-5">
                        <div className="size-20 rounded-full bg-linear-to-tr from-[#E1005E] via-[#5C2CD5] to-[#0052FF] p-[2px] shadow-sm">
                            {user.photo_url ? (
                                <img 
                                    src={user.photo_url} 
                                    alt={user.name} 
                                    className="size-full rounded-full object-cover border-[3px] border-white"
                                />
                            ) : (
                                <div className="size-full rounded-full bg-neutral-200 flex items-center justify-center border-[3px] border-white text-2xl font-black text-[#E1005E] font-Outfit">
                                    {userInitial}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Details Next to Avatar */}
                    <div className="ml-[90px] pt-1 flex flex-col gap-0.5">
                        <h2 className="text-lg font-bold text-[#E1005E] leading-tight font-Outfit truncate">
                            {user.name}
                        </h2>
                        <p className="text-[11px] font-medium text-[#E1005E] tracking-wide">
                            {user.gender || 'Gender'} <span className="mx-1 opacity-50">|</span> {user.age || 'Age'}
                        </p>
                    </div>

                    {/* Bio Paragraph */}
                    <div className="mt-8">
                        <p className="text-[13px] text-neutral-500 leading-relaxed">
                            {user.bio || 'Bio....'}
                        </p>
                    </div>

                </div>

                {/* Edit & Share Buttons wrapped in bordered container */}
                <div className="w-full p-4 rounded-[16px] border border-[#E1005E] bg-white flex items-center gap-4 shadow-sm">
                    
                    <Link 
                        href="/profile/edit"
                        className="flex-1 py-2.5 rounded-[8px] bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] transition-all font-semibold text-[#E1005E] text-center text-[13px] select-none cursor-pointer"
                    >
                        Edit Profile
                    </Link>

                    <Link
                        href="/profile/share"
                        className="flex-1 py-2.5 rounded-[8px] bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] transition-all font-semibold text-[#E1005E] text-center text-[13px] select-none cursor-pointer"
                    >
                        Share Profile
                    </Link>

                </div>

                {/* Friends Box Container */}
                <Link 
                    href="/profile/friends"
                    className="w-full p-4 rounded-[16px] border border-[#E1005E] bg-white hover:bg-neutral-50 transition-colors cursor-pointer select-none flex items-center justify-between shadow-sm block"
                >
                    <span className="text-[13px] font-bold text-[#E1005E]">
                        Friends
                    </span>
                    <ChevronRight className="size-4 text-[#E1005E]" />
                </Link>

            </div>
        </>
    );
}

Profile.layout = (page: any) => <AppLayout children={page} />;
