import { useEffect, useRef, useCallback, useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

interface WebRTCProps {
    activeCall: any | null;
    userId: number;
    isMuted: boolean;
    isCameraOff: boolean;
}

export function useWebRTC({ activeCall, userId, isMuted, isCameraOff }: WebRTCProps) {
    const { turn } = usePage().props as any;
    
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

    const activeCallId = activeCall?.id;
    const callerId = activeCall?.caller_id;
    const activeCallStatus = activeCall?.status;

    // Keep refs in sync for handlers
    useEffect(() => {
        localStreamRef.current = localStream;
    }, [localStream]);

    // Handle mute/unmute
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
        }
    }, [isMuted]);

    // Handle camera on/off
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = !isCameraOff;
            });
        }
    }, [isCameraOff]);

    const flushCandidates = useCallback(async (pc: RTCPeerConnection) => {
        while (pendingCandidatesRef.current.length > 0) {
            const candidate = pendingCandidatesRef.current.shift();
            if (candidate && candidate.candidate) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error('[WebRTC] Error adding queued candidate', e);
                }
            }
        }
    }, []);

    const processSignal = useCallback(async (signal: any, pc: RTCPeerConnection) => {
        try {
            if (signal.type === 'offer') {
                await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                await flushCandidates(pc); // Add any candidates that arrived early
                
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                await axios.post(`/calls/${activeCallId}/signal`, {
                    signal: {
                        type: 'answer',
                        sdp: answer,
                    }
                });
            } else if (signal.type === 'answer') {
                await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                await flushCandidates(pc); // Add any candidates that arrived early
            } else if (signal.type === 'candidate') {
                if (signal.candidate && signal.candidate.candidate) {
                    if (pc.remoteDescription) {
                        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                    } else {
                        // Remote description not ready, queue it
                        pendingCandidatesRef.current.push(signal.candidate);
                    }
                }
            }
        } catch (err) {
            console.error('[WebRTC] Error processing signal', signal.type, err);
        }
    }, [activeCallId, flushCandidates]);

    const setupPeerConnection = useCallback((stream: MediaStream) => {
        if (!activeCallId) return;

        // Close any existing peer connection first to avoid conflicts
        if (peerConnectionRef.current) {
            console.log('[WebRTC] Closing existing peer connection in setupPeerConnection');
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        const iceServers: RTCIceServer[] = [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ];
        
        // Add TURN server if available
        if (turn?.url && turn?.username && turn?.credential) {
            iceServers.push({
                urls: `turn:${turn.url}`,
                username: turn.username,
                credential: turn.credential,
            });
        }

        const pc = new RTCPeerConnection({ iceServers });
        peerConnectionRef.current = pc;

        // Add local tracks
        stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
        });

        // Handle incoming remote tracks
        pc.ontrack = (event) => {
            console.log("[WebRTC] Received remote track", event.streams[0]);
            setRemoteStream(event.streams[0]);
        };

        // Handle ICE candidates (filter out empty candidate strings)
        pc.onicecandidate = (event) => {
            if (event.candidate && event.candidate.candidate) {
                axios.post(`/calls/${activeCallId}/signal`, {
                    signal: {
                        type: 'candidate',
                        candidate: event.candidate,
                    }
                }).catch(err => console.error('[WebRTC] Error sending candidate', err));
            }
        };

        // If I am the caller (support seeker), I create the Offer
        if (callerId === userId) {
            pc.createOffer()
                .then((offer) => pc.setLocalDescription(offer).then(() => offer))
                .then((offer) => {
                    return axios.post(`/calls/${activeCallId}/signal`, {
                        signal: {
                            type: 'offer',
                            sdp: offer,
                        }
                    });
                })
                .catch(err => console.error('[WebRTC] Error creating offer', err));
        }

    }, [activeCallId, callerId, userId, turn]);

    // Initialize media when a call becomes active (status === 'accepted')
    useEffect(() => {
        if (!activeCallId || activeCallStatus !== 'accepted') {
            // Clean up
            if (localStreamRef.current) {
                console.log('[WebRTC] Stopping local stream tracks');
                localStreamRef.current.getTracks().forEach(t => t.stop());
                setLocalStream(null);
            }
            if (peerConnectionRef.current) {
                console.log('[WebRTC] Closing peer connection');
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            pendingCandidatesRef.current = [];
            setRemoteStream(null);
            return;
        }

        let isMounted = true;

        const initMedia = async () => {
            try {
                console.log('[WebRTC] Initializing user media');
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                
                if (!isMounted) {
                    console.log('[WebRTC] Component unmounted or call changed during media initialization, stopping tracks');
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                // Apply initial mute/camera states
                stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
                stream.getVideoTracks().forEach(track => track.enabled = !isCameraOff);

                setLocalStream(stream);
                
                // Now setup WebRTC connection
                setupPeerConnection(stream);
            } catch (err) {
                console.error("[WebRTC] Failed to get user media", err);
                alert("Tidak dapat mengakses kamera atau mikrofon. Pastikan Anda memberikan izin.");
            }
        };

        initMedia();

        return () => {
            isMounted = false;
            // Clean up media and connections when this hook unmounts or call ID / status changes
            if (localStreamRef.current) {
                console.log('[WebRTC] useEffect cleanup: stopping local stream tracks');
                localStreamRef.current.getTracks().forEach(t => t.stop());
                setLocalStream(null);
            }
            if (peerConnectionRef.current) {
                console.log('[WebRTC] useEffect cleanup: closing peer connection');
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            pendingCandidatesRef.current = [];
            setRemoteStream(null);
        };
    }, [activeCallId, activeCallStatus, setupPeerConnection]);

    // Handle incoming WebRTC signals
    useEffect(() => {
        if (!activeCallId || activeCallStatus !== 'accepted' || typeof window === 'undefined' || !(window as any).Echo) return;

        console.log('[WebRTC] Subscribing to user channel for signaling:', userId);
        const channel = (window as any).Echo.private(`user.${userId}`);

        channel.listen('WebrtcSignalReceived', async (event: any) => {
            const { signal } = event;
            console.log('[WebRTC] Received signal from Echo', signal.type);
            
            const pc = peerConnectionRef.current;
            
            // If PeerConnection is not ready yet, we can't process SDPs right now.
            // Wait briefly or queue if pc is not ready
            if (!pc) {
                console.log('[WebRTC] pc not ready, queueing signal', signal.type);
                
                // Keep checking every 500ms until pc is ready or call ends
                const checkInterval = setInterval(() => {
                    const delayedPc = peerConnectionRef.current;
                    if (delayedPc) {
                        clearInterval(checkInterval);
                        console.log('[WebRTC] pc now ready, processing queued signal', signal.type);
                        processSignal(signal, delayedPc);
                    } else if (!activeCallId || activeCallStatus !== 'accepted') {
                        // Call ended before pc was ready
                        clearInterval(checkInterval);
                    }
                }, 500);
                return;
            }

            processSignal(signal, pc);
        });

        return () => {
            console.log('[WebRTC] Unsubscribing from user channel for signaling:', userId);
            channel.stopListening('WebrtcSignalReceived');
        };
    }, [activeCallId, activeCallStatus, userId, processSignal]);

    return {
        localStream,
        remoteStream,
    };
}
