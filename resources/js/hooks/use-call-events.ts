import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

export type CallState = 'idle' | 'searching' | 'calling' | 'ringing' | 'active' | 'ended';

/**
 * Wait for window.Echo to be available (it's set up asynchronously by bootstrap.ts).
 * Returns a cleanup function that clears the polling interval.
 */
function waitForEcho(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};

    if (window.Echo) {
        callback();
        return () => {};
    }

    // Poll every 50ms until Echo is ready (dynamic import in bootstrap.ts)
    const interval = setInterval(() => {
        if (window.Echo) {
            clearInterval(interval);
            callback();
        }
    }, 50);

    return () => clearInterval(interval);
}

export function useCallEvents(userId: number, role: 'volunteer' | 'difabel' | 'admin') {
    const [callState, setCallState] = useState<CallState>('idle');
    const [onlineVolunteers, setOnlineVolunteers] = useState<any[]>([]);
    const [activeCall, setActiveCall] = useState<any | null>(null);
    const [incomingCall, setIncomingCall] = useState<any | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const callTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isAssigningRef = useRef<boolean>(false);
    const activeCallRef = useRef<any | null>(null);

    // Keep ref in sync with state (for use inside event handlers that capture stale closure)
    useEffect(() => {
        activeCallRef.current = activeCall;
    }, [activeCall]);

    // ─────────────────────────────────────────────────────────────────────────
    // Subscribe to Presence Channel 'volunteers' — track who is online
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        let cleanupChannel: (() => void) | undefined;

        const cleanupWait = waitForEcho(() => {
            const channel = window.Echo.join('volunteers');

            channel
                .here((users: any[]) => {
                    const volunteers = users.filter((u) => u.role === 'volunteer');
                    setOnlineVolunteers(volunteers);
                })
                .joining((user: any) => {
                    if (user.role === 'volunteer') {
                        setOnlineVolunteers((prev) => {
                            if (prev.some((v) => v.id === user.id)) return prev;
                            return [...prev, user];
                        });
                    }
                })
                .leaving((user: any) => {
                    if (user.role === 'volunteer') {
                        setOnlineVolunteers((prev) => prev.filter((v) => v.id !== user.id));
                    }
                });

            cleanupChannel = () => {
                window.Echo.leave('volunteers');
            };
        });

        return () => {
            cleanupWait();
            cleanupChannel?.();
        };
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // Subscribe to Private Channel for call events
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        let cleanupChannel: (() => void) | undefined;

        const cleanupWait = waitForEcho(() => {
            const privateChannel = window.Echo.private(`user.${userId}`);

            // ── Volunteer: incoming call notification ──
            if (role === 'volunteer') {
                privateChannel.listen('IncomingCallReceived', (event: { call: any }) => {
                    console.log('[CALL EVENT] IncomingCallReceived', event.call);
                    setIncomingCall(event.call);
                    setCallState('ringing');
                });
            }

            // ── Caller (difabel): call accepted ──
            if (role === 'difabel') {
                privateChannel.listen('CallAccepted', (event: { call: any }) => {
                    console.log('[CALL EVENT] CallAccepted', event.call);
                    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
                    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                    setActiveCall(event.call);
                    setCallState('active');
                    setStatusMessage('');
                });

                // CallDeclined — only fires when ALL volunteers are exhausted
                privateChannel.listen('CallDeclined', () => {
                    console.log('[CALL EVENT] CallDeclined (all volunteers exhausted)');
                    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
                    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                    setStatusMessage('Semua volunteer sedang tidak tersedia. Silakan coba beberapa menit lagi.');
                    setCallState('idle');
                    setActiveCall(null);
                });
            }

            // ── Both roles: call ended by the other party ──
            privateChannel.listen('CallEnded', (event: { call: any }) => {
                console.log('[CALL EVENT] CallEnded', event.call);
                if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
                if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                setCallState('idle');
                setActiveCall(null);
                setIncomingCall(null);
                setStatusMessage('');
            });

            cleanupChannel = () => {
                window.Echo.leave(`user.${userId}`);
            };
        });

        return () => {
            cleanupWait();
            cleanupChannel?.();
        };
    }, [userId, role]);

    // ─────────────────────────────────────────────────────────────────────────
    // Initiate Call — Support Seeker only
    //
    // NO receiver_id — backend picks volunteer automatically.
    // Sends the list of online volunteer IDs so backend can filter.
    // ─────────────────────────────────────────────────────────────────────────
    const initiateCall = useCallback(async () => {
        console.log('[CALL] initiateCall() — searching for volunteer');
        setCallState('searching');
        setStatusMessage('Mencari volunteer...');
        
        if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        
        // Timeout if no volunteer can be connected after 30 seconds of searching
        searchTimeoutRef.current = setTimeout(() => {
            console.log('[CALL] search timeout — no volunteer available');
            setStatusMessage('Semua volunteer sedang tidak tersedia. Silakan coba beberapa menit lagi.');
            setCallState('idle');
            setActiveCall(null);
        }, 30000);
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // Attempt Call Assignment 
    // Called when searching and a volunteer is available
    // ─────────────────────────────────────────────────────────────────────────
    const attemptCallAssignment = useCallback(async () => {
        if (isAssigningRef.current || callState !== 'searching') return;
        
        isAssigningRef.current = true;
        try {
            const onlineIds = onlineVolunteers.map((v) => v.id);
            console.log('[CALL] attempt assignment, online IDs:', onlineIds);

            const response = await axios.post('/calls', {
                online_volunteer_ids: onlineIds,
            });

            console.log('[CALL] assignment success', response.status, response.data);
            
            // Stop searching timeout since we successfully assigned
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            
            setActiveCall(response.data.call);
            setCallState('calling');
            setStatusMessage('Menghubungkan ke volunteer...');

            // Start ringing timeout — if volunteer doesn't answer in 30s
            if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
            callTimeoutRef.current = setTimeout(async () => {
                console.log('[CALL] call timeout — volunteer no response in 30s');
                setStatusMessage('Volunteer tidak merespons. Silakan coba lagi.');
                
                const currentCall = activeCallRef.current || response.data.call;
                if (currentCall?.id) {
                    try {
                        await axios.post(`/calls/${currentCall.id}/end`);
                    } catch (err) {
                        console.error('[CALL] Failed to cancel call on timeout', err);
                    }
                }

                setCallState('idle');
                setActiveCall(null);
            }, 30000);
        } catch (error: any) {
            console.error('[CALL] assignment failed', error);
            // If it fails (e.g. 409 busy), we do NOT exit searching state.
            // We just wait for another volunteer to become available or for the searchTimeout to hit.
        } finally {
            isAssigningRef.current = false;
        }
    }, [onlineVolunteers, callState]);

    // ─────────────────────────────────────────────────────────────────────────
    // Auto-Retry Queue Loop
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        
        if (callState === 'searching') {
            // Immediate check
            if (onlineVolunteers.length > 0 && !isAssigningRef.current) {
                attemptCallAssignment();
            }
            
            // Poll every 3 seconds to catch volunteers who might have just become available
            interval = setInterval(() => {
                if (callState === 'searching' && onlineVolunteers.length > 0 && !isAssigningRef.current) {
                    attemptCallAssignment();
                }
            }, 3000);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [callState, onlineVolunteers, attemptCallAssignment]);

    // ─────────────────────────────────────────────────────────────────────────
    // Accept Call — Volunteer only
    // ─────────────────────────────────────────────────────────────────────────
    const acceptCall = useCallback(async () => {
        if (!incomingCall) return;
        try {
            console.log('[CALL] accepting call', incomingCall.id);
            const response = await axios.post(`/calls/${incomingCall.id}/accept`);
            setActiveCall(response.data.call);
            setCallState('active');
            setIncomingCall(null);
        } catch (error: any) {
            console.error('[CALL] accept failed', error);
            setCallState('idle');
            setIncomingCall(null);
        }
    }, [incomingCall]);

    // ─────────────────────────────────────────────────────────────────────────
    // Decline Call — Volunteer only
    //
    // When a volunteer declines, the backend auto-reassigns to another
    // volunteer. The support seeker does NOT see "declined".
    // ─────────────────────────────────────────────────────────────────────────
    const declineCall = useCallback(async () => {
        if (!incomingCall) return;
        try {
            console.log('[CALL] declining call', incomingCall.id);
            const onlineIds = onlineVolunteers.map((v) => v.id);
            await axios.post(`/calls/${incomingCall.id}/decline`, {
                online_volunteer_ids: onlineIds,
            });
            setCallState('idle');
            setIncomingCall(null);
        } catch (error) {
            console.error('[CALL] decline failed', error);
            setCallState('idle');
            setIncomingCall(null);
        }
    }, [incomingCall, onlineVolunteers]);

    // ─────────────────────────────────────────────────────────────────────────
    // Hang Up / End Call — Both roles
    //
    // Calls POST /calls/{id}/end which:
    //   1. Sets status = completed
    //   2. Sets ended_at = now()
    //   3. Broadcasts CallEnded to BOTH participants
    // ─────────────────────────────────────────────────────────────────────────
    const hangUp = useCallback(async () => {
        if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        const currentCall = activeCallRef.current || incomingCall;
        if (currentCall?.id) {
            try {
                console.log('[CALL] ending call', currentCall.id);
                await axios.post(`/calls/${currentCall.id}/end`);
            } catch (error) {
                console.error('[CALL] end call failed', error);
                // Still clean up locally even if the request fails
            }
        }

        setCallState('idle');
        setActiveCall(null);
        setIncomingCall(null);
        setStatusMessage('');
    }, [incomingCall]);

    // ─────────────────────────────────────────────────────────────────────────
    // Prevent zombie calls if user closes tab or refreshes
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const handleBeforeUnload = () => {
            const currentCall = activeCallRef.current;
            if (currentCall?.id) {
                // Use navigator.sendBeacon for reliable delivery during unload
                const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                const data = new FormData();
                data.append('_token', csrfToken);
                navigator.sendBeacon(`/calls/${currentCall.id}/end`, data);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    return {
        callState,
        onlineVolunteers,
        activeCall,
        incomingCall,
        statusMessage,
        initiateCall,
        acceptCall,
        declineCall,
        hangUp,
        clearStatusMessage: () => setStatusMessage(''),
    };
}
