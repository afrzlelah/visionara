import { Head, Link, usePage, router } from '@inertiajs/react';
import { ChevronLeft, Search, UserPlus } from 'lucide-react';
import { useState, FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';

type SearchedUser = {
    id: number;
    name: string;
    email: string;
    photo_url: string | null;
};

export default function AddFriends() {
    const { users, search } = usePage().props as unknown as { users: SearchedUser[], search: string };
    const [searchQuery, setSearchQuery] = useState(search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/profile/friends/add', { search: searchQuery }, { preserveState: true });
    };

    const sendRequest = (id: number) => {
        router.post('/profile/friends', { friend_id: id }, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Add Friends" />

            <div className="flex flex-col gap-6 w-full font-sans antialiased pb-6 h-full min-h-[80vh]">
                
                {/* Header */}
                <div className="flex items-center gap-1.5 self-start">
                    <Link href="/profile/friends" className="cursor-pointer active:scale-95 transition-all">
                        <ChevronLeft className="size-5 text-[#E1005E]" />
                    </Link>
                    <h1 className="text-xl font-extrabold text-[#E1005E] tracking-tight font-Outfit">
                        Add Friends
                    </h1>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="w-full relative mt-2">
                    <button type="submit" className="absolute inset-y-0 left-3 flex items-center">
                        <Search className="size-4 text-[#E1005E]" />
                    </button>
                    <input 
                        type="text" 
                        placeholder="Search users by name or email" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-white border border-[#E1005E]/30 text-sm focus:ring-[#E1005E] focus:border-[#E1005E] text-neutral-800 placeholder:text-neutral-400 shadow-sm"
                    />
                </form>

                {/* Results Container */}
                <div className="flex flex-col gap-3 mt-2">
                    {searchQuery ? (
                        users.length > 0 ? (
                            users.map(user => (
                                <div key={user.id} className="w-full bg-white border border-neutral-100 rounded-[16px] p-4 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="size-10 rounded-full bg-[#0052FF] p-[2px] shrink-0">
                                            {user.photo_url ? (
                                                <img 
                                                    src={user.photo_url} 
                                                    alt={user.name} 
                                                    className="size-full rounded-full object-cover border-[2px] border-white"
                                                />
                                            ) : (
                                                <div className="size-full rounded-full bg-neutral-200 border-[2px] border-white flex items-center justify-center text-sm font-bold text-[#0052FF]">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-bold text-neutral-800 truncate">
                                                {user.name}
                                            </span>
                                            <span className="text-[11px] text-neutral-500 truncate">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => sendRequest(user.id)}
                                        className="size-9 rounded-full bg-neutral-100 flex items-center justify-center text-[#E1005E] hover:bg-[#E1005E] hover:text-white active:scale-95 transition-all shrink-0 ml-2 shadow-sm border border-neutral-200"
                                        title="Send Friend Request"
                                    >
                                        <UserPlus className="size-[18px]" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center flex flex-col items-center justify-center">
                                <div className="size-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                                    <Search className="size-8 text-neutral-300" />
                                </div>
                                <h3 className="text-sm font-bold text-neutral-700">No users found</h3>
                                <p className="text-xs text-neutral-500 mt-1 text-center max-w-[200px]">
                                    We couldn't find any users matching "{searchQuery}"
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="p-8 text-center flex flex-col items-center justify-center">
                            <div className="size-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                                <UserPlus className="size-8 text-neutral-300" />
                            </div>
                            <h3 className="text-sm font-bold text-neutral-700">Find new friends</h3>
                            <p className="text-xs text-neutral-500 mt-1 text-center max-w-[250px]">
                                Search for your friends by typing their name or email in the search bar above.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}

AddFriends.layout = (page: any) => <AppLayout children={page} />;
