import { Form, Head, Link } from '@inertiajs/react';
import { ChevronLeft, Eye, Shield } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

const inputClass =
    'w-full rounded-[14px] border border-neutral-300 bg-white px-4 py-3 text-sm text-brand-ink outline-none transition-all placeholder:text-neutral-400 focus:border-brand-red focus:ring-1 focus:ring-brand-red md:py-3.5';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password" />

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
                            <span className="text-brand-lime">&amp;</span> Pemberdayaan Tuli
                        </h2>
                        <p className="max-w-md text-base leading-relaxed text-white/85 lg:text-lg">
                            Area aman untuk memastikan hanya kamu yang dapat mengakses akun.
                        </p>
                    </div>
                </aside>

                {/* Panel form */}
                <main className="flex flex-1 items-center justify-center px-6 py-8 md:px-12">
                    <div className="flex w-full max-w-md flex-col gap-8 md:max-w-105">
                        {/* Header */}
                        <div className="flex flex-col gap-6">
                            <Link
                                href="/settings/security"
                                className="-ml-2 self-start rounded-full p-2 transition-all hover:bg-neutral-50 active:scale-95"
                                aria-label="Kembali"
                            >
                                <ChevronLeft className="size-6 text-brand-ink" />
                            </Link>

                            <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
                                <span className="inline-flex items-center gap-2 rounded-full bg-brand-red/10 py-1.5 pr-3.5 pl-3 text-[13px] font-semibold text-brand-red">
                                    <Shield className="size-4" />
                                    Area aman
                                </span>
                                <h1 className="text-[32px] leading-tight font-extrabold tracking-tight text-brand-red md:text-[40px] md:font-semibold">
                                    Confirm Password
                                </h1>
                                <p className="text-sm leading-relaxed text-neutral-500 md:text-base">
                                    Ini adalah area aman aplikasi. Silakan konfirmasi kata sandimu untuk melanjutkan.
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <label htmlFor="password" className="text-xs font-bold text-brand-ink md:text-sm">
                                            Password
                                        </label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            autoFocus
                                            className={inputClass}
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        data-test="confirm-password-button"
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-brand-lime py-3.5 text-base font-bold text-brand-ink shadow-[0_4px_16px_rgba(223,255,0,0.35)] transition-all duration-300 select-none hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 md:py-4"
                                    >
                                        {processing && <Spinner className="size-4 text-brand-ink" />}
                                        Confirm password
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>
                </main>
            </div>
        </>
    );
}