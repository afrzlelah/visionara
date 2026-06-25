import { Head, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Camera, RefreshCw, Volume2, Square, ScanEye, Sparkles, Activity } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import SuccessSplashScreen from '@/components/success-splash-screen';
import { Spinner } from '@/components/ui/spinner';

export default function Dashboard() {
    const { flash, auth } = usePage().props as any;
    const user = auth.user;
    const isDifabel = user.role === 'difabel';

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
    
    // We use a ref to track if the loop is active so async callbacks don't continue if stopped
    const isLoopActiveRef = useRef(false);

    const startCamera = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Your browser does not support accessing the camera.");
            }
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setStream(mediaStream);
            setIsCameraActive(true);
            setAiResult(null);
            isLoopActiveRef.current = true;
            window.speechSynthesis.cancel();
        } catch (err: any) {
            console.error("Error accessing camera:", err);
            alert(`Unable to access camera: ${err.message}`);
        }
    };

    const stopSession = () => {
        isLoopActiveRef.current = false;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
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
            videoRef.current.play().catch(e => console.error("Error playing video stream:", e));
        }
    }, [stream, isCameraActive]);

    useEffect(() => {
        return () => {
            isLoopActiveRef.current = false;
            if (videoRef.current && videoRef.current.srcObject) {
                const srcStream = videoRef.current.srcObject as MediaStream;
                srcStream.getTracks().forEach(track => track.stop());
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    const captureAndAnalyze = useCallback(() => {
        if (!isLoopActiveRef.current) return;
        
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // Only capture if video has valid dimensions
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                // Video not ready yet, retry in a moment
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

    // Handle initial scan when video is ready
    const handleVideoPlaying = () => {
        if (isLoopActiveRef.current && !isAnalyzing && !isPlayingAudio) {
            // Add a small delay to let camera adjust auto-exposure
            setTimeout(captureAndAnalyze, 1000);
        }
    };

    const analyzeImageReal = async (imageData: string) => {
        if (!isLoopActiveRef.current) return;
        setIsAnalyzing(true);
        try {
            const response = await axios.post('/api/analyze-image', { image: imageData });
            if (!isLoopActiveRef.current) return; // check again after await
            
            if (response.data && response.data.description) {
                const resultText = response.data.description;
                setAiResult(resultText);
                speakResult(resultText);
            } else {
                throw new Error("Invalid response format from server.");
            }
        } catch (error: any) {
            console.error("AI Analysis Failed:", error);
            if (isLoopActiveRef.current) {
                setAiResult("Maaf, ada kesalahan jaringan. Mencoba lagi.");
                speakResult("Maaf, ada kesalahan jaringan. Mencoba lagi.");
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
            const idVoice = voices.find(v => v.lang === 'id-ID' && v.name.includes('Google')) || voices.find(v => v.lang.includes('id'));
            if (idVoice) utterance.voice = idVoice;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.onstart = () => setIsPlayingAudio(true);
            utterance.onend = () => {
                if (isLoopActiveRef.current) {
                    // Speak the prompt after the result finishes
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
            // Fallback if no speech synthesis, just loop
            if (isLoopActiveRef.current) {
                setTimeout(captureAndAnalyze, 3000);
            }
        }
    };

    const speakPrompt = () => {
        const promptUtterance = new SpeechSynthesisUtterance("Arahkan kamera untuk scan lagi");
        promptUtterance.lang = 'id-ID';
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(v => v.lang === 'id-ID' && v.name.includes('Google')) || voices.find(v => v.lang.includes('id'));
        if (idVoice) promptUtterance.voice = idVoice;
        promptUtterance.rate = 1.0;
        promptUtterance.pitch = 1.0;
        promptUtterance.onend = () => {
            setIsPlayingAudio(false);
            if (isLoopActiveRef.current) {
                // Wait 1 second before the next scan
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
            <Head title="Dashboard" />
            
            {showSplash && (
                <SuccessSplashScreen 
                    type={splashType} 
                    onClose={() => setShowSplash(false)} 
                />
            )}

                <div className="relative w-full h-full flex flex-col">
                    {/* Background Layer: Camera Preview */}
                    <div id='camera-preview' className={`fixed inset-0 bg-black transition-opacity duration-300 ${isCameraActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'}`}>
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted
                            onPlaying={handleVideoPlaying}
                            className="w-full h-full object-cover"
                            aria-hidden="true"
                        />
                        
                        {/* Dark overlay for text readability when active */}
                        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80" aria-hidden="true" />
                        
                        {isAnalyzing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md gap-4 z-20" aria-hidden="true">
                                <Spinner className="size-14 text-[#E1005E]" />
                                <p className="text-white font-bold tracking-wide animate-pulse text-lg">Menganalisis area...</p>
                            </div>
                        )}
                    </div>

                    {/* Hidden Canvas for capture */}
                    <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

                    {/* UI Foreground Layer */}
                    <div className={`relative z-10 flex flex-col w-full min-h-[calc(100vh-140px)] font-sans antialiased selection:bg-[#E1005E]/10 selection:text-[#E1005E] ${isCameraActive ? 'justify-between' : 'gap-6'}`}>
                        
                        {/* Top Section */}
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex items-center justify-between">
                                <h1 className={`text-3xl font-extrabold tracking-tight flex items-center gap-2 drop-shadow-md ${isCameraActive ? 'text-white' : 'text-[#E1005E]'}`} aria-hidden="true">
                                    <ScanEye className="size-8" /> AI Vision
                                </h1>
                            </div>

                            {!isCameraActive && (
                                <div className="text-base font-semibold text-neutral-600 bg-[#E1005E]/10 p-4 rounded-[20px] border border-[#E1005E]/20 shadow-sm" aria-live="polite">
                                    Tekan 'Buka Kamera' untuk memulai pemindaian otomatis. AI akan terus membacakan deskripsi area di sekitar Anda secara berkala.
                                </div>
                            )}
                        </div>

                        {/* State 1: No Camera / Initial */}
                        {!isCameraActive && (
                            <div id='main-area' className="flex-1 w-full bg-neutral-900 rounded-[32px] overflow-hidden flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] min-h-[400px]" >
                                <div className="flex flex-col items-center gap-6 p-6 text-center">
                                    <div className="size-28 rounded-full bg-neutral-800 flex items-center justify-center shadow-inner" aria-hidden="true">
                                        <Camera className="size-12 text-white/80" />
                                    </div>
                                    <button
                                        onClick={startCamera}
                                        aria-label="Open the Camera"
                                        className="px-8 py-4 rounded-[20px] font-bold text-white bg-linear-to-r from-[#E1005E] to-[#0052FF] hover:opacity-95 active:scale-[0.98] transition-all duration-300 shadow-[0_6px_20px_rgba(225,0,94,0.25)] flex items-center gap-2 text-lg w-full max-w-xs justify-center"
                                    >
                                        <Camera className="size-6" aria-hidden="true" />
                                        Buka Kamera
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* State 2: Camera Active & Analysis Result */}
                        {isCameraActive && (
                            <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[36px] shadow-[0_-10px_50px_rgba(0,0,0,0.25)] flex flex-col gap-5 mt-auto border border-white/20 mb-2">
                                <div className="w-16 h-1.5 bg-neutral-300 rounded-full mx-auto mb-1" aria-hidden="true" />
                                
                                <h3 className="font-extrabold text-[#E1005E] text-xl flex items-center gap-2" aria-hidden="true">
                                    <Sparkles className="size-6" />
                                    AI Description
                                </h3>
                                
                                <p className="text-neutral-800 font-semibold leading-relaxed text-lg" aria-hidden="true">
                                    {aiResult || "Sedang bersiap..."}
                                </p>

                                {/* Controls */}
                                <div className="flex items-center gap-3 mt-4">
                                    <button 
                                        onClick={stopSession}
                                        aria-label="Stop scanning"
                                        className="w-full py-4 rounded-[20px] bg-neutral-900 text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm text-base"
                                    >
                                        <Square className="size-5" aria-hidden="true" /> Berhenti Scan
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
        </>
    );
}

Dashboard.layout = (page: any) => <AppLayout children={page} />;
