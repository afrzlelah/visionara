import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft, Download, Link2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function ShareProfile() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.origin + '/profile/' + user.id);
        alert('Profile link copied to clipboard!');
    };

    const downloadQR = () => {
        // Placeholder for actual QR download logic
        alert('Downloading QR Code...');
    };

    return (
        <>
            <Head title="Share Profile" />

            <div className="flex flex-col gap-6 w-full font-sans antialiased pb-6 h-full min-h-[80vh]">
                
                {/* Header */}
                <div className="flex items-center gap-1.5 self-start">
                    <Link href="/profile" className="cursor-pointer active:scale-95 transition-all">
                        <ChevronLeft className="size-5 text-[#E1005E]" />
                    </Link>
                    <h1 className="text-xl font-extrabold text-[#E1005E] tracking-tight font-Outfit">
                        Share Profile
                    </h1>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-4">
                    
                    {/* QR Code Card */}
                    <div className="w-full max-w-[260px] aspect-square rounded-[16px] bg-white border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 flex flex-col items-center justify-center gap-4">
                        {/* Mock QR Code image */}
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/profile/' + user.id)}`} 
                            alt="QR Code" 
                            className="w-full h-auto"
                        />
                        <p className="text-[13px] font-bold text-neutral-800">
                            @{user.name.toLowerCase().replace(/\s+/g, '')}
                        </p>
                    </div>

                    {/* Action Buttons Card */}
                    <div className="w-full max-w-[260px] rounded-[16px] bg-white border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-4 flex items-center justify-around">
                        
                        <div className="flex flex-col items-center gap-1.5">
                            <button 
                                onClick={downloadQR}
                                className="size-12 rounded-full border border-neutral-300 flex items-center justify-center active:scale-95 transition-all hover:bg-neutral-50"
                            >
                                <Download className="size-5 text-neutral-700" />
                            </button>
                            <span className="text-[11px] text-neutral-600 font-medium">Download</span>
                        </div>

                        <div className="flex flex-col items-center gap-1.5">
                            <button 
                                onClick={copyLink}
                                className="size-12 rounded-full border border-neutral-300 flex items-center justify-center active:scale-95 transition-all hover:bg-neutral-50"
                            >
                                <Link2 className="size-5 text-neutral-700" />
                            </button>
                            <span className="text-[11px] text-neutral-600 font-medium">Copy link</span>
                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

ShareProfile.layout = (page: any) => <AppLayout children={page} />;
