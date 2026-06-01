import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[#E1005E] text-white">
                <span className="font-extrabold text-xs tracking-tighter">Op</span>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <img src="/images/logoOptira.png" alt="logo optira" className="w-18 h-auto object-contain" />
            </div>
        </>
    );
}
