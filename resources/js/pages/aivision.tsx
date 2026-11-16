import { Head, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Camera, Square, ScanEye, Sparkles } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import SuccessSplashScreen from '@/components/success-splash-screen';
import { Spinner } from '@/components/ui/spinner';

export default function Dashboard() {
    const { flash, auth } = usePage().props as any;
    const user = auth.user;

    const [showSplash, setShowSplash] = useState(false);
    const [splashType, setSplashType] = useState<'login' | 'register'>('login');

    useEffect(() => {
        if (flash?.success_action) {
            setSplashType(flash.success_action === 'register' ? 'register' : 'login');
            setShowSplash(true);
        }
    }, [flash]);

    // --- AI Vision Logic ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const isLoopActiveRef = useRef(false);

    const startCamera = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Your browser does not support accessing the camera.');
            }
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setStream(mediaStream);
            setIsCameraActive(true);
            setAiResult(null);
            isLoopActiveRef.current = true;
            window.speechSynthesis.cancel();
        } catch (err: any) {
            console.error('Error accessing camera:', err);
            alert(`Unable to access camera: ${err.message}`);
        }
    };

    const stopSession = () => {
        isLoopActiveRef.current = false;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setIsCameraActive(false);
        setIsAnalyzing(false);
        setAiResult(null);
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
    };

    useEffect(() => {
        if (videoRef.current && stream && isCameraActive) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch((e) => console.error('Error playing video stream:', e));
        }
    }, [stream, isCameraActive]);

    useEffect(() => {
        return () => {
            isLoopActiveRef.current = false;
            if (videoRef.current && videoRef.current.srcObject) {
                const srcStream = videoRef.current.srcObject as MediaStream;
                srcStream.getTracks().forEach((track) => track.stop());
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    const captureAndAnalyze = useCallback(() => {
        if (!isLoopActiveRef.current) return;

        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                setTimeout(captureAndAnalyze, 500);
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/jpeg');
                analyzeImageReal(imageData);
            }
        }
    }, []);

    const handleVideoPlaying = () => {
        if (isLoopActiveRef.current && !isAnalyzing && !isPlayingAudio) {
            setTimeout(captureAndAnalyze, 1000);
        }
    };

    const analyzeImageReal = async (imageData: string) => {
        if (!isLoopActiveRef.current) return;
        setIsAnalyzing(true);
        try {
            const response = await axios.post('/api/analyze-image', { image: imageData });
            if (!isLoopActiveRef.current) return;

            if (response.data && response.data.description) {
                const resultText = response.data.description;
                setAiResult(resultText);
                speakResult(resultText);
            } else {
                throw new Error('Invalid response format from server.');
            }
        } catch (error: any) {
            console.error('AI Analysis Failed:', error);
            if (isLoopActiveRef.current) {
                setAiResult('Maaf, ada kesalahan jaringan. Mencoba lagi.');
                speakResult('Maaf, ada kesalahan jaringan. Mencoba lagi.');
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const speakResult = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            const voices = window.speechSynthesis.getVoices();
            const idVoice = voices.find((v) => v.lang === 'id-ID' && v.name.includes('Google')) || voices.find((v) => v.lang.includes('id'));
            if (idVoice) utterance.voice = idVoice;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.onstart = () => setIsPlayingAudio(true);
            utterance.onend = () => {
                if (isLoopActiveRef.current) {
                    speakPrompt();
                } else {
                    setIsPlayingAudio(false);
                }
            };
            utterance.onerror = () => {
                if (isLoopActiveRef.current) {
                    speakPrompt();
                } else {
                    setIsPlayingAudio(false);
                }
            };
            window.speechSynthesis.speak(utterance);
        } else {
            if (isLoopActiveRef.current) {
                setTimeout(captureAndAnalyze, 3000);
            }
        }
    };

    const speakPrompt = () => {
        const promptUtterance = new SpeechSynthesisUtterance('Arahkan kamera untuk scan lagi');
        promptUtterance.lang = 'id-ID';
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find((v) => v.lang === 'id-ID' && v.name.includes('Google')) || voices.find((v) => v.lang.includes('id'));
        if (idVoice) promptUtterance.voice = idVoice;
        promptUtterance.rate = 1.0;
        promptUtterance.pitch = 1.0;
        promptUtterance.onend = () => {
            setIsPlayingAudio(false);
            if (isLoopActiveRef.current) {
                setTimeout(captureAndAnalyze, 1000);
            }
        };
        promptUtterance.onerror = () => {
            setIsPlayingAudio(false);
            if (isLoopActiveRef.current) {
                setTimeout(captureAndAnalyze, 1000);
            }
        };
        window.speechSynthesis.speak(promptUtterance);
    };

    // --- End AI Vision Logic ---

    return (
        <>
            <Head title="AI Vision" />

            {showSplash && <SuccessSplashScreen type={splashType} onClose={() => setShowSplash(false)} />}

            {/* Mobile: tumpukan biasa. Desktop: grid dua kolom (kamera kiri, hasil kanan). */}
            <div className="relative w-full md:grid md:grid-cols-[minmax(0,1fr)_360px] md:items-stretch md:gap-6">
                {/* Latar kamera: fixed di mobile, kartu di desktop */}
                <div
                    id="camera-preview"
                    className={`bg-black transition-opacity duration-300 ${
                        isCameraActive
                            ? 'fixed inset-0 z-0 opacity-100 md:relative md:inset-auto md:z-auto md:col-start-1 md:row-start-2 md:aspect-video md:overflow-hidden md:rounded-3xl'
                            : 'hidden'
                    }`}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        onPlaying={handleVideoPlaying}
                        className="h-full w-full object-cover"
                        aria-hidden="true"
                    />

                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80" aria-hidden="true" />

                    {isAnalyzing && (
                        <div
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-md"
                            aria-hidden="true"
                        >
                            <Spinner className="size-14 text-brand-lime" />
                            <p className="animate-pulse text-lg font-bold tracking-wide text-white">Menganalisis area...</p>
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

                {/* Lapisan UI. Di desktop, elemen-elemen di dalamnya menjadi item grid langsung. */}
                <div
                    className={`relative z-10 flex w-full flex-col font-sans antialiased selection:bg-brand-red/10 selection:text-brand-red md:contents ${
                        isCameraActive ? 'justify-between min-h-[calc(100vh-140px)] md:min-h-0' : 'min-h-[calc(100vh-140px)] gap-6 md:min-h-0'
                    }`}
                >
                    {/* Header dan banner */}
                    <div className="mt-2 flex flex-col gap-4 md:col-span-2 md:row-start-1 md:mt-0">
                        <div className="flex items-center justify-between">
                            <h1
                                className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-brand-red md:text-4xl"
                                aria-hidden="true"
                            >
                                <ScanEye className="size-8 md:size-9" /> AI Vision
                            </h1>
                        </div>

                        {!isCameraActive && (
                            <div
                                className="rounded-[20px] border border-brand-red/20 bg-brand-red/10 p-4 text-base font-semibold text-neutral-700 shadow-sm md:p-5 md:text-lg"
                                aria-live="polite"
                            >
                                Tekan 'Buka Kamera' untuk memulai pemindaian otomatis. AI akan terus membacakan deskripsi area di sekitar Anda secara berkala.
                            </div>
                        )}
                    </div>

                    {/* Kamera belum aktif: tombol Buka Kamera */}
                    {!isCameraActive && (
                        <div
                            id="main-area"
                            className="flex min-h-100 w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-4xl bg-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)] md:col-start-1 md:row-start-2 md:min-h-0 md:aspect-video md:rounded-3xl"
                        >
                            <div className="flex flex-col items-center gap-6 p-6 text-center">
                                <div className="flex size-28 items-center justify-center rounded-full bg-neutral-800 shadow-inner" aria-hidden="true">
                                    <Camera className="size-12 text-white/80" />
                                </div>
                                <button
                                    onClick={startCamera}
                                    aria-label="Open the Camera"
                                    className="flex w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-[20px] bg-brand-lime px-8 py-4 text-lg font-bold text-brand-ink shadow-[0_6px_20px_rgba(223,255,0,0.3)] transition-all duration-300 hover:opacity-95 active:scale-[0.98]"
                                >
                                    <Camera className="size-6" aria-hidden="true" />
                                    Buka Kamera
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Panel AI Description: selalu ada di desktop, di mobile hanya saat kamera aktif */}
                    <div
                        className={`flex-col gap-5 rounded-[36px] border border-white/20 bg-white/95 p-6 shadow-[0_-10px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl md:col-start-2 md:row-start-2 md:mt-0 md:mb-0 md:flex md:rounded-3xl md:shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${
                            isCameraActive ? 'mt-auto mb-2 flex md:min-h-85' : 'hidden'
                        }`}
                    >
                        {isCameraActive && (
                            <div className="mx-auto mb-1 h-1.5 w-16 rounded-full bg-neutral-300 md:hidden" aria-hidden="true" />
                        )}

                        <h3 className="flex items-center gap-2 text-xl font-extrabold text-brand-red" aria-hidden="true">
                            <Sparkles className="size-6" />
                            AI Description
                        </h3>

                        <p
                            className={`text-lg leading-relaxed font-semibold ${
                                isCameraActive ? 'text-brand-ink' : 'text-neutral-500'
                            }`}
                            aria-hidden="true"
                        >
                            {isCameraActive ? aiResult || 'Sedang bersiap...' : 'Deskripsi AI akan tampil disini'}
                        </p>

                        {isCameraActive && (
                            <div className="mt-auto flex items-center gap-3 pt-4">
                                <button
                                    onClick={stopSession}
                                    aria-label="Stop scanning"
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[20px] bg-brand-ink py-4 text-base font-bold text-white shadow-sm transition-all active:scale-95"
                                >
                                    <Square className="size-5" aria-hidden="true" /> Berhenti Scan
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: any) => <AppLayout children={page} />;