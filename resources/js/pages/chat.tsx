import { Head } from '@inertiajs/react';
import { Search, MessageCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

function EmptyState({ card = false }: { card?: boolean }) {
    return (
        <div
            className={`flex flex-col items-center justify-center text-center ${
                card ? 'h-full w-full rounded-[20px] border border-neutral-200 bg-white p-8' : 'w-full flex-1 px-4 -mt-10'
            }`}
        >
            <div className="relative mb-8 flex size-56 items-center justify-center md:size-48">
                <div className="absolute inset-0 rounded-full bg-brand-red/10" />
                <div className="absolute inset-2.5 z-10 rounded-full border-[3px] border-white shadow-sm" />
                <div className="relative z-20 flex size-48 items-center justify-center rounded-full bg-brand-red shadow-inner md:size-40">
                    <MessageCircle className="size-24 fill-current text-white md:size-20" />
                    <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 translate-y-[-60%] gap-2">
                        <div className="size-2.5 rounded-full bg-brand-lime" />
                        <div className="size-2.5 rounded-full bg-brand-lime" />
                        <div className="size-2.5 rounded-full bg-brand-lime" />
                    </div>
                </div>
            </div>

            <h2 className="mb-3 text-[22px] font-extrabold tracking-tight text-brand-ink md:text-2xl">
                There are no chats for this
                <br />
                profile yet!
            </h2>

            <p className="max-w-70 text-sm leading-relaxed font-medium text-neutral-500 md:max-w-sm md:text-base">
                There are no user chats for this profile yet. Get active on Padhang now!
            </p>
        </div>
    );
}

export default function ChatPage() {
    return (
        <>
            <Head title="Chats" />

            <div className="flex w-full flex-col font-sans antialiased selection:bg-brand-red/10 selection:text-brand-red md:h-[calc(100vh-80px)] md:flex-row md:gap-6">
                {/* Mobile: header dengan tombol pencarian */}
                <div className="flex w-full items-center justify-between self-start md:hidden">
                    <h1 className="text-3xl font-extrabold tracking-tight text-brand-red">Chats</h1>
                    <button className="-mr-2 rounded-full p-2 transition-colors hover:bg-neutral-100 active:scale-95">
                        <Search className="size-6 stroke-[2.5] text-brand-ink" />
                    </button>
                </div>

                {/* Mobile: empty state di tengah */}
                <div className="flex h-[calc(100vh-140px)] w-full flex-col md:hidden">
                    <EmptyState />
                </div>

                {/* Desktop: panel daftar percakapan */}
                <aside className="hidden w-85 shrink-0 flex-col gap-5 rounded-[20px] border border-neutral-200 bg-white p-6 md:flex">
                    <h1 className="text-2xl font-extrabold tracking-tight text-brand-red">Chats</h1>

                    <div className="flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-3">
                        <Search className="size-4 text-neutral-500" />
                        <span className="text-sm text-neutral-500">Cari percakapan</span>
                    </div>

                    <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
                        Belum ada percakapan
                    </div>
                </aside>

                {/* Desktop: area percakapan */}
                <section className="hidden min-w-0 flex-1 md:flex">
                    <EmptyState card />
                </section>
            </div>
        </>
    );
}

ChatPage.layout = (page: any) => <AppLayout children={page} />;