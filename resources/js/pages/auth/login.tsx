import { Form, Head, Link } from '@inertiajs/react';
import { ChevronLeft, Eye } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

const inputClass =
    'w-full rounded-[14px] border border-neutral-300 bg-white px-4 py-3 text-sm text-brand-ink transition-all outline-none placeholder:text-neutral-400 focus:border-brand-red focus:ring-1 focus:ring-brand-red md:py-3.5';

export default function Login() {
    return (
        <>
            <Head title="Log in" />

            <div className="flex min-h-screen w-full bg-white font-sans antialiased selection:bg-brand-red/10 selection:text-brand-red">
                {/* Panel brand: hanya tablet dan desktop */}
                <aside className="relative hidden overflow-hidden bg-brand-red md:flex md:w-[45%] md:flex-col md:justify-between md:p-12 lg:w-1/2 lg:p-16">
                    <div className="pointer-events-none absolute -bottom-40 -left-40 size-155 rounded-full bg-[#8a0e0e]" />

                    <div className="relative flex items-center gap-2.5">
                        <div className="rounded-[10px] bg-white p-2">
                            <Eye className="size-5 text-brand-bright" />
                        </div>
                        <span className="text-2xl font-semibold text-white">Padhang</span>
                    </div>

                    <div className="relative flex flex-col gap-5">
                        <h2 className="text-5xl leading-[1.1] font-semibold tracking-tight text-white lg:text-6xl">
                            Layanan Aksesibilitas
                            <br />
                            <span className="text-brand-lime">&amp;</span> Pemberdayaan Difabel Tunarungu
                        </h2>
                        <p className="max-w-md text-base leading-relaxed text-white/85 lg:text-lg">
                            Rencanakan acara yang lebih aksesibel untuk Difabel Tunarungu bersama kami.
                        </p>
                    </div>
                </aside>

                {/* Panel form */}
                <main className="flex flex-1 items-center justify-center px-6 py-8 md:px-12">
                    <div className="flex w-full max-w-md flex-col gap-8 md:max-w-105">
                        {/* Header dengan tombol kembali */}
                        <div className="flex flex-col gap-6">
                            <Link
                                href={home().url}
                                className="-ml-2 self-start rounded-full p-2 transition-all hover:bg-neutral-50 active:scale-95"
                            >
                                <ChevronLeft className="size-6 text-brand-ink" />
                            </Link>

                            <div className="flex flex-col items-center text-center md:items-start md:text-left">
                                <h1 className="text-[32px] font-extrabold tracking-tight text-brand-red md:text-[40px] md:font-semibold">
                                    Welcome
                                </h1>
                                <p className="mt-2 text-sm font-semibold text-neutral-500 md:text-base">
                                    Login to continue to{' '}
                                    <span className="font-bold text-brand-red md:font-semibold">Padhang</span>
                                </p>
                            </div>
                        </div>

                        {/* Form utama */}
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-5">
                                        {/* Email */}
                                        <div className="grid gap-1.5">
                                            <label htmlFor="email" className="text-xs font-bold text-brand-ink md:text-sm">
                                                Email or phone number
                                            </label>
                                            <input
                                                id="email"
                                                type="text"
                                                name="email"
                                                required
                                                autoFocus
                                                className={inputClass}
                                                placeholder="Enter your email or phone number..."
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password */}
                                        <div className="grid gap-1.5">
                                            <label htmlFor="password" className="text-xs font-bold text-brand-ink md:text-sm">
                                                Password
                                            </label>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                className={inputClass}
                                                placeholder="Enter your password..."
                                            />
                                            <div className="mt-0.5 flex justify-end">
                                                <Link
                                                    href={request().url}
                                                    className="text-[11px] font-bold text-brand-red transition-all hover:underline md:text-sm"
                                                >
                                                    Forgot Password?
                                                </Link>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Tombol login */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-brand-lime py-3.5 text-base font-bold text-brand-ink shadow-[0_4px_16px_rgba(223,255,0,0.35)] transition-all duration-300 select-none hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                                        >
                                            {processing && <Spinner className="size-4 text-brand-ink" />}
                                            Log In
                                        </button>
                                    </div>

                                    {/* Pemisah */}
                                    <div className="relative my-2 flex items-center justify-center">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-neutral-200"></div>
                                        </div>
                                        <span className="relative bg-white px-4 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                            or continue with
                                        </span>
                                    </div>

                                    {/* Login sosial */}
                                    <div className="flex flex-col gap-3">
                                        <button
                                            type="button"
                                            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-brand-ink shadow-2xs transition-all duration-300 hover:bg-neutral-50 active:scale-[0.99]"
                                        >
                                            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            <span>Continue with Google</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-brand-ink shadow-2xs transition-all duration-300 hover:bg-neutral-50 active:scale-[0.99]"
                                        >
                                            <svg className="size-5 text-[#E1306C]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                            </svg>
                                            <span>Continue with Instagram</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-brand-ink shadow-2xs transition-all duration-300 hover:bg-neutral-50 active:scale-[0.99]"
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
                        <div className="pb-2 text-center text-xs text-neutral-500 md:text-left md:text-sm">
                            Don't have an account yet?{' '}
                            <Link
                                href={register().url}
                                className="font-bold text-brand-red underline-offset-4 decoration-2 transition-all hover:underline"
                            >
                                Register for free
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}