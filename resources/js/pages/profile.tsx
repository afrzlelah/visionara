import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Shield, Bell, HelpCircle, LogOut, Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

const cardClass =
    'w-full overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_6px_20px_rgba(131,0,0,0.05)]';
const rowClass =
    'flex w-full items-center justify-between px-5 py-4 text-left transition-colors select-none hover:bg-brand-red/5 active:bg-brand-red/10 md:px-6 md:py-[18px]';
const dividerClass = 'mx-5 h-px bg-neutral-200 md:mx-6';

function Row({
    icon: Icon,
    label,
    onClick,
    href,
    chevron = false,
    right,
    tone = 'default',
    disabled = false,
}: {
    icon?: React.ElementType;
    label: string;
    onClick?: () => void;
    href?: string;
    chevron?: boolean;
    right?: React.ReactNode;
    tone?: 'default' | 'danger' | 'muted';
    disabled?: boolean;
}) {
    const textColor =
        tone === 'danger' ? 'text-brand-bright font-medium' : tone === 'muted' ? 'text-neutral-400' : 'text-brand-ink';
    const iconColor = tone === 'danger' ? 'text-brand-bright' : tone === 'muted' ? 'text-neutral-400' : 'text-neutral-600';

    const content = (
        <>
            <span className="flex items-center gap-3">
                {Icon && <Icon className={`size-5 ${iconColor}`} />}
                <span className={`text-base ${textColor}`}>{label}</span>
            </span>
            {right ?? (chevron && <ChevronRight className="size-5 text-neutral-400" />)}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={`${rowClass} cursor-pointer`}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${rowClass} ${disabled ? 'cursor-default opacity-60' : 'cursor-pointer'}`}
        >
            {content}
        </button>
    );
}

export default function Profile() {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const isVolunteer = user.role === 'volunteer';
    const isOffline = user.is_offline;
    const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    const handleLogout = () => router.post('/logout');
    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            router.delete('/settings/profile');
        }
    };
    const toggleOffline = () => router.post('/settings/offline', {}, { preserveScroll: true });

    return (
        <>
            <Head title="Profile User" />

            <div className="flex w-full flex-col gap-6 font-sans antialiased selection:bg-brand-red/10 selection:text-brand-red md:gap-8">
                {/* Header */}
                <div className="flex items-center gap-1.5 self-start">
                    <h1 className="text-xl font-extrabold tracking-tight text-brand-red md:text-3xl">Profile User</h1>
                    <ChevronDown className="size-4 text-brand-red md:size-6" />
                </div>

                <div className="flex flex-col gap-6 md:grid md:grid-cols-[400px_minmax(0,1fr)] md:items-start md:gap-8">
                    {/* Kolom kiri: info user dan edit */}
                    <div className="flex flex-col gap-6">
                        <div className="relative mt-8 w-full rounded-[20px] border border-neutral-200 bg-white px-5 pt-6 pb-6 shadow-[0_6px_20px_rgba(131,0,0,0.05)] md:px-6 md:pt-7">
                            {/* Avatar */}
                            {/* Baris atas: avatar dan identitas */}
                            <div className="flex items-center gap-4 md:gap-5">
                                <div className="size-20 shrink-0 rounded-full bg-linear-to-tr from-brand-red via-brand-red-bright to-brand-blue p-[2px] shadow-sm md:size-24">
                                    {user.photo_url ? (
                                        <img
                                            src={user.photo_url}
                                            alt={user.name}
                                            className="size-full rounded-full border-[3px] border-white object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center rounded-full border-[3px] border-white bg-brand-lime text-2xl font-black text-brand-ink md:text-3xl">
                                            {userInitial}
                                        </div>
                                    )}
                                </div>

                                <div className="flex min-w-0 flex-col gap-0.5">
                                    <h2 className="truncate text-lg leading-tight font-bold text-brand-ink md:text-2xl">{user.name}</h2>
                                    <p className="text-[11px] font-medium tracking-wide text-neutral-500 md:text-sm">
                                        {user.gender || 'Gender'} <span className="mx-1 opacity-50">|</span> {user.age || 'Age'}
                                    </p>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="text-[13px] leading-relaxed text-neutral-600 md:text-base mt-5">{user.bio || 'Bio....'}</p>
                        </div>

                        {/* Tombol Edit */}
                        <div className="w-full rounded-[20px] border border-neutral-200 bg-white p-4 shadow-[0_6px_20px_rgba(131,0,0,0.05)]">
                            <Link
                                href="/profile/edit"
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-lime py-3 text-sm font-bold text-brand-ink transition-all select-none hover:opacity-95 active:scale-[0.98] md:py-3.5"
                            >
                                <Pencil className="size-4" />
                                Edit Profile
                            </Link>
                        </div>
                    </div>

                    {/* Kolom kanan: settings, logout, akun */}
                    <div className="flex flex-col gap-6 md:gap-8">
                        {/* Settings */}
                        <section className="flex flex-col gap-3">
                            <h2 className="text-lg font-bold tracking-tight text-brand-ink md:text-xl">Settings</h2>
                            <div className={cardClass}>
                                <Row icon={Shield} label="Password and Security" href="/settings/security" chevron />
                                <div className={dividerClass} />
                                {isVolunteer ? (
                                    <Row
                                        icon={Bell}
                                        label={`Notifications (${isOffline ? 'Offline' : 'Online'})`}
                                        onClick={toggleOffline}
                                        right={
                                            <span
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    !isOffline ? 'bg-brand-red' : 'bg-neutral-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        !isOffline ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </span>
                                        }
                                    />
                                ) : (
                                    <Row icon={Bell} label="Notifications" tone="muted" disabled />
                                )}
                                <div className={dividerClass} />
                                <Row icon={HelpCircle} label="Support" tone="muted" disabled />
                            </div>
                        </section>

                        {/* Logout */}
                        <div className={cardClass}>
                            <Row icon={LogOut} label="Log Out" tone="danger" onClick={handleLogout} />
                        </div>

                        {/* Account management */}
                        <section className="flex flex-col gap-3">
                            <h2 className="text-lg font-bold tracking-tight text-brand-ink md:text-xl">Account management</h2>
                            <div className={cardClass}>
                                <Row label="Disable Account" tone="muted" disabled />
                                <div className={dividerClass} />
                                <Row label="Delete Account" tone="danger" onClick={handleDeleteAccount} />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

Profile.layout = (page: any) => <AppLayout children={page} />;