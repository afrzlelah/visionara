import { Head, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
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
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const startCamera = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Your browser does not support accessing the camera.");
            }
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setStream(mediaStream);
            setIsCameraActive(true);
            setCapturedImage(null);
            setAiResult(null);
            window.speechSynthesis.cancel();
        } catch (err: any) {
            console.error("Error accessing camera:", err);
            alert(`Unable to access camera: ${err.message}`);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraActive(false);
    };

    useEffect(() => {
        if (videoRef.current && stream && isCameraActive) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Error playing video stream:", e));
        }
    }, [stream, isCameraActive]);

    useEffect(() => {
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const srcStream = videoRef.current.srcObject as MediaStream;
                srcStream.getTracks().forEach(track => track.stop());
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    const captureAndAnalyze = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/jpeg');
                setCapturedImage(imageData);
                stopCamera();
                analyzeImageReal(imageData);
            }
        }
    };

    const analyzeImageReal = async (imageData: string) => {
        setIsAnalyzing(true);
        setAiResult(null);
        try {
            const response = await axios.post('/api/analyze-image', { image: imageData });
            if (response.data && response.data.description) {
                const resultText = response.data.description;
                setAiResult(resultText);
                speakResult(resultText);
            } else {
                throw new Error("Invalid response format from server.");
            }
        } catch (error: any) {
            console.error("AI Analysis Failed:", error);
            setAiResult("Maaf, Ada kesalahan Jaringan.");
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
            utterance.onend = () => setIsPlayingAudio(false);
            utterance.onerror = () => setIsPlayingAudio(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopAudio = () => {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
    };

    const resetScanner = () => {
        setCapturedImage(null);
        setAiResult(null);
        stopAudio();
        startCamera();
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
                    {/* Background Layer: Camera or Captured Image */}
                    <div id='camera-preview' className={`fixed inset-0 bg-black transition-opacity duration-300 ${isCameraActive || capturedImage ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'}`}>
                        {capturedImage ? (
                            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover opacity-80" />
                        ) : (
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted
                                className="w-full h-full object-cover"
                            />
                        )}
                        
                        {/* Dark overlay for text readability when active */}
                        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80" />
                        
                        {isAnalyzing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md gap-4 z-20">
                                <Spinner className="size-14 text-[#E1005E]" />
                                <p className="text-white font-bold tracking-wide animate-pulse text-lg">Analyzing surroundings...</p>
                            </div>
                        )}
                    </div>

                    {/* Hidden Canvas for capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* UI Foreground Layer */}
                    <div className={`relative z-10 flex flex-col w-full min-h-[calc(100vh-140px)] font-sans antialiased selection:bg-[#E1005E]/10 selection:text-[#E1005E] ${isCameraActive || capturedImage ? 'justify-between' : 'gap-6'}`}>
                        
                        {/* Top Section */}
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex items-center justify-between">
                                <h1 className={`text-3xl font-extrabold tracking-tight flex items-center gap-2 drop-shadow-md ${isCameraActive || capturedImage ? 'text-white' : 'text-[#E1005E]'}`}>
                                    <ScanEye className="size-8" /> AI Vision
                                </h1>
                            </div>

                            {!isCameraActive && !capturedImage && (
                                <div className="text-base font-semibold text-neutral-600 bg-[#E1005E]/10 p-4 rounded-[20px] border border-[#E1005E]/20 shadow-sm">
                                    Take a photo of your surroundings, and the AI will describe what it sees to help you navigate.
                                </div>
                            )}
                        </div>

                        {/* State 1: No Camera / Initial */}
                        {!isCameraActive && !capturedImage && (
                            <div id='main-area' className="flex-1 w-full bg-neutral-900 rounded-[32px] overflow-hidden flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] min-h-[400px]">
                                <div className="flex flex-col items-center gap-6 p-6 text-center">
                                    <div className="size-28 rounded-full bg-neutral-800 flex items-center justify-center shadow-inner">
                                        <Camera className="size-12 text-white/80" />
                                    </div>
                                    <button
                                        onClick={startCamera}
                                        className="px-8 py-4 rounded-[20px] font-bold text-white bg-linear-to-r from-[#E1005E] to-[#0052FF] hover:opacity-95 active:scale-[0.98] transition-all duration-300 shadow-[0_6px_20px_rgba(225,0,94,0.25)] flex items-center gap-2 text-lg w-full max-w-xs justify-center"
                                    >
                                        <Camera className="size-6" />
                                        Open Camera
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* State 2: Camera Active Controls */}
                        {isCameraActive && !capturedImage && (
                            <div className="flex justify-center mt-auto pb-4">
                                <button
                                    onClick={captureAndAnalyze}
                                    className="size-[96px] rounded-full border-[5px] border-white/40 flex items-center justify-center hover:border-white transition-all active:scale-95 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="size-[76px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-inner">
                                        <ScanEye className="size-10 text-[#E1005E]" />
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* State 3: Analysis Result */}
                        {aiResult && !isAnalyzing && (
                            <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[36px] shadow-[0_-10px_50px_rgba(0,0,0,0.25)] flex flex-col gap-5 mt-auto border border-white/20 mb-2">
                                <div className="w-16 h-1.5 bg-neutral-300 rounded-full mx-auto mb-1" />
                                
                                <h3 className="font-extrabold text-[#E1005E] text-xl flex items-center gap-2">
                                    <Sparkles className="size-6" />
                                    AI Description
                                </h3>
                                
                                <p className="text-neutral-800 font-semibold leading-relaxed text-lg">
                                    {aiResult}
                                </p>

                                {/* Audio Controls */}
                                <div className="flex items-center gap-3 mt-4">
                                    {isPlayingAudio ? (
                                        <button 
                                            onClick={stopAudio}
                                            className="flex-1 py-4 rounded-[20px] bg-[#E1005E]/10 text-[#E1005E] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm text-base"
                                        >
                                            <Square className="size-5" /> Stop Audio
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => speakResult(aiResult)}
                                            className="flex-1 py-4 rounded-[20px] bg-[#E1005E]/10 text-[#E1005E] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm text-base"
                                        >
                                            <Volume2 className="size-5" /> Replay Audio
                                        </button>
                                    )}
                                    
                                    <button 
                                        onClick={resetScanner}
                                        className="flex-1 py-4 rounded-[20px] bg-neutral-900 text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm text-base"
                                    >
                                        <RefreshCw className="size-5" /> Scan Again
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
