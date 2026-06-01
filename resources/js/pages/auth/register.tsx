import { Form, Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
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

export default function Register({ passwordRules }: Props) {
    // Parse initial role from query parameter
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialRole = searchParams?.get('role') || 'difabel';
    const [role, setRole] = useState<'volunteer' | 'difabel'>(
        initialRole === 'volunteer' ? 'volunteer' : 'difabel'
    );

    // Keep state in sync if URL query parameter changes
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
                            {role === 'volunteer' ? (
                                <h1 className="text-[32px] font-extrabold text-[#E1005E] tracking-tight font-Outfit leading-10">
                                    Registration as<br />Volunteer
                                </h1>
                            ) : (
                                <h1 className="text-[32px] font-extrabold text-[#E1005E] tracking-tight font-Outfit leading-10">
                                    Registration as<br />Support Seeker
                                </h1>
                            )}
                        </div>
                    </div>

                    {/* Main Form */}
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        className="flex flex-col gap-5 mt-8 flex-1 justify-center"
                    >
                        {({ processing, errors }) => (
                            <div className="grid gap-5">
                                
                                {/* Hidden role input to bind selected role */}
                                <input type="hidden" name="role" value={role} />

                                {/* Full Name Field */}
                                <div className="grid gap-1.5">
                                    <label htmlFor="name" className="text-xs md:text-sm font-bold text-neutral-800">
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        required
                                        autoFocus
                                        className="w-full px-4 py-3 rounded-[14px] border border-neutral-300 focus:border-[#E1005E] focus:ring-1 focus:ring-[#E1005E] bg-white transition-all text-sm placeholder:text-neutral-400 outline-none"
                                        placeholder="Enter your full name..."
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Email Field */}
                                <div className="grid gap-1.5">
                                    <label htmlFor="email" className="text-xs md:text-sm font-bold text-neutral-800">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 rounded-[14px] border border-neutral-300 focus:border-[#E1005E] focus:ring-1 focus:ring-[#E1005E] bg-white transition-all text-sm placeholder:text-neutral-400 outline-none"
                                        placeholder="Enter your email..."
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Phone Number Field */}
                                <div className="grid gap-1.5">
                                    <label htmlFor="phone" className="text-xs md:text-sm font-bold text-neutral-800">
                                        Phone number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full px-4 py-3 rounded-[14px] border border-neutral-300 focus:border-[#E1005E] focus:ring-1 focus:ring-[#E1005E] bg-white transition-all text-sm placeholder:text-neutral-400 outline-none"
                                        placeholder="Enter your phone number..."
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                {/* Conditionally Render: How can we support you? Dropdown for Support Seeker */}
                                {role === 'difabel' && (
                                    <div className="grid gap-1.5">
                                        <label htmlFor="support_type" className="text-xs md:text-sm font-bold text-neutral-800">
                                            How can we support you?
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="support_type"
                                                name="support_type"
                                                required
                                                className="w-full px-4 py-3 rounded-[14px] border border-neutral-300 focus:border-[#E1005E] focus:ring-1 focus:ring-[#E1005E] bg-white transition-all text-sm outline-none appearance-none pr-10 text-neutral-850"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Select an option</option>
                                                <option value="Bantuan Navigasi / Jalan">Bantuan Navigasi / Jalan</option>
                                                <option value="Panggilan Telepon Pendamping">Panggilan Telepon Pendamping</option>
                                                <option value="Informasi Fasilitas Publik">Informasi Fasilitas Publik</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E1005E]">
                                                <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </div>
                                        </div>
                                        <InputError message={errors.support_type} />
                                    </div>
                                )}

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
                                        placeholder="Creat your password..."
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="grid gap-1.5">
                                    <label htmlFor="password_confirmation" className="text-xs md:text-sm font-bold text-neutral-800">
                                        Confirm Password
                                    </label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        required
                                        className="w-full px-4 py-3 rounded-[14px] border border-neutral-300 focus:border-[#E1005E] focus:ring-1 focus:ring-[#E1005E] bg-white transition-all text-sm placeholder:text-neutral-400 outline-none"
                                        placeholder="Confirm your password ..."
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                {/* Custom T&C Checkbox */}
                                <div className="flex items-start gap-3 mt-1">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="agree"
                                            name="agree"
                                            type="checkbox"
                                            required
                                            className="size-4.5 rounded border-neutral-300 text-[#E1005E] focus:ring-[#E1005E] cursor-pointer"
                                        />
                                    </div>
                                    <label htmlFor="agree" className="text-xs font-bold text-neutral-500 leading-normal select-none cursor-pointer">
                                        I agree to the{' '}
                                        <span className="text-[#E1005E] hover:underline transition-all">
                                            Therm Condition and Privacy policy
                                        </span>
                                    </label>
                                </div>

                                {/* Gradient Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-4 w-full py-3.5 rounded-[14px] font-bold text-white bg-linear-to-r from-[#E1005E] to-[#0052FF] hover:opacity-95 disabled:opacity-50 active:scale-[0.99] transition-all duration-300 shadow-[0_4px_16px_rgba(225,0,94,0.2)] flex items-center justify-center gap-2 cursor-pointer select-none text-base"
                                >
                                    {processing && <Spinner className="size-4 text-white" />}
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </Form>

                    {/* Footer */}
                    <div className="text-center text-xs md:text-sm text-neutral-500 mt-8 pb-2">
                        Already have an account?{' '}
                        <Link 
                            href={login().url} 
                            className="text-[#E1005E] font-bold hover:underline decoration-2 underline-offset-4 transition-all"
                        >
                            Log In
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}
