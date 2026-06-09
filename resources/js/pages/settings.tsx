import { Head, Link } from '@inertiajs/react';
import { ChevronRight, User, Shield, Bell, HelpCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function SettingsPage() {
    return (
        <>
            <Head title="Settings" />

            <div className="flex flex-col gap-6 w-full font-sans antialiased pb-6 selection:bg-[#E1005E]/10 selection:text-[#E1005E]">
                
                {/* Header */}
                <div className="flex items-center self-start">
                    <h1 className="text-2xl font-extrabold text-[#E1005E] tracking-tight font-Outfit">
                        Settings
                    </h1>
                </div>

                {/* Settings Items Card Container */}
                <div className="w-full bg-[#F5F5F7] rounded-[24px] overflow-hidden flex flex-col p-2 gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                    
                    {/* Item 1: Manage Account */}
                    <Link 
                        href="/settings/profile"
                        className="w-full p-4 rounded-[18px] bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all flex items-center justify-between cursor-pointer select-none"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                <User className="size-4.5 text-neutral-800" />
                            </div>
                            <span className="text-sm font-bold text-neutral-850">
                                Manage Account
                            </span>
                        </div>
                        <ChevronRight className="size-5 text-neutral-400" />
                    </Link>

                    {/* Item 2: Password and Security */}
                    <Link 
                        href="/settings/security"
                        className="w-full p-4 rounded-[18px] bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all flex items-center justify-between cursor-pointer select-none"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                <Shield className="size-4.5 text-neutral-800" />
                            </div>
                            <span className="text-sm font-bold text-neutral-850">
                                Password and Security
                            </span>
                        </div>
                        <ChevronRight className="size-5 text-neutral-400" />
                    </Link>

                    {/* Item 3: Notifications */}
                    <button
                        className="w-full p-4 rounded-[18px] bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all flex items-center justify-between cursor-pointer select-none text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                <Bell className="size-4.5 text-neutral-800" />
                            </div>
                            <span className="text-sm font-bold text-neutral-850">
                                Notifications
                            </span>
                        </div>
                        <ChevronRight className="size-5 text-neutral-400" />
                    </button>

                    {/* Item 4: Support */}
                    <button
                        className="w-full p-4 rounded-[18px] bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all flex items-center justify-between cursor-pointer select-none text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                <HelpCircle className="size-4.5 text-neutral-800" />
                            </div>
                            <span className="text-sm font-bold text-neutral-850">
                                Support
                            </span>
                        </div>
                        <ChevronRight className="size-5 text-neutral-400" />
                    </button>

                </div>

                {/* Subtext App Version */}
                <div className="w-full text-center mt-4">
                    <p className="text-xs font-bold text-neutral-400 leading-normal">
                        App Version 1.0
                    </p>
                </div>

            </div>
        </>
    );
}

SettingsPage.layout = (page: any) => <AppLayout children={page} />;
