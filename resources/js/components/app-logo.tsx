import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[#E1005E] text-white">
                <img src="/images/Visiora 2.png" alt="logo visiora" className="w-18 h-auto object-contain" />            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="text-xl font-bold">Visionara</span>
            </div>
        </>
    );
}
