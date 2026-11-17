import { Link, usePage } from '@inertiajs/react';
import { Sparkles, MessageCircle, Phone, User, Eye } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const MENU = [
    { href: '/aivision', label: 'AI Vision', icon: Sparkles },
    { href: '/chat', label: 'Chat', icon: MessageCircle },
    { href: '/call', label: 'Call', icon: Phone },
    { href: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout({
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { url, props } = usePage() as any;
    const user = props?.auth?.user;
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    const isActive = (href: string) => url.startsWith(href);

    return (
        <div className="flex min-h-screen bg-[#F8F8F8] font-sans antialiased">
            {/* Sidebar: hanya tablet dan desktop */}
            <aside className="sticky top-0 hidden h-screen w-65 shrink-0 flex-col bg-brand-red px-5 pt-7 pb-6 md:flex">
                <div className="mb-3 flex items-center ">
                    <div className="rounded-[10px]">
                        <img src="/images/logo padhang 3.png" alt="Eye" height="60" width="60" />
                    </div>
                    <span className="text-2xl font-semibold text-white">Padhang</span>
                </div>

                <nav className="flex flex-col gap-1.5">
                    {MENU.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? 'page' : undefined}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all active:scale-[0.98] ${active
                                        ? 'bg-brand-lime font-semibold text-brand-ink'
                                        : 'font-medium text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon className="size-5" />
                                <span className="text-base">{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto mb-7 pt-2 flex gap-1 px-2 text-[13px] text-black/80  bg-white rounded-lg flex-col">
                    <div>Supported by :</div>
                    <div className="flex items-bottom">
                        <img
                            src="/images/logo-uin-walisongo.png"
                            alt="UIN Walisongo"
                            className="h-15 p-1.5 w-auto "
                        />
                        <img
                            src="/images/logo-huawei-merah.jpeg"
                            alt="Huawei"
                            className="h-18 w-auto "
                        />
                        <img
                            src="/images/logo-huawei-ict.png"
                            alt="Huawei ICT Academy"
                            className="h-15 p-1 w-auto "
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-[14px] bg-white/10 p-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-brand-lime text-lg font-semibold text-brand-ink">
                        {userInitial}
                    </div>
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold text-white">{user?.name ?? 'Pengguna'}</span>
                        <span className="text-xs text-white/70">{user?.role === 'volunteer' ? 'Volunteer' : 'Support Seeker'}</span>
                    </div>
                </div>
            </aside>

            {/* Area konten */}
            <div className="relative flex min-h-screen min-w-0 flex-1 flex-col">
                <main className="mx-auto w-full max-w-4xl flex-1 p-6 pb-28 md:max-w-none md:px-12 md:py-10 md:pb-12">
                    {children}
                </main>

                {/* Navigasi bawah: hanya mobile */}
                <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around rounded-t-3xl bg-brand-red px-4 text-white shadow-[0_-4px_16px_rgba(131,0,0,0.2)] md:hidden">
                    {MENU.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-label={label}
                                aria-current={active ? 'page' : undefined}
                                className="relative flex h-full w-14 cursor-pointer flex-col items-center justify-center transition-all active:scale-95"
                            >
                                <Icon
                                    className={`size-5 transition-all ${active ? 'scale-110 text-brand-lime' : 'text-white/70'
                                        }`}
                                />
                                {active && (
                                    <span className="absolute bottom-1.5 size-1.5 animate-pulse rounded-full bg-brand-lime" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}