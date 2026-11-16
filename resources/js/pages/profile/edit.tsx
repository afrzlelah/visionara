import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { FormEventHandler, useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';

const inputClass =
    'w-full rounded-[12px] border border-neutral-300 bg-white px-4 py-3 text-sm text-brand-ink outline-none transition-all placeholder:text-neutral-400 focus:border-brand-red focus:ring-1 focus:ring-brand-red md:bg-[#F8F8F8] md:py-3.5';

const genderCardBase =
    'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[16px] border p-4 transition-all md:p-5';

export default function EditProfile() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const [previewUrl, setPreviewUrl] = useState<string | null>(user.photo_url || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: user.name || '',
        age: user.age || '',
        gender: user.gender || '',
        bio: user.bio || '',
        photo: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/profile', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                alert('Profile berhasil diperbarui!');
            },
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo' as any, file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const genderOptions = [
        { value: 'Male', seed: 'Felix' },
        { value: 'Female', seed: 'Jessica' },
    ];

    return (
        <>
            <Head title="Edit Profile" />

            <div className="flex w-full flex-col gap-6 font-sans antialiased selection:bg-brand-red/10 selection:text-brand-red md:gap-8">
                {/* Header */}
                <div className="flex items-center gap-1.5 self-start">
                    <Link href="/profile" className="-ml-1 cursor-pointer rounded-full p-1.5 transition-all hover:bg-neutral-50 active:scale-95">
                        <ChevronLeft className="size-5 text-brand-red md:size-6" />
                    </Link>
                    <h1 className="text-xl font-extrabold tracking-tight text-brand-red md:text-3xl">Edit Profile</h1>
                </div>

                <form
                    onSubmit={submit}
                    className="flex w-full flex-col gap-6 md:grid md:grid-cols-[320px_minmax(0,1fr)] md:items-start md:gap-6"
                >
                    {/* Kolom kiri: foto profil */}
                    <div className="flex flex-col items-center gap-3 rounded-[20px] border border-neutral-200 bg-white p-6 md:h-full md:min-h-120 md:justify-center md:gap-5 md:p-8">
                        <div
                            className="flex size-22.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-linear-to-tr from-brand-red via-brand-red-bright to-brand-blue p-0.75 shadow-sm transition-all active:scale-95 md:size-40 md:p-1.25"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt={data.name}
                                    className="size-full rounded-full border-[3px] border-white object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center rounded-full border-[3px] border-white bg-brand-lime text-3xl font-black text-brand-ink md:text-6xl">
                                    {data.name ? data.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                        </div>

                        <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handlePhotoChange} />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="cursor-pointer rounded-full bg-brand-red/10 px-4 py-2 text-sm font-semibold text-brand-red transition-all hover:bg-brand-red/15"
                        >
                            Edit picture
                        </button>
                    </div>

                    {/* Kolom kanan: form */}
                    <div className="flex flex-col gap-5 rounded-[20px] border border-neutral-200 bg-white p-6 md:gap-6 md:p-8">
                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-sm font-bold text-brand-ink">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={inputClass}
                                placeholder="Enter your name..."
                            />
                            {errors.name && <span className="text-xs text-brand-bright">{errors.name}</span>}
                        </div>

                        {/* Age */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="age" className="text-sm font-bold text-brand-ink">
                                Age
                            </label>
                            <input
                                id="age"
                                type="number"
                                value={data.age}
                                onChange={(e) => setData('age', e.target.value)}
                                className={inputClass}
                                placeholder="Enter your age..."
                            />
                            {errors.age && <span className="text-xs text-brand-bright">{errors.age}</span>}
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-sm font-bold text-brand-ink">Gender</span>
                            <div className="grid grid-cols-2 gap-4">
                                {genderOptions.map(({ value, seed }) => {
                                    const selected = data.gender === value;
                                    return (
                                        <button
                                            type="button"
                                            key={value}
                                            onClick={() => setData('gender', value)}
                                            aria-pressed={selected}
                                            className={`${genderCardBase} ${
                                                selected
                                                    ? 'border-2 border-brand-red bg-brand-red/5 shadow-sm'
                                                    : 'border-neutral-300 bg-white hover:bg-neutral-50'
                                            }`}
                                        >
                                            <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-brand-red/10 md:size-20">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                                                    alt={value}
                                                    className="size-14 md:size-16"
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-brand-red md:text-base">{value}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.gender && <span className="text-xs text-brand-bright">{errors.gender}</span>}
                        </div>

                        {/* Bio */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="bio" className="text-sm font-bold text-brand-ink">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                rows={4}
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                className={`${inputClass} resize-none`}
                                placeholder="Tulis bio singkat..."
                            />
                            {errors.bio && <span className="text-xs text-brand-bright">{errors.bio}</span>}
                        </div>

                        {/* Tombol simpan */}
                        <div className="flex justify-center pt-2 pb-20 md:justify-end md:pb-0">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full cursor-pointer rounded-[14px] bg-brand-lime px-8 py-3.5 text-base font-bold text-brand-ink shadow-[0_4px_16px_rgba(223,255,0,0.35)] transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto md:py-3"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

EditProfile.layout = (page: any) => <AppLayout children={page} />;