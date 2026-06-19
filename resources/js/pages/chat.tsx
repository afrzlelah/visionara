import { Head, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Camera, RefreshCw, Volume2, Square, ScanEye, Mic, MessageCircle, Sparkles } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Spinner } from '@/components/ui/spinner';

export default function ChatPage() {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const isDifabel = user.role === 'difabel';

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    // Initialize Camera
    const startCamera = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Your browser does not support accessing the camera, or you are not on a secure HTTPS connection.");
            }
            
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } // Prefer back camera
            });
            
            setStream(mediaStream);
            setIsCameraActive(true);
            setCapturedImage(null);
            setAiResult(null);
            window.speechSynthesis.cancel(); // Stop any ongoing speech
        } catch (err: any) {
            console.error("Error accessing camera:", err);
            alert(`Unable to access camera: ${err.message}. Please check your browser permissions or ensure you are using a secure connection (HTTPS or localhost).`);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraActive(false);
    };

    // Attach stream to video element when it becomes active
    useEffect(() => {
        if (videoRef.current && stream && isCameraActive) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Error playing video stream:", e));
        }
    }, [stream, isCameraActive]);

    // Clean up camera on unmount
    useEffect(() => {
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const srcStream = videoRef.current.srcObject as MediaStream;
                srcStream.getTracks().forEach(track => track.stop());
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    // Capture Image and Analyze
    const captureAndAnalyze = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw video frame to canvas
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/jpeg');
                setCapturedImage(imageData);
                stopCamera();
                
                // Start AI Analysis
                analyzeImageReal(imageData);
            }
        }
    };

    const analyzeImageReal = async (imageData: string) => {
        setIsAnalyzing(true);
        setAiResult(null);
        
        try {
            // Send image to Laravel Backend
            const response = await axios.post('/api/analyze-image', {
                image: imageData
            });

            if (response.data && response.data.description) {
                const resultText = response.data.description;
                setAiResult(resultText);
                speakResult(resultText);
            } else {
                throw new Error("Invalid response format from server.");
            }
        } catch (error: any) {
            console.error("AI Analysis Failed:", error);
            const errorMessage = "Maaf, Ada kesalahan Jaringan.";
            setAiResult(errorMessage);
            // We do NOT call speakResult(errorMessage) here to avoid random/annoying voice on error
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Text to Speech
    const speakResult = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop current speech
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID'; // Force Indonesian language
            
            // Try to find the most natural Indonesian voice available
            const voices = window.speechSynthesis.getVoices();
            const idVoice = voices.find(v => v.lang === 'id-ID' && v.name.includes('Google')) || voices.find(v => v.lang.includes('id'));
            if (idVoice) {
                utterance.voice = idVoice;
            }

            utterance.rate = 1.0; // Slightly slower for better comprehension
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

    // Render for Volunteer (Normal Chat Placeholder)
    if (!isDifabel) {
        return (
            <>
                <Head title="Messages" />
                <div className="flex flex-col gap-6 w-full font-sans antialiased pb-6">
                    <div className="flex items-center self-start">
                        <h1 className="text-2xl font-extrabold text-[#E1005E] tracking-tight font-Outfit">
                            Messages
                        </h1>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center flex-1 min-h-[50vh] text-center gap-4">
                        <div className="size-20 rounded-full bg-[#E1005E]/10 flex items-center justify-center">
                            <MessageCircle className="size-10 text-[#E1005E]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-800">No Messages Yet</h2>
                            <p className="text-sm text-neutral-500 mt-1">When someone reaches out, their messages will appear here.</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Render for Difabel (AI Vision Assistant)
    return (
        <>
            <Head title="AI Assistant" />

            {/* Background Layer: Camera or Captured Image */}
            <div id='camera-preview' className={`absolute inset-0 w-full h-full bg-black transition-opacity duration-300 ${isCameraActive || capturedImage ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'}`}>
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
                        <h1 className={`text-2xl font-extrabold tracking-tight font-Outfit flex items-center gap-2 drop-shadow-md ${isCameraActive || capturedImage ? 'text-white' : 'text-[#E1005E]'}`}>
                            <ScanEye className="size-7" /> AI Vision
                        </h1>
                    </div>

                    {!isCameraActive && !capturedImage && (
                        <div className="text-sm font-semibold text-neutral-600 bg-[#E1005E]/10 p-3 rounded-[16px] border border-[#E1005E]/20 shadow-sm">
                            Take a photo of your surroundings, and the AI will describe what it sees to help you navigate.
                        </div>
                    )}
                </div>

                {/* State 1: No Camera / Initial */}
                {!isCameraActive && !capturedImage && (
                    <div id='main-area' className="flex-1 w-full bg-neutral-900 rounded-[24px] overflow-hidden flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] min-h-[400px]">
                        <div className="flex flex-col items-center gap-6 p-6 text-center">
                            <div className="size-24 rounded-full bg-neutral-800 flex items-center justify-center">
                                <Camera className="size-10 text-white/80" />
                            </div>
                            <button
                                onClick={startCamera}
                                className="px-8 py-4 rounded-[20px] font-bold text-white bg-linear-to-r from-[#E1005E] to-[#0052FF] hover:opacity-95 active:scale-[0.98] transition-all duration-300 shadow-[0_6px_20px_rgba(225,0,94,0.25)] flex items-center gap-2 text-base w-full max-w-xs justify-center"
                            >
                                <Camera className="size-5" />
                                Open Camera
                            </button>
                        </div>
                    </div>
                )}

                {/* State 2: Camera Active Controls */}
                {isCameraActive && !capturedImage && (
                    <div className="flex justify-center mt-auto ">
                        <button
                            onClick={captureAndAnalyze}
                            className="size-[84px] rounded-full border-[5px] border-white/40 flex items-center justify-center hover:border-white transition-all active:scale-95 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                        >
                            <div className="size-[64px] rounded-full bg-white flex items-center justify-center shadow-inner">
                                <ScanEye className="size-8 text-[#E1005E]" />
                            </div>
                        </button>
                    </div>
                )}

                {/* State 3: Analysis Result */}
                {aiResult && !isAnalyzing && (
                    <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[32px] shadow-[0_-10px_50px_rgba(0,0,0,0.25)] flex flex-col gap-4 mt-auto border border-white/20 mb-2">
                        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-1" />
                        
                        <h3 className="font-extrabold text-[#E1005E] text-lg flex items-center gap-2">
                            <Sparkles className="size-5" />
                            AI Description
                        </h3>
                        
                        <p className="text-neutral-800 font-semibold leading-relaxed text-base">
                            {aiResult}
                        </p>

                        {/* Audio Controls */}
                        <div className="flex items-center gap-3 mt-3">
                            {isPlayingAudio ? (
                                <button 
                                    onClick={stopAudio}
                                    className="flex-1 py-3.5 rounded-[16px] bg-[#E1005E]/10 text-[#E1005E] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                                >
                                    <Square className="size-5" /> Stop Audio
                                </button>
                            ) : (
                                <button 
                                    onClick={() => speakResult(aiResult)}
                                    className="flex-1 py-3.5 rounded-[16px] bg-[#E1005E]/10 text-[#E1005E] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                                >
                                    <Volume2 className="size-5" /> Replay Audio
                                </button>
                            )}
                            
                            <button 
                                onClick={resetScanner}
                                className="flex-1 py-3.5 rounded-[16px] bg-neutral-900 text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                            >
                                <RefreshCw className="size-5" /> Scan Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

ChatPage.layout = (page: any) => <AppLayout children={page} />;

// I also need to import MessageCircle and Sparkles from lucide-react at the top
// Let me fix the imports
