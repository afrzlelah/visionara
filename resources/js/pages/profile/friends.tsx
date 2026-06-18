import { Head, Link, usePage, router } from '@inertiajs/react';
import { ChevronLeft, Search, MessageCircle, Check, X } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

type Friend = {
    id: number;
    name: string;
    photo: string;
};

type FriendRequest = {
    id: number;
    user: Friend;
};

export default function Friends() {
    const { friends, requests } = usePage().props as unknown as { friends: Friend[], requests: FriendRequest[] };
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');

    const filteredFriends = friends.filter(friend => 
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const acceptRequest = (id: number) => {
        router.post(`/profile/friends/${id}/accept`, {}, { preserveScroll: true });
    };

    const declineRequest = (id: number) => {
        router.post(`/profile/friends/${id}/decline`, {}, { preserveScroll: true });
    };

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

                {/* Tabs */}
                <div className="flex items-center gap-4 border-b border-neutral-200">
                    <button 
                        onClick={() => setActiveTab('friends')}
                        className={`pb-2 text-sm font-bold transition-all relative ${activeTab === 'friends' ? 'text-[#E1005E]' : 'text-neutral-400'}`}
                    >
                        My Friends
                        {activeTab === 'friends' && (
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E1005E] rounded-t-full" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('requests')}
                        className={`pb-2 text-sm font-bold transition-all relative ${activeTab === 'requests' ? 'text-[#E1005E]' : 'text-neutral-400'}`}
                    >
                        Requests
                        {requests.length > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center size-4 bg-[#E1005E] text-white text-[10px] font-black rounded-full">
                                {requests.length}
                            </span>
                        )}
                        {activeTab === 'requests' && (
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E1005E] rounded-t-full" />
                        )}
                    </button>
                </div>

                {activeTab === 'friends' ? (
                    <>
                        {/* Search Bar */}
                        <div className="w-full relative mt-2">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="size-4 text-neutral-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search friends" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-[10px] bg-neutral-100 border-none text-sm focus:ring-[#E1005E] text-neutral-700 placeholder:text-neutral-400"
                            />
                        </div>

                        {/* Friends List Container */}
                        <div className="w-full bg-[#EFEFEF] rounded-[16px] flex flex-col mt-2 overflow-hidden">
                            
                            {filteredFriends.length > 0 ? filteredFriends.map((friend) => (
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
                                        <button 
                                            onClick={() => alert('Chat integration coming soon!')}
                                            className="size-8 rounded-full bg-[#E1005E] flex items-center justify-center shadow-sm active:scale-95 transition-all"
                                        >
                                            <MessageCircle className="size-4 text-white fill-current" />
                                        </button>
                                    </div>
                                    
                                    {/* Divider */}
                                    <div className="mx-4 border-b border-[#E1005E]/20" />
                                </div>
                            )) : (
                                <div className="p-6 text-center text-sm text-neutral-500 font-medium">
                                    No friends found.
                                </div>
                            )}

                            {/* Add Friends Link */}
                            <div className="flex items-center justify-center py-4 bg-[#EFEFEF]">
                                <Link href="/profile/friends/add" className="text-[13px] font-medium text-[#7DBEE5] active:opacity-70 transition-opacity">
                                    Add Friends
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Requests Tab */
                    <div className="flex flex-col gap-3 mt-2">
                        {requests.length > 0 ? requests.map((req) => (
                            <div key={req.id} className="w-full bg-white border border-neutral-200 rounded-[16px] p-4 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={req.user.photo} 
                                        alt={req.user.name} 
                                        className="size-10 rounded-full object-cover bg-neutral-100"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-neutral-800">
                                            {req.user.name}
                                        </span>
                                        <span className="text-xs text-neutral-500">
                                            Wants to be friends
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => declineRequest(req.id)}
                                        className="size-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 active:scale-95 transition-all"
                                    >
                                        <X className="size-4" />
                                    </button>
                                    <button 
                                        onClick={() => acceptRequest(req.id)}
                                        className="size-8 rounded-full bg-[#E1005E] flex items-center justify-center text-white hover:bg-[#c20050] active:scale-95 transition-all shadow-sm"
                                    >
                                        <Check className="size-4" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-sm text-neutral-500 font-medium">
                                No pending friend requests.
                            </div>
                        )}
                    </div>
                )}

            </div>
        </>
    );
}

Friends.layout = (page: any) => <AppLayout children={page} />;
