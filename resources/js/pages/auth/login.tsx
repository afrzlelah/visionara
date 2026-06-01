import { Form, Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

export default function Login() {
    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans antialiased selection:bg-[#E1005E]/10 selection:text-[#E1005E] w-full py-8 px-6">
                
                <div className="w-full max-w-md flex flex-col justify-between flex-1">
                    
                    {/* Top Header with Back button */}
                    <div className="flex flex-col gap-6">
                        <Link 
                            href={home().url} 
                            className="self-start p-2 rounded-full hover:bg-neutral-50 active:scale-95 transition-all -ml-2"
                        >
                            <ChevronLeft className="size-6 text-neutral-800" />
                        </Link>

                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-[32px] font-extrabold text-[#E1005E] tracking-tight font-Outfit">
                                Welcome
                            </h1>
                            <p className="text-sm font-semibold text-neutral-500 mt-2">
                                Login to continue to <span className="text-[#E1005E] font-bold">Optira</span>
                            </p>
                        </div>
                    </div>

                    {/* Main Form */}
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-5 mt-8 flex-1 justify-center"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    
                                    {/* Email Field */}
                                    <div className="grid gap-1.5">
                                        <label htmlFor="email" className="text-xs md:text-sm font-bold text-neutral-800">
                                            Email or phone number
                                        </label>
                                        <input
                                            id="email"
                                            type="text"
                                            name="email"
                                            required
                                            autoFocus
                                            className="w-full px-4 py-3 rounded-[14px] border border-neutral-300 focus:border-[#E1005E] focus:ring-1 focus:ring-[#E1005E] bg-white transition-all text-sm placeholder:text-neutral-400 outline-none"
                                            placeholder="Enter your email or phone number..."
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="grid gap-1.5">
                                        <label htmlFor="password" className="text-xs md:text-sm font-bold text-neutral-800">
                                            Password
                                        </label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            className="w-full px-4 py-3 rounded-[14px] border border-neutral-300 focus:border-[#E1005E] focus:ring-1 focus:ring-[#E1005E] bg-white transition-all text-sm placeholder:text-neutral-400 outline-none"
                                            placeholder="Enter your password..."
                                        />
                                        <div className="flex justify-end mt-0.5">
                                            <Link
                                                href={request().url}
                                                className="text-[11px] font-bold text-[#E1005E] hover:underline transition-all"
                                            >
                                                Forgot Password?
                                            </Link>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Gradient Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-2 w-full py-3.5 rounded-[14px] font-bold text-white bg-linear-to-r from-[#E1005E] to-[#0052FF] hover:opacity-95 disabled:opacity-50 active:scale-[0.99] transition-all duration-300 shadow-[0_4px_16px_rgba(225,0,94,0.2)] flex items-center justify-center gap-2 cursor-pointer select-none text-base"
                                    >
                                        {processing && <Spinner className="size-4 text-white" />}
                                        Log In
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="relative flex items-center justify-center my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-neutral-200"></div>
                                    </div>
                                    <span className="relative px-4 bg-white text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                        or continue with
                                    </span>
                                </div>

                                {/* Social Login Column */}
                                <div className="flex flex-col gap-3">
                                    
                                    {/* Google */}
                                    <button 
                                        type="button" 
                                        className="w-full flex items-center justify-center py-3 px-4 rounded-[14px] border border-neutral-250 hover:bg-neutral-50 active:scale-[0.99] transition-all duration-300 text-sm font-bold text-neutral-800 bg-white gap-3 cursor-pointer shadow-2xs"
                                    >
                                        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span>Continue with Google</span>
                                    </button>

                                    {/* Instagram */}
                                    <button 
                                        type="button" 
                                        className="w-full flex items-center justify-center py-3 px-4 rounded-[14px] border border-neutral-250 hover:bg-neutral-50 active:scale-[0.99] transition-all duration-300 text-sm font-bold text-neutral-800 bg-white gap-3 cursor-pointer shadow-2xs"
                                    >
                                        <svg className="size-5 text-[#E1306C]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                        </svg>
                                        <span>Continue with Instagram</span>
                                    </button>

                                    {/* Facebook */}
                                    <button 
                                        type="button" 
                                        className="w-full flex items-center justify-center py-3 px-4 rounded-[14px] border border-neutral-250 hover:bg-neutral-50 active:scale-[0.99] transition-all duration-300 text-sm font-bold text-neutral-800 bg-white gap-3 cursor-pointer shadow-2xs"
                                    >
                                        <svg className="size-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span>Continue with Facebook</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>

                    {/* Footer */}
                    <div className="text-center text-xs md:text-sm text-neutral-500 mt-8 pb-2">
                        Don't have an account yet?{' '}
                        <Link 
                            href={register().url} 
                            className="text-[#E1005E] font-bold hover:underline decoration-2 underline-offset-4 transition-all"
                        >
                            Register for free
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}
