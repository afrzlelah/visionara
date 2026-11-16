import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Phone, PhoneOff, Loader2, PhoneIncoming } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import type { Auth } from '@/types';
import { useCallEvents } from '@/hooks/use-call-events';
import ActiveCall from '@/components/active-call';

/**
 * Call state machine:
 *
 * SUPPORT SEEKER / DIFABEL (the caller — menelepon volunteer):
 *   idle → [tap card] → searching → [backend picks volunteer] → calling → [volunteer accepts] → active → [hang up] → idle
 *
 * VOLUNTEER (the receiver — ditelpon oleh support seeker):
 *   idle → [incoming broadcast] → ringing → [terima] → active → [hang up] → idle
 *                                                     → [tolak] → idle (system auto-reassigns to another volunteer)
 */

interface Props {
    role: 'volunteer' | 'difabel' | 'admin';
}

const GRADIENT_CARD = 'linear-gradient(160deg, #830000 0%, #A10000 35%, #D60000 70%, #FF0000 100%)';
const GRADIENT_ICON = 'linear-gradient(135deg, #830000 0%, #B00000 50%, #FF0000 100%)';

/** Outlined phone SVG */
function PhoneStrokeIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.78 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.69 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.09-1.09a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}

/** Animasi berdering */
function RingingAnimation({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex items-center justify-center">
            <span className="absolute h-48 w-48 animate-ping rounded-full opacity-15" style={{ background: GRADIENT_ICON }} />
            <span className="absolute h-36 w-36 animate-ping rounded-full opacity-25 [animation-delay:0.25s]" style={{ background: GRADIENT_ICON }} />
            <div className="relative flex size-28 items-center justify-center rounded-full shadow-[0_8px_32px_rgba(131,0,0,0.4)]" style={{ background: GRADIENT_ICON }}>
                {children}
            </div>
        </div>
    );
}

