import { Form, Head, Link } from '@inertiajs/react';
import { useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import AppLayout from '@/layouts/app-layout';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
};

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Password and Security" />

            <div className="flex flex-col gap-6 w-full font-sans antialiased pb-6 selection:bg-[#E1005E]/10 selection:text-[#E1005E]">
                
                {/* Header */}
                <div className="flex items-center gap-3 self-start">
                    <Link href="/settings" className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors">
                        <ChevronLeft className="size-6 text-neutral-800" />
                    </Link>
                    <h1 className="text-2xl font-extrabold text-[#E1005E] tracking-tight">
                        Password & Security
                    </h1>
                </div>

                <div className="w-full bg-[#F5F5F7] rounded-[24px] p-6 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-neutral-900">Update password</h2>
                        <p className="text-sm text-neutral-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                    </div>

                    <Form
                        {...SecurityController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) passwordInput.current?.focus();
                            if (errors.current_password) currentPasswordInput.current?.focus();
                        }}
                        className="space-y-5"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2">
                                    <label htmlFor="current_password" className="text-sm font-semibold text-neutral-800">
                                        Current password
                                    </label>
                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-[#E1005E] focus:ring-[#E1005E]"
                                        autoComplete="current-password"
                                        placeholder="Current password"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="password" className="text-sm font-semibold text-neutral-800">New password</label>
                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-[#E1005E] focus:ring-[#E1005E]"
                                        autoComplete="new-password"
                                        placeholder="New password"
                                        passwordrules={props.passwordRules}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="password_confirmation" className="text-sm font-semibold text-neutral-800">
                                        Confirm password
                                    </label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-[#E1005E] focus:ring-[#E1005E]"
                                        autoComplete="new-password"
                                        placeholder="Confirm password"
                                        passwordrules={props.passwordRules}
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3.5 rounded-full font-bold text-white bg-linear-to-r from-[#E1005E] to-[#4338ca] hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(225,0,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        data-test="update-password-button"
                                    >
                                        Save Password
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

Security.layout = (page: any) => <AppLayout children={page} />;
