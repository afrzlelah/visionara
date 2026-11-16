import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { login } from '@/routes';
import { register } from '@/routes';

const ONBOARDING_STEPS = [
    {
        title: 'AI Vision Assist',
        description: 'Understand your surroundings instantly with our Edge AI camera',
        image: '/images/phone.webp',
    },
    {
        title: 'Instant Volunteer Help',
        description: 'Connect with nearby volunteers in seconds via quick call for immediate assistance.',
        image: '/images/handshake.webp',
    },
    {
        title: 'Inclusive Community',
        description: 'Join thousands of support seekers and volunteers making a real difference.',
        image: '/images/community.webp',
    },
];

export default function Intro() {
    const [activeScreen, setActiveScreen] = useState<'splash' | 'onboarding' | 'roles'>('splash');
    const [onboardingStep, setOnboardingStep] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveScreen('onboarding');
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const nextStep = () => {
        if (onboardingStep < ONBOARDING_STEPS.length - 1) {
            setOnboardingStep((prev) => prev + 1);
        } else {
            setActiveScreen('roles');
        }
    };

    const skipIntro = () => setActiveScreen('roles');

    return (
        <>
            <Head title="Welcome to Padhang" />

            <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white font-sans antialiased selection:bg-brand-red/10 selection:text-brand-red md:bg-brand-red">
                {/* Logo kiri atas, hanya tablet dan desktop */}
                <div className="absolute top-6 left-6 z-50 hidden items-center gap-2.5 md:flex md:left-12 lg:left-24">
                    <div className="rounded-[10px] bg-white p-2">
                        <img src="/images/Visiora 1.png" alt="" className="size-5 object-contain" />
                    </div>
                    <span className="text-2xl font-semibold text-white">Padhang</span>
                </div>

                {/* SCREEN 1: SPLASH */}
                <div
                    className={`absolute inset-0 z-40 flex flex-col items-center justify-between bg-white px-6 py-16 transition-all duration-700 ease-in-out ${
                        activeScreen === 'splash' ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
                    }`}
                >
                    <div className="h-10"></div>
                    <div className="animate-fade-in flex flex-col items-center text-center">
                        <img
                            className="h-auto w-48 object-contain md:w-56"
                            src="/images/Visiora 1.png"
                            alt="logo Padhang"
                        />
                        <div className="mt-4 flex flex-col gap-1">
                            <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-800 uppercase">
                                Smart Assistive Technology for
                            </span>
                            <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-800 uppercase">
                                Inclusive Accessibility
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="size-1.5 animate-bounce rounded-full bg-brand-red [animation-delay:-0.3s]"></span>
                        <span className="size-1.5 animate-bounce rounded-full bg-brand-red [animation-delay:-0.15s]"></span>
                        <span className="size-1.5 animate-bounce rounded-full bg-brand-red"></span>
                    </div>
                </div>

                {/* SCREEN 2: ONBOARDING */}
                <div
                    className={`absolute inset-0 z-30 flex flex-col items-center justify-center bg-white px-6 py-12 transition-all duration-700 ease-in-out md:bg-transparent md:px-6 ${
                        activeScreen === 'onboarding'
                            ? 'translate-x-0 opacity-100'
                            : activeScreen === 'splash'
                              ? 'pointer-events-none translate-x-8 opacity-0'
                              : 'pointer-events-none -translate-x-8 opacity-0'
                    }`}
                >
                    <div className="flex w-full flex-col items-center md:max-w-160 md:rounded-4xl md:bg-white md:px-12 md:py-12 md:shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
                        <h1 className="mb-12 text-2xl font-extrabold tracking-tight text-brand-red md:hidden">
                            Padhang
                        </h1>

                        {/* Gambar */}
                        <div className="mb-10 flex aspect-square w-full max-w-70 items-center justify-center overflow-hidden rounded-4xl bg-neutral-100 transition-all duration-500 md:mb-8 md:aspect-2/1 md:max-w-120 md:rounded-[20px]">
                            <img
                                key={onboardingStep}
                                src={ONBOARDING_STEPS[onboardingStep].image}
                                alt={ONBOARDING_STEPS[onboardingStep].title}
                                className="size-full object-contain md:object-cover"
                            />
                        </div>

                        {/* Teks */}
                        <div className="mb-auto flex min-h-30 flex-col items-center px-4 text-center md:mb-8 md:min-h-0">
                            <h2 className="mb-3 text-[22px] font-bold text-brand-ink md:text-[32px] md:font-semibold">
                                {ONBOARDING_STEPS[onboardingStep].title}
                            </h2>
                            <p className="max-w-70 text-[14px] leading-relaxed text-neutral-500 md:max-w-md md:text-base">
                                {ONBOARDING_STEPS[onboardingStep].description}
                            </p>
                        </div>

                        {/* Indikator */}
                        <div className="mb-8 flex items-center gap-2 md:mb-8">
                            {ONBOARDING_STEPS.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Slide ${index + 1}`}
                                    onClick={() => setOnboardingStep(index)}
                                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                                        index === onboardingStep ? 'w-6 bg-brand-red' : 'w-2 bg-neutral-200'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Aksi */}
                        <div className="flex w-full max-w-md flex-col gap-4">
                            <button
                                onClick={nextStep}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-lime py-4 font-bold text-brand-ink shadow-[0_4px_14px_rgba(223,255,0,0.35)] transition-all hover:opacity-95 active:scale-[0.98] md:rounded-[14px]"
                            >
                                Continue <ArrowRight className="size-5" />
                            </button>

                            <button
                                onClick={skipIntro}
                                className="w-full cursor-pointer py-3 text-sm font-bold text-brand-red transition-opacity hover:opacity-80"
                            >
                                Skip Intro
                            </button>
                        </div>
                    </div>
                </div>

                {/* SCREEN 3: ROLE */}
                <div
                    className={`flex min-h-screen w-full max-w-md flex-col justify-between bg-white px-6 py-12 transition-all duration-700 ease-in-out md:min-h-0 md:max-w-160 md:rounded-4xl md:px-12 md:py-12 md:shadow-[0_24px_60px_rgba(0,0,0,0.25)] ${
                        activeScreen === 'roles'
                            ? 'translate-x-0 opacity-100'
                            : 'pointer-events-none translate-x-8 opacity-0'
                    }`}
                >
                    <div className="flex justify-center pt-4">
                        <img className="h-auto w-48 object-contain md:w-40" src="/images/Visiora 1.png" alt="logo Padhang" />
                    </div>

                    <div className="mt-6 flex flex-col items-center text-center">
                        <h3 className="px-2 text-2xl leading-tight font-bold tracking-tight text-brand-ink md:text-3xl">
                            Who would you like to join us?
                        </h3>
                        <p className="mt-3 max-w-[320px] text-xs leading-relaxed text-neutral-500 md:max-w-md md:text-sm">
                            Choose a role that best describes you, so we can provide the best experience.
                        </p>
                    </div>

                    <div className="my-8 flex w-full flex-col gap-5">
                        <Link
                            href={register({ query: { role: 'volunteer' } }).url}
                            className="group flex w-full items-center gap-4 rounded-3xl border-2 border-brand-red bg-white p-5 shadow-[0_6px_24px_rgba(131,0,0,0.05)] transition-all duration-300 hover:bg-neutral-50 hover:shadow-[0_8px_32px_rgba(131,0,0,0.12)] active:scale-[0.99]"
                        >
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-[18px] bg-brand-red p-3.5 transition-transform duration-300 group-hover:scale-105">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="size-7 text-brand-lime">
                                    <path d="M12 4.435C10.011-.964 3 .222 3 6.13c0 4.06 3.86 8.51 9 11.87 5.14-3.36 9-7.81 9-11.87 0-5.908-7.011-7.094-9-1.695z" />
                                    <path d="M2 17.5a1 1 0 0 1 1-1h13.5a1.5 1.5 0 0 1 1.5 1.5c0 .5-.1 1-.4 1.3l-2.6 2.7H5.5a1 1 0 0 1-1-1v-.5H3a1 1 0 0 1-1-1v-2z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="text-base leading-none font-bold text-brand-red md:text-lg">Volunteer</h4>
                                <p className="mt-2 text-xs leading-snug text-neutral-400">
                                    I want to be Volunteer and help Support Seekers
                                </p>
                            </div>
                            <ChevronRight className="size-5 shrink-0 text-brand-red transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href={register({ query: { role: 'difabel' } }).url}
                            className="group flex w-full items-center gap-4 rounded-3xl border-2 border-brand-blue bg-white p-5 shadow-[0_6px_24px_rgba(7,136,249,0.05)] transition-all duration-300 hover:bg-neutral-50 hover:shadow-[0_8px_32px_rgba(7,136,249,0.12)] active:scale-[0.99]"
                        >
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-[18px] bg-brand-blue p-3.5 transition-transform duration-300 group-hover:scale-105">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-white">
                                    <circle cx="12" cy="5" r="2.2" fill="currentColor" />
                                    <path d="M8 12h4v3.8h4.2" />
                                    <path d="M7.8 18c0-2.4 2-4.2 4.4-4.2s4.4 2 4.4 4.2" />
                                    <circle cx="12.2" cy="16.2" r="3.2" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="text-base leading-none font-bold text-brand-blue md:text-lg">Support Seeker</h4>
                                <p className="mt-2 text-xs leading-snug text-neutral-400">
                                    I want to access information, resources, or Volunteer that can help me
                                </p>
                            </div>
                            <ChevronRight className="size-5 shrink-0 text-brand-blue transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="flex flex-col items-center justify-center pt-2 pb-4">
                        <p className="text-xs text-neutral-400 md:text-sm">
                            Already have an account?{' '}
                            <Link
                                href={login().url}
                                className="font-bold text-brand-red underline-offset-4 decoration-2 transition-all hover:underline"
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

Intro.layout = (page: React.ReactNode) => page;