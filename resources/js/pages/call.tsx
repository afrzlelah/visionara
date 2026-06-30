import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, RotateCcw, PhoneIncoming, Loader2 } from 'lucide-react';
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

/** Outlined phone SVG matching the Figma stroke style */
function PhoneStrokeIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.78 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.69 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.09-1.09a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}

/** Gradient pulsing ringing animation wrapper */
function RingingAnimation({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex items-center justify-center">
            <span
                className="absolute w-48 h-48 rounded-full opacity-15 animate-ping"
                style={{ background: 'linear-gradient(135deg, #4B1EDE, #E1005E)' }}
            />
            <span
                className="absolute w-36 h-36 rounded-full opacity-25 animate-ping [animation-delay:0.25s]"
                style={{ background: 'linear-gradient(135deg, #4B1EDE, #E1005E)' }}
            />
            <div
                className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(225,0,94,0.45)]"
                style={{ background: 'linear-gradient(135deg, #4B1EDE 0%, #8B20C8 45%, #E1005E 100%)' }}
            >
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

    // Duration counter when call is active is now handled inside ActiveCall component

    /** Support seeker initiates a call — NO volunteer selection on frontend */
    function handleStartCall() {
        console.log('[UI] handleStartCall clicked');
        if (onlineVolunteers.length > 0) {
            initiateCall();
        } else {
            // No volunteers visible in presence channel
            initiateCall(); // Still try — backend may have volunteers we don't see
        }
    }

    /** Volunteer accepts the incoming call */
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

    /** Format member-since date: "10 Juni 2026" */
    function formatMemberSince(isoDate: string) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VOLUNTEER — IDLE (Globe / Stats Page — waiting for incoming calls)
    // ─────────────────────────────────────────────────────────────────────────
    if (callState === 'idle' && isVolunteer) {
        return (
            <>
                <Head title="Call" />
                <div className="flex flex-col h-full min-h-[calc(100vh-5rem)]">
                    {/* App header */}
                    <div className="flex items-center justify-start px-2 py-1">
                        <AppLogo />
                    </div>

                    {/* Globe card */}
                    <div className="px-0 pt-3">
                        <div
                            className="w-full rounded-[28px] overflow-hidden flex flex-col items-center pb-6"
                            style={{
                                background: 'linear-gradient(160deg, #4B1EDE 0%, #7B31E8 35%, #C030B8 68%, #E1005E 100%)',
                                minHeight: '42vh',
                            }}
                        >
                            {/* Globe image */}
                            <div className="flex items-center justify-center pt-6 pb-2">
                                <img
                                    src="/images/globe.png"
                                    alt="Globe"
                                    className="w-44 h-44 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                                />
                            </div>

                            {/* Stats row */}
                            <div className="flex items-center justify-center gap-0 mt-2 w-full px-6">
                                <div className="flex-1 text-center">
                                    <p className="text-white text-xl font-extrabold tracking-tight">100,000</p>
                                    <p className="text-white/70 text-xs font-medium mt-0.5">Support Seeker</p>
                                </div>
                                <div className="w-px h-8 bg-white/30" />
                                <div className="flex-1 text-center">
                                    <p className="text-white text-xl font-extrabold tracking-tight">400,068</p>
                                    <p className="text-white/70 text-xs font-medium mt-0.5">Volunteers</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User profile card */}
                    <div className="mx-0 mt-4">
                        <div className="rounded-2xl bg-neutral-100 px-5 py-4 text-center relative overflow-hidden">
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-50/85 border border-green-200/50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-green-700 text-[9px] font-extrabold uppercase tracking-wider">Online</span>
                            </div>
                            <p className="text-neutral-800 text-lg font-bold leading-tight">
                                {auth.user.name}
                            </p>
                            <p className="text-neutral-400 text-xs mt-0.5">
                                member since {formatMemberSince(auth.user.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Notification hint */}
                    <div className="mx-0 mt-3">
                        <div className="rounded-xl bg-neutral-50 border border-neutral-100 px-5 py-3">
                            <p className="text-neutral-500 text-xs leading-relaxed text-center">
                                You will receive a notification when someone needs help.
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SUPPORT SEEKER (DIFABEL) — IDLE (Call a Volunteer — initiates the call)
    // ─────────────────────────────────────────────────────────────────────────
    if (callState === 'idle' && isDifabel) {
        return (
            <>
                <Head title="Call" />
                <div className="flex flex-col h-full min-h-[calc(100vh-5rem)] relative">
                    {/* Beautiful Status Popup Modal */}
                    {statusMessage && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-white rounded-[24px] w-full max-w-[320px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col items-center p-8 text-center animate-in zoom-in-95 duration-300 relative border border-neutral-100">
                                {/* Close Button (Top Right) */}
                                <button 
                                    onClick={clearStatusMessage}
                                    className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100 transition-colors"
                                    aria-label="Tutup"
                                >
                                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                
                                <div className="size-20 rounded-full bg-gradient-to-tr from-amber-100 to-rose-100 flex items-center justify-center mb-5 shadow-inner">
                                    <svg className="size-10 text-[#E1005E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                
                                <h3 className="text-xl font-extrabold text-neutral-800 mb-2 font-Outfit tracking-tight">Panggilan Gagal</h3>
                                
                                <p className="text-[13px] font-medium text-neutral-500 leading-relaxed mb-7">
                                    {statusMessage}
                                </p>
                                
                                <button 
                                    onClick={clearStatusMessage}
                                    className="w-full bg-[#E1005E] text-white font-bold text-sm py-3.5 rounded-[14px] shadow-[0_4px_14px_rgba(225,0,94,0.3)] hover:bg-[#c20050] active:scale-[0.98] transition-all"
                                >
                                    Tutup & Coba Lagi
                                </button>
                            </div>
                        </div>
                    )}

                    {/* App header */}
                    <div className="flex items-center justify-start px-2 py-1">
                        <AppLogo />
                    </div>

                    {/* Main card — tap to call */}
                    <div className="flex-1 flex flex-col items-stretch justify-start px-0 pt-4 pb-6">
                        <div
                            id="call-start-btn"
                            role="button"
                            aria-label="Mulai panggilan ke volunteer"
                            onClick={handleStartCall}
                            className="w-full mx-0 rounded-[28px] overflow-hidden relative flex flex-col items-center justify-end cursor-pointer active:scale-[0.98] transition-transform"
                            style={{
                                background: 'linear-gradient(160deg, #4B1EDE 0%, #7B31E8 30%, #C030B8 65%, #E1005E 100%)',
                                minHeight: '60vh',
                            }}
                        >
                            {/* Decorative phone icon */}
                            <div className="absolute inset-0 flex items-center justify-center pb-20">
                                <PhoneStrokeIcon className="w-40 h-40 text-white/80" />
                            </div>

                            {/* Bottom text */}
                            <div className="relative z-10 text-center pb-10 px-6">
                                <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
                                    Call a<br />Volunteer
                                </h1>
                            </div>
                        </div>

                        {/* Realtime Volunteer Status Section */}
                        <div className="mt-6 px-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <h2 className="text-neutral-800 font-bold text-sm">
                                    Available Volunteers ({onlineVolunteers.length})
                                </h2>
                            </div>

                            {onlineVolunteers.length === 0 ? (
                                <div className="rounded-2xl bg-neutral-50 border border-neutral-100 px-5 py-4 text-center">
                                    <p className="text-neutral-400 text-xs font-medium">
                                        No volunteers are online right now.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    {onlineVolunteers.map((v) => (
                                        <div key={v.id} className="flex items-center justify-between bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-[#E1005E]/10 flex items-center justify-center text-[#E1005E] text-xs font-extrabold uppercase">
                                                    {v.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-neutral-800 text-xs font-bold leading-tight">{v.name}</p>
                                                    <p className="text-neutral-400 text-[10px] mt-0.5">Ready to help</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SEARCHING STATE — Backend is finding a volunteer (support seeker only)
    // ─────────────────────────────────────────────────────────────────────────
    if (callState === 'searching') {
        return (
            <>
                <Head title="Mencari Volunteer…" />
                <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-10">
                    <div className="relative flex items-center justify-center">
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(75,30,222,0.3)]"
                            style={{ background: 'linear-gradient(135deg, #4B1EDE 0%, #8B20C8 45%, #E1005E 100%)' }}
                        >
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-neutral-700 text-lg font-bold">Mencari volunteer...</p>
                        <p className="text-neutral-400 text-sm mt-1">Sistem sedang mencarikan volunteer terbaik untukmu</p>
                    </div>

                    <button
                        id="call-cancel-search"
                        onClick={handleHangUp}
                        className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center active:scale-95 transition-all"
                        aria-label="Batalkan pencarian"
                    >
                        <PhoneOff className="w-6 h-6 text-neutral-600" />
                    </button>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CALLING STATE — Volunteer found, ringing on their end ("Berdering…")
    // ─────────────────────────────────────────────────────────────────────────
    if (callState === 'calling') {
        return (
            <>
                <Head title="Memanggil…" />
                <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-10">
                    <RingingAnimation>
                        <PhoneStrokeIcon className="w-12 h-12 text-white" />
                    </RingingAnimation>

                    <div className="text-center">
                        <p className="text-neutral-500 text-lg font-medium tracking-wide">Menghubungkan...</p>
                        <p className="text-neutral-400 text-sm mt-1">Menunggu volunteer merespons</p>
                    </div>

                    <button
                        id="call-hangup-calling"
                        onClick={handleHangUp}
                        className="w-16 h-16 rounded-full bg-[#E1005E] flex items-center justify-center shadow-[0_6px_20px_rgba(225,0,94,0.35)] active:scale-95 transition-all"
                        aria-label="Batalkan panggilan"
                    >
                        <PhoneOff className="w-6 h-6 text-white" />
                    </button>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RINGING STATE — Volunteer receives an incoming call from support seeker
    // ─────────────────────────────────────────────────────────────────────────
    if (callState === 'ringing') {
        return (
            <>
                <Head title="Panggilan Masuk" />
                <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-10">
                    <RingingAnimation>
                        <PhoneIncoming className="w-12 h-12 text-white" />
                    </RingingAnimation>

                    <div className="text-center">
                        <p className="text-neutral-700 text-xl font-bold">Panggilan Masuk</p>
                        <p className="text-neutral-400 text-sm mt-1">Support Seeker membutuhkan bantuanmu</p>
                    </div>

                    {/* Accept / Reject */}
                    <div className="flex items-center gap-14">
                        <div className="flex flex-col items-center gap-2">
                            <button
                                id="call-reject"
                                onClick={handleHangUp}
                                className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center shadow active:scale-95 transition-all"
                                aria-label="Tolak panggilan"
                            >
                                <PhoneOff className="w-6 h-6 text-neutral-600" />
                            </button>
                            <span className="text-xs text-neutral-400 font-medium">Tolak</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <button
                                id="call-accept"
                                onClick={handleAcceptCall}
                                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-[0_6px_20px_rgba(34,197,94,0.35)] active:scale-95 transition-all"
                                aria-label="Terima panggilan"
                            >
                                <Phone className="w-6 h-6 text-white" />
                            </button>
                            <span className="text-xs text-neutral-400 font-medium">Terima</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ACTIVE CALL STATE — Call in progress (both roles)
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
