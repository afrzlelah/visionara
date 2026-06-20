import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronRight, User, Shield, Bell, HelpCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function SettingsPage() {
    const { auth } = usePage<any>().props;
    const isVolunteer = auth.user.role === 'volunteer';
    const isOffline = auth.user.is_offline;

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            router.delete('/settings/profile');
        }
    };

    const toggleOffline = () => {
        router.post('/settings/offline', {}, {
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title="Settings" />

            <div className="flex flex-col gap-6 w-full font-sans antialiased pb-6 selection:bg-[#E1005E]/10 selection:text-[#E1005E]">
                
                {/* Header */}
                <div className="flex items-center self-start">
                    <h1 className="text-3xl font-extrabold text-[#E1005E] tracking-tight">
                        Settings
                    </h1>
                </div>

                {/* First Block: General Settings */}
                <div className="w-full bg-[#F5F5F7] rounded-[24px] flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                    
                    {/* Item 1: Manage Account */}
                    <Link 
                        href="/profile"
                        className="w-full px-5 py-4 bg-transparent hover:bg-neutral-200/50 active:bg-neutral-200 transition-colors flex items-center justify-between cursor-pointer select-none"
                    >
                        <div className="flex items-center gap-3">
                            <User className="size-5 text-neutral-600" />
                            <span className="text-base text-neutral-800">
                                Manage Account
                            </span>
                        </div>
                        <ChevronRight className="size-5 text-neutral-400" />
                    </Link>
                    <div className="h-px w-[calc(100%-2.5rem)] mx-auto bg-neutral-200/60" />

                    {/* Item 2: Password and Security */}
                    <Link 
                        href="/settings/security"
                        className="w-full px-5 py-4 bg-transparent hover:bg-neutral-200/50 active:bg-neutral-200 transition-colors flex items-center justify-between cursor-pointer select-none"
                    >
                        <div className="flex items-center gap-3">
                            <Shield className="size-5 text-neutral-600" />
                            <span className="text-base text-neutral-800">
                                Password and Security
                            </span>
                        </div>
                        <ChevronRight className="size-5 text-neutral-400" />
                    </Link>
                    <div className="h-px w-[calc(100%-2.5rem)] mx-auto bg-neutral-200/60" />

                    {/* Item 3: Notifications */}
                    {isVolunteer ? (
                        <button
                            onClick={toggleOffline}
                            className="w-full px-5 py-4 bg-transparent hover:bg-neutral-200/50 active:bg-neutral-200 transition-colors flex items-center justify-between cursor-pointer select-none text-left"
                        >
                            <div className="flex items-center gap-3">
                                <Bell className="size-5 text-neutral-600" />
                                <span className="text-base text-neutral-800">
                                    Notifications {isOffline ? '(Offline)' : '(Online)'}
                                </span>
                            </div>
                            <ChevronRight className="size-5 text-neutral-400" />
                        </button>
                    ) : (
                        <div className="w-full px-5 py-4 bg-transparent flex items-center justify-between select-none text-left opacity-60">
                            <div className="flex items-center gap-3">
                                <Bell className="size-5 text-neutral-600" />
                                <span className="text-base text-neutral-800">
                                    Notifications
                                </span>
                            </div>
                            <ChevronRight className="size-5 text-neutral-400" />
                        </div>
                    )}
                    <div className="h-px w-[calc(100%-2.5rem)] mx-auto bg-neutral-200/60" />

                    {/* Item 4: Support */}
                    <div
                        className="w-full px-5 py-4 bg-transparent flex items-center justify-between select-none text-left opacity-60"
                    >
                        <div className="flex items-center gap-3">
                            <HelpCircle className="size-5 text-neutral-600" />
                            <span className="text-base text-neutral-800">
                                Support
                            </span>
                        </div>
                    </div>

                </div>

                {/* Sub Header */}
                <div className="flex items-center self-start mt-2">
                    <h2 className="text-lg font-bold text-[#E1005E] tracking-tight">
                        Account Management
                    </h2>
                </div>

                {/* Second Block: Account Management */}
                <div className="w-full bg-[#F5F5F7] rounded-[24px] flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                    
                    {/* Item 1: Disable Account */}
                    <div className="w-full px-5 py-4 bg-transparent flex items-center justify-between select-none text-left opacity-60">
                        <span className="text-base text-neutral-800">
                            Disable Account
                        </span>
                    </div>
                    <div className="h-px w-[calc(100%-2.5rem)] mx-auto bg-neutral-200/60" />

                    {/* Item 2: Log Out */}
                    <button
                        onClick={handleLogout}
                        className="w-full px-5 py-4 bg-transparent hover:bg-red-50 active:bg-red-100 transition-colors flex items-center justify-between cursor-pointer select-none text-left"
                    >
                        <span className="text-base text-red-500 font-medium">
                            Log Out
                        </span>
                    </button>
                    <div className="h-px w-[calc(100%-2.5rem)] mx-auto bg-neutral-200/60" />

                    {/* Item 3: Delete Account */}
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full px-5 py-4 bg-transparent hover:bg-red-50 active:bg-red-100 transition-colors flex items-center justify-between cursor-pointer select-none text-left"
                    >
                        <span className="text-base text-red-500 font-medium">
                            Delete Account
                        </span>
                    </button>

                </div>

            </div>
        </>
    );
}

SettingsPage.layout = (page: any) => <AppLayout children={page} />;
