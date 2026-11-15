import { Head } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    Check,
    Menu,
    MessageCircle,
    Minus,
    Plus,
    Smartphone,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { register } from '@/routes';

const navItems = [
    ['Beranda', '#beranda'],
    ['Fitur', '#fitur'],
    ['Cara Kerja', '#cara-kerja'],
    ['Tentang', '#tentang'],
    ['Kontak', '#kontak'],
    ['FAQ', '#faq'],
];

const testimonials = [
    {
        quote: 'Deskripsi situasi yang memberi konteks dapat membantu pengguna memahami lingkungan, bukan hanya mengenali satu objek.',
        name: 'Konteks lingkungan',
        org: 'Kebutuhan pengguna',
        mark: 'AI',
        color: '#d50057',
    },
    {
        quote: 'Pemindaian otomatis dirancang untuk mengurangi tindakan berulang saat pengguna mengeksplorasi lingkungan sekitar.',
        name: 'Pemindaian otomatis',
        org: 'Konsep Padhang',
        mark: 'SCAN',
        color: '#7c285e',
    },
    {
        quote: 'Relawan dapat melengkapi AI ketika situasi tidak jelas, kompleks, atau membutuhkan bantuan manusia secara langsung.',
        name: 'Bantuan relawan',
        org: 'Dukungan manusia',
        mark: 'SOS',
        color: '#56833c',
    },
];

const faqs = [
    [
        'Apa itu Padhang?',
        'Padhang adalah konsep platform asistif berbasis web untuk membantu pengguna tunanetra memahami lingkungan dan bergerak dengan lebih percaya diri.',
    ],
    [
        'Bagaimana Padhang membantu memahami lingkungan?',
        'AI Vision menyusun deskripsi kontekstual tentang situasi sekitar. Informasi dapat disampaikan melalui interaksi suara dan text-to-speech.',
    ],
    [
        'Apakah objek dipindai secara otomatis?',
        'Konsep Padhang mencakup deteksi objek otomatis agar pengguna tidak perlu mengulang pemindaian secara manual untuk setiap objek.',
    ],
    [
        'Apakah AI menggantikan bantuan relawan?',
        'Tidak. AI membantu pengenalan lingkungan sehari-hari, sedangkan sistem panggilan relawan menyediakan dukungan manusia untuk situasi yang belum jelas atau kompleks.',
    ],
    [
        'Apakah Padhang dapat digunakan tanpa internet?',
        'Konsep saat ini menggunakan layanan AI berbasis cloud sehingga membutuhkan koneksi internet. Dukungan offline merupakan pengembangan lanjutan.',
    ],
];

const partners = [
    'Mobilitas', 'Pendidikan', 'Kesehatan', 'Ruang publik', 'Aktivitas harian',
    'Orientasi tempat', 'Komunikasi suara', 'Bantuan relawan', 'Deteksi objek',
    'Navigasi GPS', 'Deskripsi lingkungan', 'Aksesibilitas digital',
];
const partnerMarks = ['✿', '◈', '▦', '♧', '⚖', '✳'];
const partnerMarkColors = [
    'text-[#d50057]',
    'text-[#43a773]',
    'text-[#14a9ae]',
    'text-[#e3b800]',
    'text-[#df5468]',
    'text-[#098fa5]',
];
const media = [
    'Gemini Vision AI', 'Deteksi otomatis', 'Navigasi GPS', 'Text-to-Speech',
    'Interaksi suara', 'Panggilan relawan',
];

