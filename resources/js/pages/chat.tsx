import { Head } from '@inertiajs/react';
import { Search, MessageCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function ChatPage() {
    return (
        <>
            <Head title="Chats" />
            
            <div className="flex flex-col h-[calc(100vh-140px)] w-full font-sans antialiased pb-6 selection:bg-[#E1005E]/10 selection:text-[#E1005E]">
                
                {/* Header */}
                <div className="flex items-center justify-between self-start w-full">
                    <h1 className="text-3xl font-extrabold text-[#E1005E] tracking-tight">
                        Chats
                    </h1>
                    <button className="p-2 -mr-2 rounded-full hover:bg-neutral-100 transition-colors active:scale-95">
                        <Search className="size-6 text-neutral-800 stroke-[2.5]" />
                    </button>
                </div>

                {/* Empty State Content */}
                <div className="flex flex-col items-center justify-center flex-1 w-full text-center px-4 -mt-10">
                    
                    {/* Big Pink Circle with Chat Icon */}
                    <div className="relative size-56 mb-8 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[#fce4ec] opacity-60"></div>
                        <div className="absolute inset-[10px] rounded-full border-[3px] border-white z-10 shadow-sm"></div>
                        <div className="relative z-20 bg-[#f8bbd0] rounded-full size-48 flex items-center justify-center shadow-inner">
                            <MessageCircle className="size-24 text-white fill-current" />
                            <div className="absolute flex gap-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]">
                                <div className="size-2.5 rounded-full bg-[#f8bbd0]" />
                                <div className="size-2.5 rounded-full bg-[#f8bbd0]" />
                                <div className="size-2.5 rounded-full bg-[#f8bbd0]" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-[22px] font-extrabold text-neutral-900 mb-3 tracking-tight">
                        There are no chats for this<br/>profile yet!
                    </h2>
                    
                    <p className="text-sm font-medium text-neutral-500 leading-relaxed max-w-[280px]">
                        There are no user chats for this profile yet. Get active on Optira now!
                    </p>

                </div>

            </div>
        </>
    );
}

ChatPage.layout = (page: any) => <AppLayout children={page} />;