export default function Call({ role }: Props) {
    const { auth } = usePage().props as { auth: Auth };
    const userRole = role || auth?.user?.role;
    const isDifabel = userRole === 'difabel';
    const isVolunteer = userRole === 'volunteer';

    const {
        callState,
        onlineVolunteers,
        activeCall,
        incomingCall,
        statusMessage,
        clearStatusMessage,
        initiateCall,
        acceptCall,
        declineCall,
        hangUp,
    } = useCallEvents(auth.user.id, userRole as 'volunteer' | 'difabel' | 'admin');

    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    /** Support seeker memulai panggilan — tanpa pemilihan volunteer di frontend */
    function handleStartCall() {
        initiateCall();
    }

    /** Volunteer menerima panggilan */
    function handleAcceptCall() {
        acceptCall();
    }

    function handleHangUp() {
        if (callState === 'ringing') {
            declineCall();
        } else {
            hangUp();
        }
        setIsMuted(false);
        setIsCameraOff(false);
    }

    /** Format tanggal: "10 Juni 2026" */
    function formatMemberSince(isoDate: string) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VOLUNTEER — IDLE (menunggu panggilan masuk)
    // ─────────────────────────────────────────────────────────────────────────
    if (callState === 'idle' && isVolunteer) {
        return (
            <>
                <Head title="Call" />
                <div className="flex h-full min-h-[calc(100vh-5rem)] flex-col md:grid md:min-h-0 md:grid-cols-[minmax(0,1fr)_360px] md:items-stretch md:gap-6">
                    {/* App header (mobile) */}
                    <div className="flex items-center justify-start px-2 py-1 md:hidden">
                        <AppLogo />
                    </div>

                    {/* Kartu globe */}
                    <div className="px-0 pt-3 md:p-0">
                        <div
                            className="flex w-full flex-col items-center overflow-hidden rounded-[28px] pb-6 md:h-full md:min-h-120 md:justify-center md:rounded-3xl md:pb-10"
                            style={{ background: GRADIENT_CARD, minHeight: '42vh' }}
                        >
                            <div className="flex items-center justify-center pt-6 pb-2 md:pt-0">
                                <img src="/images/globe.png" alt="Globe" className="h-44 w-44 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.3)] md:h-64 md:w-64" />
                            </div>

                            <div className="mt-2 flex w-full items-center justify-center gap-0 px-6">
                                <div className="flex-1 text-center">
                                    <p className="text-xl font-extrabold tracking-tight text-white md:text-3xl">100,000</p>
                                    <p className="mt-0.5 text-xs font-medium text-white/70 md:text-sm">Support Seeker</p>
                                </div>
                                <div className="h-8 w-px bg-white/30 md:h-12" />
                                <div className="flex-1 text-center">
                                    <p className="text-xl font-extrabold tracking-tight text-white md:text-3xl">400,068</p>
                                    <p className="mt-0.5 text-xs font-medium text-white/70 md:text-sm">Volunteers</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info kanan (desktop) / bawah (mobile) */}
                    <div className="flex flex-col gap-3 md:gap-4">
                        <div className="mx-0 mt-4 md:mt-0">
                            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-center md:px-6 md:py-6 md:text-left">
                                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-green-200/60 bg-green-50 px-2 py-0.5">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                                    <span className="text-[9px] font-extrabold tracking-wider text-green-700 uppercase">Online</span>
                                </div>
                                <p className="text-lg leading-tight font-bold text-brand-ink md:text-2xl">{auth.user.name}</p>
                                <p className="mt-0.5 text-xs text-neutral-400 md:text-sm">
                                    member since {formatMemberSince(auth.user.created_at)}
                                </p>
                            </div>
                        </div>

                        <div className="mx-0">
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-3 md:px-6 md:py-4">
                                <p className="text-center text-xs leading-relaxed text-neutral-500 md:text-left md:text-sm">
                                    You will receive a notification when someone needs help.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SUPPORT SEEKER (DIFABEL) — IDLE (memulai panggilan)
    // ─────────────────────────────────────────────────────────────────────────
    if (callState === 'idle' && isDifabel) {
        return (
            <>
                <Head title="Call" />
                <div className="relative flex h-full min-h-[calc(100vh-5rem)] flex-col md:grid md:min-h-0 md:grid-cols-[minmax(0,1fr)_360px] md:items-stretch md:gap-6">
                    {/* Modal status gagal */}
                    {statusMessage && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
                            <div className="relative flex w-full max-w-[320px] flex-col items-center overflow-hidden rounded-3xl border border-neutral-100 bg-white p-8 text-center shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                                <button
                                    onClick={clearStatusMessage}
                                    className="absolute top-4 right-4 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100"
                                    aria-label="Tutup"
                                >
                                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-brand-red/10 shadow-inner">
                                    <svg className="size-10 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>

                                <h3 className="mb-2 text-xl font-extrabold tracking-tight text-brand-ink">Panggilan Gagal</h3>
                                <p className="mb-7 text-[13px] leading-relaxed font-medium text-neutral-500">{statusMessage}</p>

                                <button
                                    onClick={clearStatusMessage}
                                    className="w-full rounded-[14px] bg-brand-red py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(131,0,0,0.3)] transition-all hover:opacity-90 active:scale-[0.98]"
                                >
                                    Tutup &amp; Coba Lagi
                                </button>
                            </div>
                        </div>
                    )}

                    {/* App header (mobile) */}
                    <div className="flex items-center justify-start px-2 py-1 md:hidden">
                        <AppLogo />
                    </div>

                    {/* Kartu utama: tekan untuk memanggil */}
                    <div className="flex flex-1 flex-col items-stretch justify-start px-0 pt-4 pb-6 md:p-0">
                        <div
                            id="call-start-btn"
                            role="button"
                            aria-label="Mulai panggilan ke volunteer"
                            onClick={handleStartCall}
                            className="relative flex w-full cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[28px] transition-transform active:scale-[0.98] md:h-full md:min-h-130 md:rounded-3xl"
                            style={{ background: GRADIENT_CARD, minHeight: '60vh' }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center pb-20 md:pb-24">
                                <PhoneStrokeIcon className="h-40 w-40 text-white/80 md:h-56 md:w-56" />
                            </div>

                            <div className="relative z-10 px-6 pb-10 text-center md:pb-14">
                                <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white drop-shadow-sm md:text-6xl">
                                    Call a
                                    <br />
                                    Volunteer
                                </h1>
                                <span className="mt-6 hidden items-center gap-2 rounded-[14px] bg-brand-lime px-6 py-3 text-base font-bold text-brand-ink md:inline-flex">
                                    <Phone className="size-5" /> Mulai panggilan
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status volunteer online */}
                    <div className="mt-6 px-1 md:mt-0 md:flex md:flex-col md:rounded-3xl md:border md:border-neutral-200 md:bg-white md:p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                            </span>
                            <h2 className="text-sm font-bold text-brand-ink md:text-base">Available Volunteers ({onlineVolunteers.length})</h2>
                        </div>

                        {onlineVolunteers.length === 0 ? (
                            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-center">
                                <p className="text-xs font-medium text-neutral-400 md:text-sm">No volunteers are online right now.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 md:gap-3">
                                {onlineVolunteers.map((v) => (
                                    <div key={v.id} className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-7 items-center justify-center rounded-full bg-brand-red/10 text-xs font-extrabold text-brand-red uppercase md:size-9">
                                                {v.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-xs leading-tight font-bold text-brand-ink md:text-sm">{v.name}</p>
                                                <p className="mt-0.5 text-[10px] text-neutral-400 md:text-xs">Ready to help</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SEARCHING — backend mencari volunteer (support seeker)
    // ─────────────────────────────────────────────────────────────────────────
    if (callState === 'searching') {
        return (
            <>
                <Head title="Mencari Volunteer…" />
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-white">
                    <div className="relative flex items-center justify-center">
                        <div className="flex size-28 items-center justify-center rounded-full shadow-[0_8px_32px_rgba(131,0,0,0.3)]" style={{ background: GRADIENT_ICON }}>
                            <Loader2 className="size-12 animate-spin text-white" />
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-lg font-bold text-brand-ink">Mencari volunteer...</p>
                        <p className="mt-1 text-sm text-neutral-400">Sistem sedang mencarikan volunteer terbaik untukmu</p>
                    </div>

                    <button
                        id="call-cancel-search"
                        onClick={handleHangUp}
                        className="flex size-16 items-center justify-center rounded-full bg-neutral-200 transition-all active:scale-95"
                        aria-label="Batalkan pencarian"
                    >
                        <PhoneOff className="size-6 text-neutral-600" />
                    </button>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CALLING — volunteer ditemukan, sedang berdering di sisi mereka
    // ─────────────────────────────────────────────────────────────────────────
    if (callState === 'calling') {
        return (
            <>
                <Head title="Memanggil…" />
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-white">
                    <RingingAnimation>
                        <PhoneStrokeIcon className="h-12 w-12 text-white" />
                    </RingingAnimation>

                    <div className="text-center">
                        <p className="text-lg font-medium tracking-wide text-neutral-500">Menghubungkan...</p>
                        <p className="mt-1 text-sm text-neutral-400">Menunggu volunteer merespons</p>
                    </div>

                    <button
                        id="call-hangup-calling"
                        onClick={handleHangUp}
                        className="flex size-16 items-center justify-center rounded-full bg-brand-red shadow-[0_6px_20px_rgba(131,0,0,0.35)] transition-all active:scale-95"
                        aria-label="Batalkan panggilan"
                    >
                        <PhoneOff className="size-6 text-white" />
                    </button>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RINGING — volunteer menerima panggilan masuk
    // ─────────────────────────────────────────────────────────────────────────
    if (callState === 'ringing') {
        return (
            <>
                <Head title="Panggilan Masuk" />
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-white">
                    <RingingAnimation>
                        <PhoneIncoming className="h-12 w-12 text-white" />
                    </RingingAnimation>

                    <div className="text-center">
                        <p className="text-xl font-bold text-brand-ink">Panggilan Masuk</p>
                        <p className="mt-1 text-sm text-neutral-400">Support Seeker membutuhkan bantuanmu</p>
                    </div>

                    <div className="flex items-center gap-14">
                        <div className="flex flex-col items-center gap-2">
                            <button
                                id="call-reject"
                                onClick={handleHangUp}
                                className="flex size-16 items-center justify-center rounded-full bg-neutral-200 shadow transition-all active:scale-95"
                                aria-label="Tolak panggilan"
                            >
                                <PhoneOff className="size-6 text-neutral-600" />
                            </button>
                            <span className="text-xs font-medium text-neutral-400">Tolak</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <button
                                id="call-accept"
                                onClick={handleAcceptCall}
                                className="flex size-16 items-center justify-center rounded-full bg-brand-lime shadow-[0_6px_20px_rgba(223,255,0,0.4)] transition-all active:scale-95"
                                aria-label="Terima panggilan"
                            >
                                <Phone className="size-6 text-brand-ink" />
                            </button>
                            <span className="text-xs font-medium text-neutral-400">Terima</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ACTIVE — panggilan berlangsung (kedua peran)
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <ActiveCall
            activeCall={activeCall}
            isCameraOff={isCameraOff}
            setIsCameraOff={setIsCameraOff}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            handleHangUp={handleHangUp}
        />
    );
}