const tw = {
    root: 'isolate w-full overflow-hidden bg-white font-sans text-[#202124] [--padhang-primary:#d50057] [--padhang-accent:#e6005e] [--padhang-highlight:#dfff00] [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-offset-3 [&_a:focus-visible]:outline-[#202124] [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-offset-3 [&_button:focus-visible]:outline-[#202124] motion-reduce:[&_a]:scroll-auto motion-reduce:[&_a]:transition-none motion-reduce:[&_button]:transition-none motion-reduce:[&_*]:animate-none',
    wrap: 'mx-auto w-[min(1200px,calc(100%-64px))] max-[900px]:w-[min(calc(100%-44px),720px)] max-[640px]:w-[calc(100%-38px)]',
    nav: 'sticky top-0 z-40 h-[78px] bg-white shadow-[0_2px_14px_#00275d0c] max-[900px]:h-[70px] max-[640px]:h-[66px]',
    navInner: 'flex h-full items-center justify-between',
    brand: 'inline-flex items-center text-[28px] font-extrabold tracking-[-1.6px] text-[#e6005e] max-[640px]:text-[25px]',
    brandInverse: '!text-white',
    brandMark:
        'relative inline-block size-[30px] rotate-[-42deg] max-[640px]:size-[27px]',
    brandMarkBar:
        'absolute left-[9px] top-0 block h-[29px] w-[11px] rounded-lg bg-[#e6005e] first:rotate-0 last:rotate-90 max-[640px]:left-2 max-[640px]:h-[26px] max-[640px]:w-[10px]',
    menuButton:
        'hidden size-10 cursor-pointer place-items-center border-0 bg-transparent text-[#202124] max-[640px]:grid',
    navLinks:
        'flex items-center gap-[clamp(18px,2.7vw,38px)] text-[13px] font-semibold [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-[#d50057] max-[900px]:gap-[15px] max-[900px]:text-[11px] max-[640px]:absolute max-[640px]:right-0 max-[640px]:top-[66px] max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:gap-0 max-[640px]:bg-white max-[640px]:px-5 max-[640px]:pb-[15px] max-[640px]:pt-[7px] max-[640px]:shadow-[0_15px_20px_#00193312] [&_a]:max-[640px]:border-b [&_a]:max-[640px]:border-[#edf1f4] [&_a]:max-[640px]:py-3 [&_a]:max-[640px]:text-sm',
    navClosed: 'max-[640px]:hidden',
    navOpen: 'max-[640px]:flex',
    blue: "relative isolate overflow-hidden bg-[#d50057] text-white before:pointer-events-none before:absolute before:-z-10 before:left-[-155px] before:top-[215px] before:size-[510px] before:rotate-[42deg] before:rounded-[40%_60%_55%_45%] before:bg-white/5 before:content-[''] after:pointer-events-none after:absolute after:-z-10 after:right-[-230px] after:bottom-[-340px] after:size-[490px] after:rounded-full after:border after:border-white/15 after:shadow-[0_0_0_40px_rgb(255_255_255_/_4%),0_0_0_80px_rgb(255_255_255_/_3%)] after:content-['']",
    hero: 'flex min-h-[635px] items-center max-[900px]:min-h-[570px] max-[640px]:min-h-0',
    heroGrid:
        'grid grid-cols-[1.02fr_.98fr] items-center gap-[46px] py-[70px] pb-[100px] max-[900px]:gap-[15px] max-[900px]:py-[60px] max-[900px]:pb-20 max-[640px]:grid-cols-1 max-[640px]:gap-3 max-[640px]:py-[55px] max-[640px]:pb-20',
    heroCopy: 'relative z-[2] max-w-[565px] max-[640px]:max-w-[460px]',
    heroKicker:
        'mb-[22px] flex items-center gap-[10px] text-[10px] font-bold tracking-[.17em] max-[640px]:mb-[17px] max-[640px]:text-[9px]',
    heroKickerLine: 'h-0.5 w-[27px] bg-[#dfff00]',
    heroTitle:
        'm-0 max-w-[580px] text-[clamp(42px,5vw,68px)] leading-[1.03] font-extrabold tracking-[-2.9px] [&_span]:text-[#dfff00] max-[900px]:text-[clamp(38px,6vw,53px)] max-[640px]:max-w-[470px] max-[640px]:text-[clamp(39px,11vw,54px)] max-[640px]:tracking-[-2px] max-[390px]:text-[38px]',
    heroText:
        'my-6 mb-7 max-w-[425px] text-[17px] leading-[1.65] text-[#e4f4ff] max-[640px]:my-[18px] max-[640px]:mb-[22px] max-[640px]:max-w-[350px] max-[640px]:text-[15px]',
    button: 'inline-flex min-h-12 w-fit items-center justify-center gap-[11px] rounded-[4px] px-5 text-[15px] font-bold transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_9px_24px_#002b6630] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#202124] max-[640px]:min-h-[46px] max-[640px]:text-sm',
    yellowButton: 'bg-[#dfff00] text-[#17202a]',
    heroVisual:
        'relative grid min-h-[440px] place-items-center max-[900px]:min-h-[380px] max-[640px]:mt-[5px] max-[640px]:min-h-[360px] max-[390px]:min-h-[320px]',
    heroImage:
        'relative aspect-[.84] w-[min(410px,82%)] overflow-hidden rounded-[42%_2%_29%_2%] bg-[#effaff] shadow-[24px_24px_0_#ffffff1c] max-[900px]:w-[88%] max-[640px]:aspect-[.9] max-[640px]:w-[min(315px,76%)] max-[390px]:w-[78%] [&_img]:size-full [&_img]:object-cover [&_img]:object-[center_35%] [&_img]:saturate-[.8]',
    scroll: 'absolute bottom-7 left-1/2 grid size-[34px] -translate-x-1/2 place-items-center rounded-full border border-white/40 text-white max-[640px]:hidden',
    statsWrap:
        'relative z-[3] mx-auto -mt-[54px] w-[min(1200px,calc(100%-64px))] max-[900px]:w-[min(calc(100%-44px),720px)] max-[640px]:-mt-[35px] max-[640px]:w-[calc(100%-38px)]',
    stats: 'grid min-h-[111px] grid-cols-3 items-center rounded-lg bg-white shadow-[0_12px_40px_#17365817] max-[640px]:min-h-[88px]',
    stat: 'relative flex min-h-[57px] flex-col items-center justify-center gap-0.5 max-[640px]:min-h-[50px]',
    statNumber:
        'text-[38px] leading-none font-extrabold tracking-[-1px] text-[#d50057] max-[640px]:text-[clamp(25px,8vw,32px)] max-[390px]:text-[25px]',
    statLabel:
        'text-[13px] font-semibold max-[640px]:text-[10px] max-[640px]:text-center max-[390px]:text-[9px]',
    statDivider:
        'absolute top-1/2 right-0 h-11 w-px -translate-y-1/2 bg-[#6bb9ff] max-[640px]:h-[35px]',
    section: 'py-[105px] max-[640px]:py-[70px]',
    partnersSection: 'pt-[92px] pb-[100px] max-[640px]:py-[72px]',
    mediaSection:
        'py-[100px] pb-[110px] max-[640px]:py-[72px] max-[640px]:pb-[78px]',
    faqSection: 'pt-[105px] pb-[110px] max-[640px]:pt-[74px] max-[640px]:pb-20',
    faqHeading:
        '[&>div]:mb-[39px] max-[640px]:[&>div]:mb-[30px] [&_h2]:text-[29px]',
    aboutGrid:
        'grid grid-cols-2 items-center gap-[92px] max-[900px]:gap-12 max-[640px]:grid-cols-1 max-[640px]:gap-[55px]',
    aboutVisual:
        'relative flex min-h-[480px] items-end justify-center max-[900px]:min-h-[390px] max-[640px]:mx-[6px] max-[640px]:min-h-[350px]',
    aboutShape:
        'absolute inset-[57px_5px_6px_24px] rounded-tl-[36%] bg-linear-to-br from-[#d50057] to-[#e6005e] max-[640px]:inset-[45px_0_0]',
    aboutPhoto:
        'relative z-[1] h-[470px] w-[83%] rounded-t-[48%] object-cover object-[center_20%] max-[900px]:h-[385px] max-[640px]:h-[345px] max-[640px]:w-4/5',
    badge: 'absolute top-9 left-0 z-[2] flex items-center gap-[9px] rounded-[3px] bg-white px-[14px] py-[11px] text-[10px] font-bold shadow-[0_7px_24px_#193c5c19] max-[640px]:top-5 [&_span]:text-xl [&_span]:text-[#d50057]',
    eyebrow:
        'mb-[13px] text-[11px] font-extrabold tracking-[.12em] text-[#d50057]',
    aboutTitle:
        'm-0 text-[clamp(32px,3.6vw,47px)] leading-[1.12] font-bold tracking-[-1.6px] max-[900px]:text-[36px] max-[640px]:text-[34px]',
    body: 'my-[22px] mb-[26px] text-sm leading-[1.8] text-[#66717d] max-[640px]:my-[17px] max-[640px]:mb-[21px] max-[640px]:text-[13px]',
    impact: 'border-y border-[#e7edf2] py-[17px] pb-[18px]',
    sdgTitle: 'mb-3 flex items-center gap-2 text-[#13a8d2]',
    sdgWheel: 'text-[30px] leading-none',
    sdgTags:
        'mt-[11px] flex gap-[7px] [&_span]:flex [&_span]:min-h-[66px] [&_span]:w-[85px] [&_span]:flex-col [&_span]:justify-between [&_span]:bg-[#e34668] [&_span]:p-2 [&_span]:text-[19px] [&_span]:font-extrabold [&_span]:text-white [&_span:nth-child(2)]:bg-[#d7a63b] [&_span:nth-child(3)]:bg-[#c7295f] [&_small]:text-[7px] [&_small]:leading-[1.2] max-[640px]:[&_span]:min-h-[61px] max-[640px]:[&_span]:w-[82px]',
    textLink:
        'mt-5 inline-flex items-center gap-2.5 bg-[#dfff00] px-[13px] py-[10px] text-[13px] font-bold',
    sectionHeading:
        'mx-auto mb-12 text-center max-[640px]:mb-8 [&_h2]:m-0 [&_h2]:text-[clamp(29px,3.5vw,43px)] [&_h2]:leading-[1.12] [&_h2]:font-bold [&_h2]:tracking-[-1.6px] max-[640px]:[&_h2]:text-[31px]',
    sectionHeadingLight: '[&_.eyebrow]:text-[#dfff00] [&_h2]:text-white',
    servicesSection: 'pt-10 pb-[105px] max-[640px]:pt-2 max-[640px]:pb-[70px]',
    serviceIntro:
        'my-[-15px] mb-7 flex items-center justify-between gap-[30px] max-[640px]:my-[-6px] max-[640px]:mb-[22px] max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-3 [&_p]:m-0 [&_p]:max-w-[440px] [&_p]:text-[13px] [&_p]:leading-[1.6] [&_p]:text-[#6e7d88] [&_a]:inline-flex [&_a]:items-center [&_a]:gap-2 [&_a]:text-[12px] [&_a]:font-bold [&_a]:text-[#d50057]',
    serviceCards:
        'grid grid-cols-3 gap-[17px] max-[640px]:grid-cols-1 max-[640px]:gap-3',
    serviceCard:
        "relative min-h-[250px] overflow-hidden rounded-[7px] p-6 after:absolute after:top-[68px] after:right-[-74px] after:size-40 after:rounded-full after:border after:border-white/50 after:shadow-[0_0_0_20px_rgb(255_255_255_/_12%),0_0_0_40px_rgb(255_255_255_/_6%)] after:content-[''] max-[900px]:p-[19px] max-[640px]:min-h-[218px] max-[640px]:p-[21px]",
    serviceBlue: 'bg-[#e6005e] text-white',
    serviceCyan: 'bg-[#e5f9ff] text-[#17384a]',
    serviceLime: 'bg-[#f5ffd0] text-[#263500]',
    serviceNumber: 'text-[9px] font-bold tracking-[.12em] opacity-70',
    serviceIcon:
        'my-5 mb-[15px] grid size-[45px] place-items-center rounded-full bg-white/15 text-2xl [&_svg]:w-[23px] max-[640px]:my-[14px] max-[640px]:mb-[11px]',
    serviceIconCyan: 'bg-[#c6effb] text-[#d50057]',
    serviceIconLime: 'bg-[#e4f889] text-[#546a00]',
    serviceTitle: 'm-0 text-[19px] font-semibold tracking-[-.4px]',
    serviceDescription:
        'mt-[7px] mb-0 max-w-[290px] text-[11px] leading-[1.6] opacity-80',
    serviceArrow:
        'absolute right-5 bottom-[17px] z-[2] grid size-8 place-items-center rounded-full border border-current [&_svg]:w-4',
    testimonialsSection:
        'bg-[#d50057] py-[92px] pb-[78px] max-[640px]:py-[70px] max-[640px]:pb-[54px]',
    testimonialWindow: 'min-w-0 max-[640px]:overflow-hidden',
    testimonialGrid:
        'grid grid-cols-3 gap-5 max-[640px]:flex max-[640px]:gap-0 max-[640px]:translate-x-[var(--testimonial-offset)] max-[640px]:transition-transform max-[640px]:duration-300',
    testimonialCard:
        'relative flex min-h-[257px] flex-col overflow-hidden rounded-[9px] bg-white px-[22px] pt-[23px] pb-[18px] text-[#1c2934] shadow-[0_10px_25px_#004f9b19] max-[900px]:px-[17px] max-[640px]:min-h-[225px] max-[640px]:flex-[0_0_100%] max-[640px]:p-5',
    testimonialTop: 'flex items-center justify-between text-[#69b5ef]',
    pill: 'rounded-[3px] border border-[#a4d5ff] px-2 py-[5px] text-[9px] font-bold text-[#1886dc]',
    quote: 'relative z-[1] my-[23px] mb-auto text-xs leading-[1.7] text-[#75818b] max-[900px]:text-[11px] max-[640px]:text-xs',
    testimonialBottom:
        'mt-[18px] flex items-end justify-between border-t border-[#dbe2e7] pt-[14px] [&_div]:flex [&_div]:flex-col [&_div]:gap-[3px] [&_strong]:text-xs [&_span]:text-[10px] [&_span]:text-[#7d8993] [&_b]:text-sm',
    quoteGhost:
        'absolute right-[11px] bottom-[49px] font-serif text-[97px] leading-none text-[#e5f4ff]',
    dots: 'mt-[25px] flex justify-center gap-[5px] [&_button]:grid [&_button]:size-[18px] [&_button]:cursor-pointer [&_button]:place-items-center [&_button]:border-0 [&_button]:bg-transparent [&_span]:size-2 [&_span]:rounded-full [&_span]:border [&_span]:border-[#dfff00] [&_span.active-dot]:w-4 [&_span.active-dot]:rounded-full [&_span.active-dot]:bg-[#dfff00]',
    partnersGrid:
        'grid grid-cols-7 items-center gap-x-6 gap-y-[30px] max-[900px]:grid-cols-4 max-[640px]:grid-cols-2 max-[640px]:gap-x-3 max-[640px]:gap-y-5',
    partner:
        'flex min-h-[60px] items-center justify-center gap-[7px] text-left text-[11px] leading-[1.2] font-bold text-[#394c5a] max-[640px]:min-h-[55px] max-[640px]:text-[10px]',
    partnerSymbol: 'text-[26px] max-[640px]:text-[23px]',
    partnerFeatured: 'min-h-[76px] rounded bg-[#25235f] text-[#ffe81c]',
    appSection: 'min-h-[480px] bg-[#d50057] max-[640px]:min-h-0',
    appGrid:
        'grid min-h-[480px] grid-cols-2 items-center gap-[60px] max-[640px]:min-h-0 max-[640px]:grid-cols-1 max-[640px]:gap-0',
    appCopy:
        'py-[65px] max-[640px]:pt-[62px] max-[640px]:pr-0 max-[640px]:pb-[18px]',
    appHash:
        'mb-[10px] text-[clamp(30px,4vw,45px)] leading-none font-extrabold tracking-[-1.8px] text-[#dfff00] max-[640px]:text-[37px]',
    appTitle:
        'm-0 text-[clamp(31px,4vw,46px)] leading-[1.1] font-bold tracking-[-1.5px] text-white max-[640px]:text-[37px]',
    appDescription:
        'my-[17px] mb-[21px] max-w-[380px] text-[13px] leading-[1.7] text-[#def0ff]',
    playButton:
        'flex min-h-[49px]  items-center gap-2.5 rounded-md bg-[#12171a] px-[11px] py-1.5 text-white',
    playTriangle: 'text-[26px] text-[#61d488]',
    appCaption:
        'mt-[21px] flex items-center gap-[7px] text-[10px] text-[#c0e3ff]',
    phoneStage:
        'relative flex h-[480px] items-end justify-center overflow-hidden max-[640px]:h-[390px]',
    phone: 'relative z-[1] h-[445px] w-[290px] overflow-hidden rounded-t-[40px] border-[7px] border-b-0 border-[#17212a] bg-[#f7fbff] px-[14px] pt-[18px] text-[#253443] shadow-[0_0_0_2px_#74818a,0_-5px_35px_#06275b5c] max-[640px]:h-[355px] max-[640px]:w-[260px] max-[640px]:px-3',
    phoneNotch:
        'absolute top-1 left-1/2 h-[17px] w-[100px] -translate-x-1/2 rounded-b-[13px] bg-[#17212a]',
    phoneStatus: 'flex justify-between px-2 pb-3 text-[8px] font-bold',
    phoneHeader:
        'flex items-center justify-between px-1 pt-1 pb-3 [&_.brand]:text-[20px] [&_.brand-mark]:size-5 [&_.brand-mark_i]:left-[6px] [&_.brand-mark_i]:h-[19px] [&_.brand-mark_i]:w-2',
    phoneAvatar:
        'grid size-6 place-items-center rounded-full bg-[#dff6ff] text-[11px] font-extrabold text-[#d50057]',
    phoneBanner:
        'flex min-h-[145px] flex-col rounded-[13px] bg-linear-to-br from-[#d50057] to-[#e6005e] p-[14px] text-white max-[640px]:min-h-[124px] [&_small]:text-[7px] [&_small]:opacity-80 [&_b]:my-2 [&_b]:mb-1 [&_b]:max-w-[160px] [&_b]:text-base [&_b]:leading-[1.1] [&_span]:text-[8px] [&_i]:mt-[10px] [&_i]:w-fit [&_i]:rounded-sm [&_i]:bg-[#dfff00] [&_i]:px-[7px] [&_i]:py-[5px] [&_i]:text-[7px] [&_i]:font-extrabold [&_i]:not-italic [&_i]:text-[#263000] max-[640px]:[&_b]:text-sm',
    phoneLabel:
        'mt-[15px] mb-[9px] text-[10px] font-bold max-[640px]:mt-[11px]',
    phoneTiles:
        'grid grid-cols-3 gap-[7px] [&_span]:flex [&_span]:min-h-[62px] [&_span]:flex-col [&_span]:items-center [&_span]:justify-center [&_span]:gap-[5px] [&_span]:rounded-lg [&_span]:bg-white [&_span]:text-[17px] [&_span]:shadow-[0_3px_11px_#2976a619] [&_small]:text-[7px] max-[640px]:[&_span]:min-h-[54px]',
    phoneNav:
        'mt-[13px] flex justify-around border-t border-[#e6edf2] pt-[9px] text-[#1486dd] max-[640px]:mt-[9px] [&_span]:flex [&_span]:flex-col [&_span]:items-center [&_span]:gap-0.5 [&_span]:text-[13px] [&_small]:text-[6px] [&_small]:text-[#83909a]',
    mediaLogos:
        'flex flex-wrap items-center justify-center gap-[clamp(24px,5vw,70px)]',
    mediaLogo:
        'text-[22px] font-extrabold tracking-[-1px] text-[#67727c] opacity-80 grayscale max-[640px]:text-[18px]',
    contactBanner:
        'relative min-h-[305px] overflow-hidden bg-[#d50057] text-white',
    contactPhoto:
        'absolute inset-0 bg-cover bg-[center_48%] opacity-[.22] grayscale',
    contactOverlay:
        'absolute inset-0 bg-linear-to-r from-[#e6005e] from-[8%] via-[#e6005e] via-1/2 to-[#e6005e]',
    contactInner:
        'relative grid min-h-[305px] grid-cols-[.85fr_1fr] items-center max-[640px]:min-h-[300px] max-[640px]:grid-cols-[.85fr_1.15fr] max-[640px]:gap-[10px] max-[390px]:grid-cols-[.78fr_1.22fr]',
    contactPerson:
        'relative flex h-[305px] items-end justify-center self-end max-[640px]:h-[270px] [&_img]:h-[280px] [&_img]:w-[280px] [&_img]:rounded-t-[48%] [&_img]:object-cover [&_img]:object-[center_20%] [&_img]:saturate-[.78] [&_img]:shadow-[0_15px_0_-8px_#025bbb] max-[640px]:[&_img]:h-[240px] max-[640px]:[&_img]:w-[205px] max-[390px]:[&_img]:h-[220px] max-[390px]:[&_img]:w-[175px] [&_span]:absolute [&_span]:top-[55px] [&_span]:right-[15%] [&_span]:grid [&_span]:size-12 [&_span]:place-items-center [&_span]:rounded-full [&_span]:bg-[#dfff00] [&_span]:text-[23px] max-[640px]:[&_span]:top-[54px] max-[640px]:[&_span]:right-0 max-[640px]:[&_span]:size-[37px] max-[640px]:[&_span]:text-lg',
    contactCopy:
        'max-w-[470px] py-[30px] [&_h2]:mb-[22px] [&_h2]:text-[clamp(27px,3vw,38px)] [&_h2]:leading-[1.13] [&_h2]:font-bold [&_h2]:tracking-[-1px] max-[640px]:[&_h2]:text-[26px] max-[390px]:[&_h2]:text-[23px] [&_.eyebrow]:text-[#dfff00] max-[640px]:[&_.eyebrow]:text-[9px] max-[640px]:[&_.button]:gap-[7px] max-[640px]:[&_.button]:px-3 max-[640px]:[&_.button]:text-xs',
    faqWrap:
        'mx-auto w-[min(970px,calc(100%-64px))] max-[900px]:w-[min(calc(100%-44px),720px)] max-[640px]:w-[calc(100%-38px)]',
    faqList: 'grid gap-[10px]',
    faqItem:
        'rounded border border-[#ecf0f3] bg-white shadow-[0_4px_15px_#182a3b0d] [&_h3]:m-0 [&_button]:flex [&_button]:min-h-[59px] [&_button]:w-full [&_button]:items-center [&_button]:justify-between [&_button]:gap-[18px] [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-5 [&_button]:py-[13px] [&_button]:text-left [&_button]:text-[13px] [&_button]:font-bold [&_button]:text-[#28333d] [&_button]:cursor-pointer [&_button]:focus-visible:outline-3 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-[#d50057] [&_button_span]:grid [&_button_span]:size-[29px] [&_button_span]:shrink-0 [&_button_span]:place-items-center [&_button_span]:rounded-full [&_button_span]:bg-[#eaf6ff] [&_button_span]:text-[#d50057] max-[640px]:[&_button]:min-h-[58px] max-[640px]:[&_button]:px-3 max-[640px]:[&_button]:text-xs',
    faqAnswer:
        'px-5 pr-[58px] pb-[17px] text-xs leading-[1.7] text-[#66717d] [&_p]:m-0 max-[640px]:pr-[45px] max-[640px]:pl-3 max-[640px]:pb-4',
    footer: 'bg-[#202124] py-[61px] pb-5 text-white max-[640px]:pt-[49px]',
    footerGrid:
        'grid grid-cols-[1.6fr_.72fr_.8fr_1fr] gap-[45px] pb-[42px] max-[640px]:grid-cols-2 max-[640px]:gap-x-5 max-[640px]:gap-y-8 max-[640px]:pb-[30px] [&_h3]:m-0 [&_h3]:mb-4 [&_h3]:text-xs [&_p]:m-0 [&_p]:text-[11px] [&_p]:leading-[1.7] [&_p]:text-[#c1c5c9] [&_a:not(.brand)]:text-[11px] [&_a:not(.brand)]:leading-[1.7] [&_a:not(.brand)]:text-[#c1c5c9] [&>div:not(.footer-brand-col)]:flex [&>div:not(.footer-brand-col)]:flex-col [&>div:not(.footer-brand-col)]:items-start [&>div:not(.footer-brand-col)]:gap-[7px] [&>div:not(.footer-brand-col)_h3]:mb-[7px] max-[640px]:[&_h3]:text-xs max-[640px]:[&_p]:text-[10px] max-[640px]:[&_a:not(.brand)]:text-[10px]',
    footerBrand:
        'col-span-full flex flex-col items-start gap-[17px] [&_.brand]:mb-2 [&_.brand]:text-[31px] [&_strong]:text-xs max-[640px]:[&_p]:text-[11px]',
    footerPhone: 'flex items-center gap-[7px]',
    footerBottom:
        'flex min-h-[54px] items-end justify-between gap-5 border-t border-white/25 pt-[17px] max-[640px]:flex-col max-[640px]:items-start max-[640px]:pt-[18px] [&_p]:m-0 [&_p]:text-[10px] [&_p]:text-[#a9adb2]',
    socials:
        'flex gap-[10px] max-[640px]:self-end [&_a]:grid [&_a]:size-[26px] [&_a]:place-items-center [&_a]:rounded-full [&_a]:border [&_a]:border-white/35 [&_a]:text-[9px] [&_a]:font-bold [&_a]:text-white',
};

