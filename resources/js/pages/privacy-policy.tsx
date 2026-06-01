import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="Therm Condition & Privacy Policy" />

            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans antialiased selection:bg-[#E1005E]/10 selection:text-[#E1005E] w-full py-8 px-6">
                
                <div className="w-full max-w-md flex flex-col justify-between flex-1">
                    
                    {/* Top Section with back button and Title */}
                    <div className="flex flex-col gap-6">
                        <button
                            onClick={() => window.history.back()}
                            className="self-start p-2 rounded-full hover:bg-neutral-50 active:scale-95 transition-all -ml-2 cursor-pointer"
                        >
                            <ChevronLeft className="size-6 text-neutral-800" />
                        </button>

                        <div className="flex flex-col gap-3">
                            <h1 className="text-[28px] font-extrabold text-neutral-900 tracking-tight leading-tight font-Outfit">
                                Therm Condition and<br />privacy policy
                            </h1>
                            
                            <p className="text-sm text-neutral-500 leading-relaxed font-sans">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere, mauris eget efficitur volutpat, neque magna facilisis mauris, sed volutpat justo velit vel erat. Integer vitae risus sed lacus fermentum posuere.
                            </p>
                        </div>
                    </div>

                    {/* Scrollable Terms Content */}
                    <div className="flex-1 my-6 space-y-6 max-h-[50vh] overflow-y-auto pr-1 text-sm text-neutral-600 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-neutral-200">
                        
                        {/* Section 1 */}
                        <div className="space-y-3">
                            <h2 className="font-bold text-neutral-900 text-base">1. Terms of Use</h2>
                            <div className="space-y-2.5 pl-1">
                                <p>
                                    <span className="font-bold text-neutral-800">1.1</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat, turpis nec ultrices tincidunt, lorem mauris tempor erat, vel facilisis lacus arcu sed sapien.
                                </p>
                                <p>
                                    <span className="font-bold text-neutral-800">1.2</span> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                                </p>
                                <p>
                                    <span className="font-bold text-neutral-800">1.3</span> Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.
                                </p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-3">
                            <h2 className="font-bold text-neutral-900 text-base">2. Privacy and Security</h2>
                            <div className="space-y-2.5 pl-1">
                                <p>
                                    <span className="font-bold text-neutral-800">2.1</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Mauris eget lorem vitae turpis commodo luctus.
                                </p>
                                <p>
                                    <span className="font-bold text-neutral-800">2.2</span> Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
                                </p>
                                <p>
                                    <span className="font-bold text-neutral-800">2.3</span> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="space-y-3">
                            <h2 className="font-bold text-neutral-900 text-base">3. User Responsibility</h2>
                            <div className="space-y-2.5 pl-1">
                                <p>
                                    <span className="font-bold text-neutral-800">3.1</span> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-2">
                        <button
                            onClick={() => window.history.back()}
                            className="w-full py-3.5 rounded-[14px] font-bold text-white bg-linear-to-r from-[#E1005E] to-[#0052FF] hover:opacity-95 active:scale-[0.99] transition-all duration-300 shadow-[0_4px_16px_rgba(225,0,94,0.2)] flex items-center justify-center gap-2 cursor-pointer select-none text-base"
                        >
                            Continue
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
