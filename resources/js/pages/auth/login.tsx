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

            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-8 font-sans antialiased selection:bg-[#E1005E]/10 selection:text-[#E1005E]">
                <div className="flex w-full max-w-md flex-1 flex-col justify-between">
                    {/* Top Header with Back button */}
                    <div className="flex flex-col gap-6">
                        <Link
                            href={home().url}
                            className="-ml-2 self-start rounded-full p-2 transition-all hover:bg-neutral-50 active:scale-95"
                        >
                            <ChevronLeft className="size-6 text-neutral-800" />
                        </Link>

                        <div className="flex flex-col items-center text-center">
                            <h1 className="font-Outfit text-[32px] font-extrabold tracking-tight text-[#E1005E]">
                                Welcome
                            </h1>
                            <p className="mt-2 text-sm font-semibold text-neutral-500">
                                Login to continue to{' '}
                                <span className="font-bold text-[#E1005E]">
                                    Visionara
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Main Form */}
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="mt-8 flex flex-1 flex-col justify-center gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    {/* Email Field */}
                                    <div className="grid gap-1.5">
                                        <label
                                            htmlFor="email"
                                            className="text-xs font-bold text-neutral-800 md:text-sm"
                                        >
                                            Email or phone number
                                        </label>
                                        <input
                                            id="email"
                                            type="text"
                                            name="email"
                                            required
                                            autoFocus
                                            className="w-full rounded-[14px] border border-neutral-300 bg-white px-4 py-3 text-sm text-black transition-all outline-none placeholder:text-neutral-400 focus:border-[#E1005E] focus:ring-1 focus:ring-[#E1005E]"
                                            placeholder="Enter your email or phone number..."
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="grid gap-1.5">
                                        <label
                                            htmlFor="password"
                                            className="text-xs font-bold text-neutral-800 md:text-sm"
                                        >
                                            Password
                                        </label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            className="w-full rounded-[14px] border border-neutral-300 bg-white px-4 py-3 text-sm text-black transition-all outline-none placeholder:text-neutral-400 focus:border-[#E1005E] focus:ring-1 focus:ring-[#E1005E]"
                                            placeholder="Enter your password..."
                                        />
                                        <div className="mt-0.5 flex justify-end">
                                            <Link
                                                href={request().url}
                                                className="text-[11px] font-bold text-[#E1005E] transition-all hover:underline"
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
                                        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-linear-to-r from-[#E1005E] to-[#0052FF] py-3.5 text-base font-bold text-white shadow-[0_4px_16px_rgba(225,0,94,0.2)] transition-all duration-300 select-none hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                                    >
                                        {processing && (
                                            <Spinner className="size-4 text-white" />
                                        )}
                                        Log In
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="relative my-6 flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-neutral-200"></div>
                                    </div>
                                    <span className="relative bg-white px-4 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                        or continue with
                                    </span>
                                </div>

                                {/* Social Login Column */}
                                <div className="flex flex-col gap-3">
                                    {/* Google */}
                                    <button
                                        type="button"
                                        className="border-neutral-250 flex w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] border bg-white px-4 py-3 text-sm font-bold text-neutral-800 shadow-2xs transition-all duration-300 hover:bg-neutral-50 active:scale-[0.99]"
                                    >
                                        <svg
                                            className="size-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        <span>Continue with Google</span>
                                    </button>

                                    {/* Instagram */}
                                    <button
                                        type="button"
                                        className="border-neutral-250 flex w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] border bg-white px-4 py-3 text-sm font-bold text-neutral-800 shadow-2xs transition-all duration-300 hover:bg-neutral-50 active:scale-[0.99]"
                                    >
                                        <svg
                                            className="size-5 text-[#E1306C]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            viewBox="0 0 24 24"
                                        >
                                            <rect
                                                x="2"
                                                y="2"
                                                width="20"
                                                height="20"
                                                rx="5"
                                                ry="5"
                                            />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line
                                                x1="17.5"
                                                y1="6.5"
                                                x2="17.51"
                                                y2="6.5"
                                            />
                                        </svg>
                                        <span>Continue with Instagram</span>
                                    </button>

                                    {/* Facebook */}
                                    <button
                                        type="button"
                                        className="border-neutral-250 flex w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] border bg-white px-4 py-3 text-sm font-bold text-neutral-800 shadow-2xs transition-all duration-300 hover:bg-neutral-50 active:scale-[0.99]"
                                    >
                                        <svg
                                            className="size-5 text-[#1877F2]"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span>Continue with Facebook</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>

                    {/* Footer */}
                    <div className="mt-8 pb-2 text-center text-xs text-neutral-500 md:text-sm">
                        Don't have an account yet?{' '}
                        <Link
                            href={register().url}
                            className="font-bold text-[#E1005E] decoration-2 underline-offset-4 transition-all hover:underline"
                        >
                            Register for free
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
