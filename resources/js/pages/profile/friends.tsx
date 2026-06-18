import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Search, MessageCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Friends() {
    // Mock friends data
    const friends = [
        { id: 1, name: 'Friends 1', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
        { id: 2, name: 'Friends 2', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
    ];

    return (
        <>
            <Head title="Friends" />

            <div className="flex flex-col gap-6 w-full font-sans antialiased pb-6 h-full min-h-[80vh]">
                
                {/* Header */}
                <div className="flex items-center gap-1.5 self-start">
                    <Link href="/profile" className="cursor-pointer active:scale-95 transition-all">
                        <ChevronLeft className="size-5 text-[#E1005E]" />
                    </Link>
                    <h1 className="text-xl font-extrabold text-[#E1005E] tracking-tight font-Outfit">
                        Friends
                    </h1>
                </div>

                {/* Search Bar */}
                <div className="w-full relative mt-2">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="size-4 text-neutral-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="w-full pl-9 pr-4 py-2.5 rounded-[10px] bg-neutral-100 border-none text-sm focus:ring-0 text-neutral-700 placeholder:text-neutral-400"
                    />
                </div>

                {/* Friends List Container */}
                <div className="w-full bg-[#EFEFEF] rounded-[16px] flex flex-col mt-2">
                    
                    {friends.map((friend, index) => (
                        <div key={friend.id}>
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={friend.photo} 
                                        alt={friend.name} 
                                        className="size-11 rounded-full object-cover bg-white"
                                    />
                                    <span className="text-[13px] font-semibold text-neutral-700">
                                        {friend.name}
                                    </span>
                                </div>
                                <button className="size-8 rounded-full bg-[#E1005E] flex items-center justify-center shadow-sm active:scale-95 transition-all">
                                    <MessageCircle className="size-4 text-white fill-current" />
                                </button>
                            </div>
                            
                            {/* Divider */}
                            <div className="mx-4 border-b border-[#E1005E]/20" />
                        </div>
                    ))}

                    {/* Add Friends Link */}
                    <div className="flex items-center justify-center py-4">
                        <button className="text-[13px] font-medium text-[#7DBEE5] active:opacity-70 transition-opacity">
                            Add Friends
                        </button>
                    </div>

                </div>

            </div>
        </>
    );
}

Friends.layout = (page: any) => <AppLayout children={page} />;
