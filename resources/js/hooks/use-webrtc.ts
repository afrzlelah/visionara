import { useEffect, useRef, useCallback, useState } from 'react';
import axios from 'axios';

interface WebRTCProps {
    activeCall: any | null;
    userId: number;
    isMuted: boolean;
    isCameraOff: boolean;
}

export function useWebRTC({ activeCall, userId, isMuted, isCameraOff }: WebRTCProps) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

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

    // Initialize media when a call becomes active
    useEffect(() => {
        if (!activeCall) {
            // Clean up
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(t => t.stop());
                setLocalStream(null);
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            setRemoteStream(null);
            return;
        }

        let isMounted = true;

        const initMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                
                if (!isMounted) {
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
            // The activeCall = null branch will handle cleanup
        };
    }, [activeCall?.id]);

    const setupPeerConnection = useCallback((stream: MediaStream) => {
        if (!activeCall) return;

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
            ],
        });

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

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                axios.post(`/calls/${activeCall.id}/signal`, {
                    signal: {
                        type: 'candidate',
                        candidate: event.candidate,
                    }
                }).catch(err => console.error('[WebRTC] Error sending candidate', err));
            }
        };

        // If I am the caller (support seeker), I create the Offer
        if (activeCall.caller_id === userId) {
            pc.createOffer()
                .then((offer) => pc.setLocalDescription(offer))
                .then(() => {
                    return axios.post(`/calls/${activeCall.id}/signal`, {
                        signal: {
                            type: 'offer',
                            sdp: pc.localDescription,
                        }
                    });
                })
                .catch(err => console.error('[WebRTC] Error creating offer', err));
        }

    }, [activeCall, userId]);

    // Handle incoming WebRTC signals
    useEffect(() => {
        if (!activeCall || typeof window === 'undefined' || !window.Echo) return;

        const channel = window.Echo.private(`user.${userId}`);

        channel.listen('WebrtcSignalReceived', async (event: any) => {
            const { signal } = event;
            const pc = peerConnectionRef.current;
            if (!pc) return;

            console.log('[WebRTC] Received signal', signal.type);

            try {
                if (signal.type === 'offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    await axios.post(`/calls/${activeCall.id}/signal`, {
                        signal: {
                            type: 'answer',
                            sdp: pc.localDescription,
                        }
                    });
                } else if (signal.type === 'answer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                } else if (signal.type === 'candidate') {
                    await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                }
            } catch (err) {
                console.error('[WebRTC] Error processing signal', err);
            }
        });

        return () => {
            channel.stopListening('WebrtcSignalReceived');
        };
    }, [activeCall, userId]);

    return {
        localStream,
        remoteStream,
    };
}
