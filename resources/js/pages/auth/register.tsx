import { Form, Head, Link } from '@inertiajs/react';
import { ChevronLeft, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { home } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

const inputClass =
    'w-full rounded-[14px] border border-neutral-300 bg-white px-4 py-3 text-sm text-brand-ink transition-all outline-none placeholder:text-neutral-400 focus:border-brand-red focus:ring-1 focus:ring-brand-red md:py-3.5';

export default function Register({ passwordRules }: Props) {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialRole = searchParams?.get('role') || 'difabel';
    const [role, setRole] = useState<'volunteer' | 'difabel'>(initialRole === 'volunteer' ? 'volunteer' : 'difabel');

    useEffect(() => {
        if (searchParams) {
            const currentRole = searchParams.get('role');
            if (currentRole === 'volunteer' || currentRole === 'difabel') {
                setRole(currentRole);
            }
        }
    }, [window.location.search]);

    return (
        <>
            <Head title={role === 'volunteer' ? 'Register as Volunteer' : 'Register as Support Seeker'} />

            <div className="flex min-h-screen w-full bg-white font-sans antialiased selection:bg-brand-red/10 selection:text-brand-red">
                {/* Panel brand: hanya tablet dan desktop */}
                <aside className="relative hidden overflow-hidden bg-brand-red md:flex md:w-[40%] md:flex-col md:justify-between md:p-12 lg:w-1/2 lg:p-16">
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
                    <div className="flex w-full max-w-md flex-col gap-8 md:max-w-120">
                        {/* Header */}
                        <div className="flex flex-col gap-6">
                            <Link
                                href={home().url}
                                className="-ml-2 self-start rounded-full p-2 transition-all hover:bg-neutral-50 active:scale-95"
                            >
                                <ChevronLeft className="size-6 text-brand-ink" />
                            </Link>

                            <div className="flex flex-col items-center text-center md:items-start md:text-left">
                                <h1 className="text-[32px] leading-10 font-extrabold tracking-tight text-brand-red md:text-[40px] md:font-semibold md:leading-tight">
                                    Registration as
                                    <br />
                                    {role === 'volunteer' ? 'Volunteer' : 'Support Seeker'}
                                </h1>
                            </div>
                        </div>

                        {/* Form utama */}
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <div className="grid gap-5">
                                    {/* Role terpilih */}
                                    <input type="hidden" name="role" value={role} />

                                    {/* Nama lengkap */}
                                    <div className="grid gap-1.5">
                                        <label htmlFor="name" className="text-xs font-bold text-brand-ink md:text-sm">
                                            Full name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            required
                                            autoFocus
                                            className={inputClass}
                                            placeholder="Enter your full name..."
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email */}
                                    <div className="grid gap-1.5">
                                        <label htmlFor="email" className="text-xs font-bold text-brand-ink md:text-sm">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            className={inputClass}
                                            placeholder="Enter your email..."
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Nomor telepon */}
                                    <div className="grid gap-1.5">
                                        <label htmlFor="phone" className="text-xs font-bold text-brand-ink md:text-sm">
                                            Phone number
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            required
                                            className={inputClass}
                                            placeholder="Enter your phone number..."
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    {/* Bantuan apa yang dibutuhkan: hanya support seeker */}
                                    {role === 'difabel' && (
                                        <div className="grid gap-1.5">
                                            <label htmlFor="support_type" className="text-xs font-bold text-brand-ink md:text-sm">
                                                How can we support you?
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="support_type"
                                                    name="support_type"
                                                    required
                                                    defaultValue=""
                                                    className={`${inputClass} appearance-none pr-10`}
                                                >
                                                    <option value="" disabled>
                                                        Select an option
                                                    </option>
                                                    <option value="Bantuan Navigasi / Jalan">Bantuan Navigasi / Jalan</option>
                                                    <option value="Panggilan Telepon Pendamping">Panggilan Telepon Pendamping</option>
                                                    <option value="Informasi Fasilitas Publik">Informasi Fasilitas Publik</option>
                                                    <option value="Lainnya">Lainnya</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-red">
                                                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <InputError message={errors.support_type} />
                                        </div>
                                    )}

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
                                            placeholder="Create your password..."
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Konfirmasi password */}
                                    <div className="grid gap-1.5">
                                        <label htmlFor="password_confirmation" className="text-xs font-bold text-brand-ink md:text-sm">
                                            Confirm Password
                                        </label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            required
                                            className={inputClass}
                                            placeholder="Confirm your password..."
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    {/* Persetujuan */}
                                    <div className="mt-1 flex items-start gap-3">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id="agree"
                                                name="agree"
                                                type="checkbox"
                                                required
                                                className="size-4 cursor-pointer rounded border-neutral-300 accent-brand-red"
                                            />
                                        </div>
                                        <label htmlFor="agree" className="cursor-pointer text-xs leading-normal font-bold text-neutral-500 select-none md:text-sm">
                                            I agree to the{' '}
                                            <Link href="/privacy-policy" className="text-brand-red transition-all hover:underline">
                                                Terms Condition and Privacy policy
                                            </Link>
                                        </label>
                                    </div>

                                    {/* Tombol daftar */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-brand-lime py-3.5 text-base font-bold text-brand-ink shadow-[0_4px_16px_rgba(223,255,0,0.35)] transition-all duration-300 select-none hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                                    >
                                        {processing && <Spinner className="size-4 text-brand-ink" />}
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </Form>

                        {/* Footer */}
                        <div className="pb-2 text-center text-xs text-neutral-500 md:text-left md:text-sm">
                            Already have an account?{' '}
                            <Link href={login().url} className="font-bold text-brand-red underline-offset-4 decoration-2 transition-all hover:underline">
                                Log In
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}