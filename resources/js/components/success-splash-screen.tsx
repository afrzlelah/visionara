import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface SuccessSplashScreenProps {
    type: 'login' | 'register';
    onClose: () => void;
}

export default function SuccessSplashScreen({ type, onClose }: SuccessSplashScreenProps) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 400); // match transition duration
    };

    return (
        <div className={`fixed inset-0 z-50 bg-[#12121230] backdrop-blur-md flex items-center justify-center transition-all duration-500 ease-out p-4 ${
            isClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}>
            {/* White Rounded Card container */}
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] py-12 px-8 flex flex-col justify-between items-center text-center min-h-[500px]">
                
                {/* Header Section */}
                <div className="space-y-3 w-full">
                    {type === 'register' ? (
                        <h1 className="text-[32px] font-extrabold text-neutral-900 tracking-tight leading-tight font-Outfit">
                            Welcome to <span className="text-[#E1005E]">Visionara</span>
                        </h1>
                    ) : (
                        <h1 className="text-[32px] font-extrabold text-neutral-900 tracking-tight leading-tight font-Outfit">
                            Welcome back to <span className="text-[#E1005E]">Visionara</span>
                        </h1>
                    )}

                    <p className="text-sm font-semibold text-neutral-500 font-sans">
                        {type === 'register' 
                            ? 'Your account has been created successfully' 
                            : 'You have logged in successfully'
                        }
                    </p>
                </div>

                {/* 3D Glossy Checkmark Sphere */}
                <div className="relative size-36 flex items-center justify-center my-6">
                    {/* Soft Shadow */}
                    <div className="absolute inset-0 bg-[#5C2CD5]/20 rounded-full blur-2xl scale-95 translate-y-4" />
                    
                    {/* Sphere */}
                    <div className="relative size-32 rounded-full bg-linear-to-tr from-[#31108F] via-[#5C2CD5] to-[#9D77F7] flex items-center justify-center shadow-[inset_-8px_-8px_24px_rgba(0,0,0,0.6),inset_8px_8px_24px_rgba(255,255,255,0.45),0_12px_28px_rgba(49,16,143,0.35)]">
                        
                        {/* 3D Glass Highlights */}
                        <div className="absolute top-3 left-6 w-14 h-7 bg-white/20 rounded-full rotate-[-25deg] blur-[1px]" />
                        <div className="absolute bottom-3 right-6 w-8 h-4 bg-white/5 rounded-full rotate-[-25deg] blur-[2px]" />
                        
                        {/* Checkmark SVG */}
                        <svg 
                            className="size-16 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] filter" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth="3.8" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                {/* Slogan & Action Section */}
                <div className="space-y-8 w-full mt-4">
                    <p className="text-sm font-bold text-neutral-500 font-sans tracking-wide">
                        We glad to have you with us
                    </p>

                    <button
                        onClick={handleClose}
                        className="w-full py-4 rounded-[20px] font-bold text-white bg-linear-to-r from-[#E1005E] to-[#0052FF] hover:opacity-95 active:scale-[0.98] transition-all duration-300 shadow-[0_6px_20px_rgba(225,0,94,0.25)] flex items-center justify-center gap-2 cursor-pointer select-none text-base font-Outfit"
                    >
                        Go to Home
                    </button>
                </div>

            </div>
        </div>
    );
}
