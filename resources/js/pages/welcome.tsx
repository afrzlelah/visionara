import { Head, Link } from '@inertiajs/react';
import { login } from '@/routes';
import { register } from '@/routes';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function Welcome() {
    const [activeScreen, setActiveScreen] = useState<'splash' | 'roles'>('splash');

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveScreen('roles');
        }, 300); // .3 second display for splash
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Welcome to Optira" />
            
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans antialiased selection:bg-[#E1005E]/10 selection:text-[#E1005E] w-full relative overflow-hidden">

                {/* SCREEN 1: SPLASHSCREEN */}
                <div 
                    className={`absolute inset-0 bg-white flex flex-col items-center justify-between py-16 px-6 z-40 transition-all duration-700 ease-in-out ${
                        activeScreen === 'splash' 
                            ? 'opacity-100 scale-100' 
                            : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                >
                    {/* Empty spacing to align center */}
                    <div className="h-10"></div>

                    {/* Centered Logo & Subtitle */}
                        <div className="flex flex-col items-center text-center animate-fade-in">
                            <div>
                                <img className="w-48 md:w-56 h-auto object-contain" src="/images/logoOptira.png" alt="logo optira" />
                            </div>
                            <div className="mt-4 flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-800">
                                Smart Assistive Technology for
                            </span>
                                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-800">
                                Inclusive Accessibility
                            </span>
                        </div>
                    </div>

                    {/* Bottom decorative element / loader */}
                    <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-[#E1005E] animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="size-1.5 rounded-full bg-[#E1005E] animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="size-1.5 rounded-full bg-[#E1005E] animate-bounce"></span>
                    </div>
                </div>

                {/* SCREEN 2: ROLE SELECTION / WELCOME */}
                <div 
                    className={`w-full max-w-md min-h-screen flex flex-col justify-between py-12 px-6 bg-white transition-all duration-700 ease-in-out ${
                        activeScreen === 'roles' 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                >
                    {/* Top Logo / App name */}
                    <div className="flex justify-center pt-4">
                        <img className="w-48 md:w-56 h-auto object-contain" src="/images/logoOptira.png" alt="logo optira" />
                    </div>

                    {/* Core Message */}
                    <div className="flex flex-col items-center text-center mt-6">
                        <h3 className="text-2xl font-bold text-neutral-900 tracking-tight leading-tight px-2">
                            Who would you like to join us?
                        </h3>
                        <p className="text-xs md:text-sm text-neutral-500 mt-3 max-w-[320px] leading-relaxed">
                            Choose a role that best describes you, so we can provide the best experience.
                        </p>
                    </div>

                    {/* Roles Selection Cards */}
                    <div className="flex flex-col gap-5 my-8 w-full">
                        
                        {/* Volunteer Card */}
                        <Link 
                            href={register({ query: { role: 'volunteer' } }).url}
                            className="flex items-center w-full p-5 rounded-[24px] border-2 border-[#E0004D] hover:border-[#E1005E]/30 bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all duration-300 shadow-[0_6px_24px_rgba(225,0,94,0.03)] hover:shadow-[0_8px_32px_rgba(225,0,94,0.06)] gap-4.5 group"
                        >
                            <div className="bg-[#E1005E] p-3.5 rounded-[18px] flex items-center justify-center shrink-0 size-14 shadow-[0_4px_12px_rgba(225,0,94,0.25)] transition-transform duration-300 group-hover:scale-105">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="size-7 text-white">
                                    <path d="M12 4.435C10.011-.964 3 .222 3 6.13c0 4.06 3.86 8.51 9 11.87 5.14-3.36 9-7.81 9-11.87 0-5.908-7.011-7.094-9-1.695z" />
                                    <path d="M2 17.5a1 1 0 0 1 1-1h13.5a1.5 1.5 0 0 1 1.5 1.5c0 .5-.1 1-.4 1.3l-2.6 2.7H5.5a1 1 0 0 1-1-1v-.5H3a1 1 0 0 1-1-1v-2z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="text-base md:text-lg font-bold text-[#E1005E] leading-none">
                                    Volunteer
                                </h4>
                                <p className="text-xs text-neutral-400 mt-2 leading-snug">
                                    I want to be Volunteer and help Support Seekers
                                </p>
                            </div>
                            <ChevronRight className="size-5.5 text-[#E1005E] transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                        </Link>

                        {/* Support Seeker Card */}
                        <Link 
                            href={register({ query: { role: 'difabel' } }).url}
                            className="flex items-center w-full p-5 rounded-[24px] border-2 border-[#0553FB] hover:border-[#0052FF]/30 bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all duration-300 shadow-[0_6px_24px_rgba(0,82,255,0.03)] hover:shadow-[0_8px_32px_rgba(0,82,255,0.06)] gap-4.5 group"
                        >
                            <div className="bg-[#0052FF] p-3.5 rounded-[18px] flex items-center justify-center shrink-0 size-14 shadow-[0_4px_12px_rgba(0,82,255,0.25)] transition-transform duration-300 group-hover:scale-105">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-white">
                                    <circle cx="12" cy="5" r="2.2" fill="currentColor" />
                                    <path d="M8 12h4v3.8h4.2" />
                                    <path d="M7.8 18c0-2.4 2-4.2 4.4-4.2s4.4 2 4.4 4.2" />
                                    <circle cx="12.2" cy="16.2" r="3.2" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="text-base md:text-lg font-bold text-[#0052FF] leading-none">
                                    Support Seeker
                                </h4>
                                <p className="text-xs text-neutral-400 mt-2 leading-snug">
                                    I want to access information, resources, or Volunteer that can help me
                                </p>
                            </div>
                            <ChevronRight className="size-5.5 text-[#0052FF] transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                        </Link>

                    </div>

                    {/* Bottom Login Link */}
                    <div className="flex flex-col items-center justify-center pt-2 pb-4">
                        <p className="text-xs md:text-sm text-neutral-400">
                            Already have an account?{' '}
                            <Link 
                                href={login().url}
                                className="text-[#E1005E] font-bold hover:underline decoration-2 underline-offset-4 transition-all"
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
