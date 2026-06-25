import { Form, Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white px-6 font-sans antialiased selection:bg-[#E1005E]/10 selection:text-[#E1005E]">
            <Head title="Confirm password" />

            <div className="w-full max-w-md bg-white">
                
                {/* Header */}
                <div className="flex items-center gap-3 self-start mb-8">
                    <Link href="/settings/security" className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors">
                        <ChevronLeft className="size-6 text-neutral-800" />
                    </Link>
                    <h1 className="text-2xl font-extrabold text-[#E1005E] tracking-tight">
                        Confirm Password
                    </h1>
                </div>

                <div className="w-full bg-[#F5F5F7] rounded-[24px] p-6 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                    <div className="mb-6">
                        <p className="text-sm text-neutral-500 mt-1">
                            This is a secure area of the application. Please confirm your password before continuing.
                        </p>
                    </div>

                    <Form {...store.form()} resetOnSuccess={['password']}>
                        {({ processing, errors }) => (
                            <div className="space-y-6">
                                <div className="grid gap-2">
                                    <label htmlFor="password" className="text-sm font-semibold text-neutral-800">
                                        Password
                                    </label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        autoFocus
                                        className="mt-1 block w-full rounded-xl border-neutral-300 text-black focus:border-[#E1005E] focus:ring-[#E1005E]"
                                    />

                                    <InputError message={errors.password} />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3.5 cursor-pointer rounded-full font-bold text-white bg-linear-to-r from-[#E1005E] to-[#4338ca] hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(225,0,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        data-test="confirm-password-button"
                                    >
                                        {processing && <Spinner className="size-4" />}
                                        Confirm password
                                    </button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>

            </div>
        </div>
    );
}
