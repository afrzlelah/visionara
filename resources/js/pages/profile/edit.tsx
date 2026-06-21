import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { FormEventHandler, useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';

export default function EditProfile() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const [previewUrl, setPreviewUrl] = useState<string | null>(user.photo_url || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', // for method spoofing
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
            }
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo' as any, file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <Head title="Edit Profile" />

            <div className="flex flex-col gap-6 w-full font-sans antialiased pb-24">
                
                {/* Header */}
                <div className="flex items-center gap-1.5 self-start">
                    <Link href="/profile" className="cursor-pointer active:scale-95 transition-all">
                        <ChevronLeft className="size-5 text-[#E1005E]" />
                    </Link>
                    <h1 className="text-xl font-extrabold text-[#E1005E] tracking-tight font-Outfit">
                        Edit Profile
                    </h1>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-5 w-full mt-4">
                    
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="size-[90px] rounded-full p-[3px] bg-[#0052FF] flex items-center justify-center shrink-0 shadow-sm cursor-pointer active:scale-95 transition-all" onClick={() => fileInputRef.current?.click()}>
                            {previewUrl ? (
                                <img 
                                    src={previewUrl} 
                                    alt={data.name} 
                                    className="size-full rounded-full object-cover border-[3px] border-white"
                                />
                            ) : (
                                <div className="size-full rounded-full bg-neutral-200 flex items-center justify-center border-[3px] border-white text-3xl font-black text-[#0052FF] font-Outfit">
                                    {data.name ? data.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-[#4DBAE9] font-medium cursor-pointer"
                        >
                            Edit picture
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-4">
                        
                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-neutral-800">Name</label>
                            <input 
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full rounded-[10px] border border-neutral-300 px-4 py-2 text-sm text-neutral-900 focus:ring-[#E1005E] focus:border-[#E1005E]"
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                        </div>

                        {/* Age */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-neutral-800">Age</label>
                            <input 
                                type="number"
                                value={data.age}
                                onChange={e => setData('age', e.target.value)}
                                className="w-full rounded-[10px] border border-neutral-300 px-4 py-2 text-sm text-neutral-900 focus:ring-[#E1005E] focus:border-[#E1005E]"
                            />
                            {errors.age && <span className="text-xs text-red-500">{errors.age}</span>}
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-neutral-800">Gender</label>
                            <div className="grid grid-cols-2 gap-4">
                                
                                {/* Male Card */}
                                <div 
                                    onClick={() => setData('gender', 'Male')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-[12px] border cursor-pointer transition-all ${data.gender === 'Male' ? 'border-[#E1005E] bg-[#E1005E]/5 shadow-sm' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}
                                >
                                    {/* Mockup illustration placeholder */}
                                    <div className="size-16 rounded-full bg-[#E1005E]/10 flex items-center justify-center mb-2 overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Male" className="w-14 h-14" />
                                    </div>
                                    <span className="text-xs font-semibold text-[#E1005E]">Male</span>
                                </div>

                                {/* Female Card */}
                                <div 
                                    onClick={() => setData('gender', 'Female')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-[12px] border cursor-pointer transition-all ${data.gender === 'Female' ? 'border-[#E1005E] bg-[#E1005E]/5 shadow-sm' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}
                                >
                                    {/* Mockup illustration placeholder */}
                                    <div className="size-16 rounded-full bg-[#E1005E]/10 flex items-center justify-center mb-2 overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" alt="Female" className="w-14 h-14" />
                                    </div>
                                    <span className="text-xs font-semibold text-[#E1005E]">Female</span>
                                </div>

                            </div>
                            {errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
                        </div>

                        {/* Bio */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-neutral-800">Bio</label>
                            <input 
                                type="text"
                                value={data.bio}
                                onChange={e => setData('bio', e.target.value)}
                                className="w-full rounded-[10px] border border-neutral-300 px-4 py-2 text-sm text-neutral-900 focus:ring-[#E1005E] focus:border-[#E1005E]"
                            />
                            {errors.bio && <span className="text-xs text-red-500">{errors.bio}</span>}
                        </div>

                    </div>

                    {/* Bottom Action */}
                    <div className="w-full pt-6 pb-20 flex justify-center">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-fit px-5 py-3 rounded-full bg-[#E1005E] hover:bg-[#a7094b] active:scale-[0.98] transition-all font-semibold text-white text-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
}

EditProfile.layout = (page: any) => <AppLayout children={page} />;
