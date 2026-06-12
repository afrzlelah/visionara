import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { login } from '@/routes';
import { register } from '@/routes';

export default function Welcome() {
    const [activeScreen, setActiveScreen] = useState<'splash' | 'roles'>(
        'splash',
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveScreen('roles');
        }, 300); // .3 second display for splash
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Welcome to Optira" />

            <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white font-sans antialiased selection:bg-[#E1005E]/10 selection:text-[#E1005E]">
                {/* SCREEN 1: SPLASHSCREEN */}
                <div
                    className={`absolute inset-0 z-40 flex flex-col items-center justify-between bg-white px-6 py-16 transition-all duration-700 ease-in-out ${
                        activeScreen === 'splash'
                            ? 'scale-100 opacity-100'
                            : 'pointer-events-none scale-95 opacity-0'
                    }`}
                >
                    {/* Empty spacing to align center */}
                    <div className="h-10"></div>

                    {/* Centered Logo & Subtitle */}
                    <div className="animate-fade-in flex flex-col items-center text-center">
                        <div>
                            <img
                                className="h-auto w-48 object-contain md:w-56"
                                src="/images/logoOptira.png"
                                alt="logo optira"
                            />
                        </div>
                        <div className="mt-4 flex flex-col gap-1">
                            <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-800 uppercase">
                                Smart Assistive Technology for
                            </span>
                            <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-800 uppercase">
                                Inclusive Accessibility
                            </span>
                        </div>
                    </div>

                    {/* Bottom decorative element / loader */}
                    <div className="flex items-center gap-1.5">
                        <span className="size-1.5 animate-bounce rounded-full bg-[#E1005E] [animation-delay:-0.3s]"></span>
                        <span className="size-1.5 animate-bounce rounded-full bg-[#E1005E] [animation-delay:-0.15s]"></span>
                        <span className="size-1.5 animate-bounce rounded-full bg-[#E1005E]"></span>
                    </div>
                </div>

                {/* SCREEN 2: ROLE SELECTION / WELCOME */}
                <div
                    className={`flex min-h-screen w-full max-w-md flex-col justify-between bg-white px-6 py-12 transition-all duration-700 ease-in-out ${
                        activeScreen === 'roles'
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none translate-y-4 opacity-0'
                    }`}
                >
                    {/* Top Logo / App name */}
                    <div className="flex justify-center pt-4">
                        <img
                            className="h-auto w-48 object-contain md:w-56"
                            src="/images/logoOptira.png"
                            alt="logo optira"
                        />
                    </div>

                    {/* Core Message */}
                    <div className="mt-6 flex flex-col items-center text-center">
                        <h3 className="px-2 text-2xl leading-tight font-bold tracking-tight text-neutral-900">
                            Who would you like to join us?
                        </h3>
                        <p className="mt-3 max-w-[320px] text-xs leading-relaxed text-neutral-500 md:text-sm">
                            Choose a role that best describes you, so we can
                            provide the best experience.
                        </p>
                    </div>

                    {/* Roles Selection Cards */}
                    <div className="my-8 flex w-full flex-col gap-5">
                        {/* Volunteer Card */}
                        <Link
                            href={
                                register({ query: { role: 'volunteer' } }).url
                            }
                            className="group flex w-full items-center gap-4.5 rounded-[24px] border-2 border-[#E0004D] bg-white p-5 shadow-[0_6px_24px_rgba(225,0,94,0.03)] transition-all duration-300 hover:border-[#E1005E]/30 hover:bg-neutral-50 hover:shadow-[0_8px_32px_rgba(225,0,94,0.06)] active:scale-[0.99]"
                        >
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-[18px] bg-[#E1005E] p-3.5 shadow-[0_4px_12px_rgba(225,0,94,0.25)] transition-transform duration-300 group-hover:scale-105">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-7 text-white"
                                >
                                    <path d="M12 4.435C10.011-.964 3 .222 3 6.13c0 4.06 3.86 8.51 9 11.87 5.14-3.36 9-7.81 9-11.87 0-5.908-7.011-7.094-9-1.695z" />
                                    <path d="M2 17.5a1 1 0 0 1 1-1h13.5a1.5 1.5 0 0 1 1.5 1.5c0 .5-.1 1-.4 1.3l-2.6 2.7H5.5a1 1 0 0 1-1-1v-.5H3a1 1 0 0 1-1-1v-2z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="text-base leading-none font-bold text-[#E1005E] md:text-lg">
                                    Volunteer
                                </h4>
                                <p className="mt-2 text-xs leading-snug text-neutral-400">
                                    I want to be Volunteer and help Support
                                    Seekers
                                </p>
                            </div>
                            <ChevronRight className="size-5.5 shrink-0 text-[#E1005E] transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                        {/* Support Seeker Card */}
                        <Link
                            href={register({ query: { role: 'difabel' } }).url}
                            className="group flex w-full items-center gap-4.5 rounded-[24px] border-2 border-[#0553FB] bg-white p-5 shadow-[0_6px_24px_rgba(0,82,255,0.03)] transition-all duration-300 hover:border-[#0052FF]/30 hover:bg-neutral-50 hover:shadow-[0_8px_32px_rgba(0,82,255,0.06)] active:scale-[0.99]"
                        >
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-[18px] bg-[#0052FF] p-3.5 shadow-[0_4px_12px_rgba(0,82,255,0.25)] transition-transform duration-300 group-hover:scale-105">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="size-6 text-white"
                                >
                                    <circle
                                        cx="12"
                                        cy="5"
                                        r="2.2"
                                        fill="currentColor"
                                    />
                                    <path d="M8 12h4v3.8h4.2" />
                                    <path d="M7.8 18c0-2.4 2-4.2 4.4-4.2s4.4 2 4.4 4.2" />
                                    <circle cx="12.2" cy="16.2" r="3.2" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="text-base leading-none font-bold text-[#0052FF] md:text-lg">
                                    Support Seeker
                                </h4>
                                <p className="mt-2 text-xs leading-snug text-neutral-400">
                                    I want to access information, resources, or
                                    Volunteer that can help me
                                </p>
                            </div>
                            <ChevronRight className="size-5.5 shrink-0 text-[#0052FF] transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Bottom Login Link */}
                    <div className="flex flex-col items-center justify-center pt-2 pb-4">
                        <p className="text-xs text-neutral-400 md:text-sm">
                            Already have an account?{' '}
                            <Link
                                href={login().url}
                                className="font-bold text-[#E1005E] decoration-2 underline-offset-4 transition-all hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