function Brand({ inverse = false }: { inverse?: boolean }) {
    return (
        <a
            href="#beranda"
            aria-label="Padhang beranda"
            className={`${tw.brand} ${inverse ? tw.brandInverse : ''}`}
        >
            <img src="/images/logo padhang.png" alt="Padhang" height="20" width="80" className="object-contain m-0 pl-1  " />
            <span>
                Padhang
            </span>
        </a>
    );
}

function SectionHeading({
    eyebrow,
    title,
    light = false,
}: {
    eyebrow: string;
    title: string;
    light?: boolean;
}) {
    return (
        <div
            className={`${tw.sectionHeading} ${light ? tw.sectionHeadingLight : ''}`}
        >
            <p className={tw.eyebrow}>{eyebrow}</p>
            <h2>{title}</h2>
        </div>
    );
}

export default function Welcome() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [testimonialPage, setTestimonialPage] = useState(0);

    return (
        <>
            <Head title="Padhang — Semua Bisa Akses" />
            <div className={tw.root} id="beranda">
                <header className={tw.nav}>
                    <div className={`${tw.wrap} ${tw.navInner}`}>
                        <Brand />
                        <button
                            className={tw.menuButton}
                            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X /> : <Menu />}
                        </button>
                        <nav
                            className={`${tw.navLinks} ${menuOpen ? tw.navOpen : tw.navClosed}`}
                            aria-label="Navigasi utama"
                        >
                            {navItems.map(([label, href]) => (
                                <a
                                    key={label}
                                    href={href}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </header>

                <main>
                    <section className={`${tw.blue} ${tw.hero} h-screen`}>
                        <div className={`${tw.wrap} ${tw.heroGrid}`}>
                            <div className={tw.heroCopy}>
                                <h1 className={tw.heroTitle}>
                                    Lebih paham sekitar, <span>lebih</span>{' '}
                                    percaya diri melangkah
                                </h1>
                                <p className={tw.heroText}>
                                    Padhang memadukan deskripsi AI, deteksi objek otomatis, navigasi GPS, dan bantuan relawan dalam satu platform.
                                </p>
                                <a
                                    className={`${tw.button} ${tw.yellowButton}`}
                                    href="#fitur"
                                >
                                    Mulai jelajahi <ArrowRight size={18} />
                                </a>
                            </div>
                            <div className={tw.heroVisual}>
                                <div className={tw.heroImage}>
                                    <img
                                        src="/images/phone.webp"
                                        alt="Ilustrasi teknologi asistif Padhang"
                                    />
                                </div>
                            </div>
                        </div>
                        <a
                            href="#tentang"
                            className={tw.scroll}
                            aria-label="Gulir ke tentang Padhang"
                        >
                            <ArrowDown size={17} />
                        </a>
                    </section>

                    <section
                        className={tw.statsWrap}
                        aria-label="Pencapaian Padhang"
                    >
                        <div className={`${tw.stats} p-10`} >
                            {[
                                ['5', 'Fitur utama'],
                                ['2', 'Jenis dukungan'],
                                ['1', 'Platform terpadu'],
                            ].map(([number, label], i) => (
                                <div className={`${tw.stat} text-2xl font-bold`} key={label}>
                                    <strong className={tw.statNumber}>
                                        {number}
                                    </strong>
                                    <span className={tw.statLabel}>
                                        {label}
                                    </span>
                                    {i < 2 && <i className={tw.statDivider} />}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={tw.section} id="tentang">
                        <div className={`${tw.wrap} ${tw.aboutGrid}`}>
                            <div className={tw.aboutVisual}>
                                <div className={tw.aboutShape} />
                                <img
                                    className={tw.aboutPhoto}
                                    src="/images/community.webp"
                                    alt="Ilustrasi komunitas dan aksesibilitas yang didukung Padhang"
                                />
                                <span className={tw.badge}>
                                    {/* <span>✳</span> Semua Bisa Akses */}
                                </span>
                            </div>
                            <div>
                                <p className={tw.eyebrow}>TENTANG PADHANG</p>
                                <h2 className={tw.aboutTitle}>
                                    Teknologi asistif untuk
                                    <br className="max-[640px]:hidden" /> memahami
                                    lingkungan
                                </h2>
                                <p className={tw.body}>
                                    Padhang adalah konsep platform berbasis web untuk membantu pengguna tunanetra memahami lingkungan dan bernavigasi. AI Vision, GPS, interaksi suara, serta panggilan relawan dirancang hadir dalam satu pengalaman.
                                </p>
                                <div className={tw.impact}>
                                    <div className={tw.sdgTitle}>
                                        <span className={tw.sdgWheel}>◎</span>
                                        <span>
                                            <b className="block text-base tracking-[-.5px]">
                                                SDG
                                            </b>
                                            <small className="block text-[7px] tracking-[.06em]">
                                                SUSTAINABLE DEVELOPMENT GOALS
                                            </small>
                                        </span>
                                    </div>
                                    <strong className="text-xs">
                                        Teknologi untuk akses yang lebih inklusif
                                    </strong>
                                    <div className={tw.sdgTags}>
                                        <span>
                                            03{' '}
                                            <small>
                                                Kesehatan dan kesejahteraan
                                            </small>
                                        </span>
                                        <span>
                                            04 <small>Pendidikan berkualitas</small>
                                        </span>
                                        <span>
                                            10{' '}
                                            <small>
                                                Berkurangnya Kesenjangan
                                            </small>
                                        </span>
                                    </div>
                                </div>
                                <a className={tw.textLink} href="#fitur">
                                    Selengkapnya <ArrowUpRight size={17} />
                                </a>
                            </div>
                        </div>
                    </section>

                    <section className={tw.servicesSection} id="fitur">
                        <div className={tw.wrap}>
                            <SectionHeading
                                eyebrow="FITUR PADHANG"
                                title="Bantuan yang saling melengkapi"
                            />
                            <div className={tw.serviceIntro}>
                                <p>
                                    Padhang menggabungkan bantuan AI untuk kebutuhan rutin dengan dukungan relawan ketika situasi membutuhkan perhatian manusia.
                                </p>
                                <a href="#kontak">
                                    Lihat cara kerja <ArrowRight size={16} />
                                </a>
                            </div>
                            <div className={tw.serviceCards}>
                                <article
                                    className={`${tw.serviceCard} ${tw.serviceBlue}`}
                                >
                                    <div className={tw.serviceNumber}>
                                        01 / PAHAMI
                                    </div>
                                    <div className={tw.serviceIcon}>◉</div>
                                    <h3 className={tw.serviceTitle}>
                                        Deskripsi lingkungan
                                    </h3>
                                    <p className={tw.serviceDescription}>
                                        AI Vision merangkum konteks sekitar menjadi informasi yang dapat didengarkan melalui text-to-speech.
                                    </p>
                                    <a
                                        className={tw.serviceArrow}
                                        href="#kontak"
                                        aria-label="Tanya tentang Deskripsi lingkungan"
                                    >
                                        <ArrowUpRight />
                                    </a>
                                </article>
                                <article
                                    className={`${tw.serviceCard} ${tw.serviceCyan}`}
                                >
                                    <div className={tw.serviceNumber}>
                                        02 / JELAJAHI
                                    </div>
                                    <div
                                        className={`${tw.serviceIcon} ${tw.serviceIconCyan}`}
                                    >
                                        <MessageCircle />
                                    </div>
                                    <h3 className={tw.serviceTitle}>
                                        Deteksi dan navigasi
                                    </h3>
                                    <p className={tw.serviceDescription}>
                                        Deteksi objek otomatis dan GPS mendukung orientasi serta mobilitas pengguna.
                                    </p>
                                    <a
                                        className={tw.serviceArrow}
                                        href="#kontak"
                                        aria-label="Pelajari deteksi dan navigasi"
                                    >
                                        <ArrowUpRight />
                                    </a>
                                </article>
                                <article
                                    className={`${tw.serviceCard} ${tw.serviceLime}`}
                                >
                                    <div className={tw.serviceNumber}>
                                        03 / TERHUBUNG
                                    </div>
                                    <div
                                        className={`${tw.serviceIcon} ${tw.serviceIconLime}`}
                                    >
                                        <Check />
                                    </div>
                                    <h3 className={tw.serviceTitle}>
                                        Panggilan relawan
                                    </h3>
                                    <p className={tw.serviceDescription}>
                                        Hubungi relawan melalui audio atau video tanpa berpindah dari platform.
                                    </p>
                                    <a
                                        className={tw.serviceArrow}
                                        href="#kontak"
                                        aria-label="Pelajari panggilan relawan"
                                    >
                                        <ArrowUpRight />
                                    </a>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section className={`${tw.blue} ${tw.testimonialsSection}`}>
                        <div className={tw.wrap}>
                            <SectionHeading
                                eyebrow="PRINSIP DESAIN"
                                title="Dibangun dari kebutuhan pengguna"
                                light
                            />
                            <div className={tw.testimonialWindow}>
                                <div
                                    className={tw.testimonialGrid}
                                    style={
                                        {
                                            '--testimonial-offset': `-${testimonialPage * 100}%`,
                                        } as React.CSSProperties
                                    }
                                >
                                    {testimonials.map((item) => (
                                        <article
                                            className={tw.testimonialCard}
                                            key={item.name}
                                        >
                                            <div className={tw.testimonialTop}>
                                                <span className={tw.pill}>
                                                    INSIGHT PADHANG
                                                </span>
                                                <MessageCircle size={23} />
                                            </div>
                                            <p className={tw.quote}>
                                                {item.quote}
                                            </p>
                                            <div
                                                className={tw.testimonialBottom}
                                            >
                                                <div>
                                                    <strong>{item.name}</strong>
                                                    <span>{item.org}</span>
                                                </div>
                                                <b
                                                    style={{
                                                        color: item.color,
                                                    }}
                                                >
                                                    {item.mark}
                                                </b>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                            <div
                                className={tw.dots}
                                aria-label="Paginasi insight"
                            >
                                {testimonials.map((item, index) => (
                                    <button
                                        key={item.name}
                                        onClick={() =>
                                            setTestimonialPage(index)
                                        }
                                        aria-label={`Tampilkan insight ${index + 1}`}
                                        aria-current={
                                            testimonialPage === index
                                                ? 'true'
                                                : undefined
                                        }
                                    >
                                        <span
                                            className={
                                                testimonialPage === index
                                                    ? 'active-dot'
                                                    : ''
                                            }
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className={tw.partnersSection}>
                        <div className={tw.wrap}>
                            <SectionHeading
                                eyebrow="AKTIVITAS YANG DIDUKUNG"
                                title="Akses dalam keseharian"
                            />
                            <div className={tw.partnersGrid}>
                                {partners.map((name, i) => (
                                    <div
                                        className={`${tw.partner} ${i % 6 === 3 ? tw.partnerFeatured : ''}`}
                                        key={name}
                                    >
                                        <span
                                            className={`${tw.partnerSymbol} ${partnerMarkColors[i % 6]} ${i % 6 === 3 ? '!text-[#ffe81c]' : ''}`}
                                        >
                                            {partnerMarks[i % 6]}
                                        </span>
                                        <span>{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className={`${tw.blue} ${tw.appSection}`} id="cara-kerja">
                        <div className={`${tw.wrap} ${tw.appGrid}`}>
                            <div className={tw.appCopy}>
                                <p className={tw.appHash}>#AksesLebihMudah</p>
                                <h2 className={tw.appTitle}>
                                    Satu platform untuk
                                    <br />
                                    memahami sekitar
                                </h2>
                                <p className={tw.appDescription}>
                                    Konsep Padhang menyatukan deskripsi lingkungan, deteksi objek, navigasi GPS, dan panggilan relawan dalam platform web.
                                </p>
                                <a href="#fitur" className={`${tw.playButton} w-fit`}>
                                    <span className={tw.playTriangle}>▶</span>
                                    <span className="flex flex-1 flex-col">
                                        <small className="text-[8px]">
                                            PLATFORM BERBASIS WEB
                                        </small>
                                        <b className="text-sm">Jelajahi fitur</b>
                                    </span>
                                    <ArrowUpRight size={16} />
                                </a>
                                <div className={tw.appCaption}>
                                    <Smartphone size={17} /> Bantuan yang terhubung dalam satu tempat.
                                </div>
                            </div>
                            <div className={tw.phoneStage}>
                                <div className="absolute right-0 bottom-[-100px] size-[350px] rounded-full bg-white/10" />
                                <div className={tw.phone}>
                                    <div className={tw.phoneNotch} />
                                    <div className={tw.phoneStatus}>
                                        <span>9:41</span>
                                        <span>● ● ▰</span>
                                    </div>
                                    <div className={tw.phoneHeader}>
                                        <Brand inverse />
                                        <span className={tw.phoneAvatar}>
                                            S
                                        </span>
                                    </div>
                                    <div className={tw.phoneBanner}>
                                        <small>
                                            Padhang • akses untuk semua
                                        </small>
                                        <b>
                                            Pahami lingkungan dengan lebih banyak konteks
                                        </b>
                                        <span>
                                            Deskripsi AI, GPS, dan relawan dalam satu platform
                                        </span>
                                        <i>Kenali fitur ↗</i>
                                    </div>
                                    <p className={tw.phoneLabel}>
                                        Fitur Padhang
                                    </p>
                                    <div className={tw.phoneTiles}>
                                        <span>
                                            ◉<small>Deteksi</small>
                                        </span>
                                        <span>
                                            🎙️<small>Suara</small>
                                        </span>
                                        <span>
                                            🧭<small>Navigasi</small>
                                        </span>
                                        <span>
                                            ☎<small>Relawan</small>
                                        </span>
                                    </div>
                                    <div className={tw.phoneNav}>
                                        <span>
                                            ⌂<small>Beranda</small>
                                        </span>
                                        <span>
                                            ◉<small>Jelajah</small>
                                        </span>
                                        <span>
                                            ♡<small>Favorit</small>
                                        </span>
                                        <span>
                                            ☻<small>Profil</small>
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute bottom-[-330px] h-[470px] w-[470px] rounded-full border border-white/20" />
                                <div className="absolute bottom-[-284px] h-[390px] w-[390px] rounded-full border border-white/20" />
                            </div>
                        </div>
                    </section>

                    <section className={tw.mediaSection} id="media">
                        <div className={tw.wrap}>
                            <SectionHeading
                                eyebrow="TEKNOLOGI TERPADU"
                                title="Satu pengalaman, beragam dukungan"
                            />
                            <div className={tw.mediaLogos}>
                                {media.map((name, i) => (
                                    <span
                                        className={`${tw.mediaLogo} ${['font-semibold tracking-[-1.4px]', '', 'text-[15px]', 'font-serif font-medium italic', 'text-[23px] text-[#13191e]', 'text-[#60666b]', 'text-[15px]'][i]}`}
                                        key={name}
                                    >
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className={tw.contactBanner} id="kontak">
                        <div
                            className="absolute inset-0 bg-cover bg-[center_48%] opacity-[.22] grayscale"
                            style={{ backgroundImage: 'url(/images/handshake.webp)' }}
                        />
                        <div className={tw.contactOverlay} />
                        <div className={`${tw.wrap} ${tw.contactInner}`}>
                            <div className={tw.contactPerson}>
                                <img
                                    src="/images/phone.webp"
                                    alt="Ilustrasi dukungan teknologi dan relawan Padhang"
                                />
                                <span>☎</span>
                            </div>
                            <div className={tw.contactCopy}>
                                <p className={tw.eyebrow}>DUKUNGAN YANG TERHUBUNG</p>
                                <h2>
                                    AI membantu memahami sekitar. Relawan melengkapi dukungan saat dibutuhkan.
                                </h2>
                                <a
                                    href={register({ query: { role: 'volunteer' } }).url}
                                    className={`${tw.button} ${tw.yellowButton}`}
                                >
                                    <MessageCircle size={17} /> Bergabung sebagai relawan{' '}
                                    <ArrowRight size={17} />
                                </a>
                            </div>

                        </div>
                    </section>

                    <section className={tw.faqSection} id="faq">
                        <div className={tw.faqWrap}>
                            <div className={tw.faqHeading}>
                                <SectionHeading
                                    eyebrow="PERTANYAAN UMUM"
                                    title="Pertanyaan seputar Padhang"
                                />
                            </div>
                            <div className={tw.faqList}>
                                {faqs.map(([question, answer], index) => (
                                    <article
                                        className={`${tw.faqItem} ${openFaq === index ? 'border-[#b7ddfb]' : ''}`}
                                        key={question}
                                    >
                                        <h3>
                                            <button
                                                aria-expanded={
                                                    openFaq === index
                                                }
                                                aria-controls={`faq-answer-${index}`}
                                                onClick={() =>
                                                    setOpenFaq(
                                                        openFaq === index
                                                            ? null
                                                            : index,
                                                    )
                                                }
                                            >
                                                {question}
                                                <span>
                                                    {openFaq === index ? (
                                                        <Minus size={19} />
                                                    ) : (
                                                        <Plus size={19} />
                                                    )}
                                                </span>
                                            </button>
                                        </h3>
                                        <div
                                            className={tw.faqAnswer}
                                            id={`faq-answer-${index}`}
                                            hidden={openFaq !== index}
                                        >
                                            <p>{answer}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className={tw.footer}>
                    <div className={tw.wrap}>
                        <div className={tw.footerGrid}>
                            <div className={tw.footerBrand}>
                                <Brand inverse />
                                <strong>Teknologi asistif berbasis web</strong>
                                <p>
                                    Membantu pengguna tunanetra memahami lingkungan, bernavigasi, dan terhubung dengan relawan.
                                </p>
                            </div>
                            <div>
                                <h3>Padhang</h3>
                                <a href="#beranda">Beranda</a>
                                <a href="#tentang">Tentang</a>
                                <a href="#kontak">Kontak</a>
                                <a href="#faq">Pertanyaan Umum</a>
                            </div>
                            <div>
                                <h3>Fitur</h3>
                                <a href="#fitur">AI Vision</a>
                                <a href="#fitur">Navigasi GPS</a>
                                <a href="#fitur">Panggilan relawan</a>
                            </div>
                            <div>
                                <h3>Hubungi Kami</h3>
                                <p>
                                    Jelajahi konsep Padhang
                                    <br />
                                    atau bergabung sebagai relawan
                                </p>
                                <a
                                    className={tw.footerPhone}
                                    href={register({ query: { role: 'volunteer' } }).url}
                                >
                                    <MessageCircle size={17} /> Daftar relawan
                                </a>
                            </div>
                        </div>
                        <div className={tw.footerBottom} id="footer">
                            <p>
                                © 2026 Padhang. Konsep teknologi asistif untuk akses yang lebih inklusif.
                            </p>
                            <div className={tw.socials}>
                                <a href="#footer" aria-label="Instagram">
                                    ig
                                </a>
                                <a href="#footer" aria-label="LinkedIn">
                                    in
                                </a>
                                <a href="#footer" aria-label="YouTube">
                                    ▶
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
