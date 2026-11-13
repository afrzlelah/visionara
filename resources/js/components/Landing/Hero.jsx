// resources/js/Components/Landing/Hero.jsx
export default function Hero() {
  return (
    <section className="bg-[#F5F7FA] py-24 relative overflow-hidden">
      {/* Decorative abstract circle */}
      <svg
        className="absolute left-0 top-0 -z-10"
        width="500"
        height="500"
        viewBox="0 0 500 500"
        fill="none"
      >
        <circle cx="250" cy="250" r="250" fill="#00B8E5" fillOpacity="0.15" />
      </svg>

      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center px-4">
        {/* Text block */}
        <div className="md:w-1/2">
          <h1 className="text-5xl font-extrabold text-[#0788F9] mb-6">
            Solusi Komunikasi yang Terang dan Cepat
          </h1>
          <p className="text-lg text-[#202124] mb-8">
            Padhang memudahkan tim Anda berkolaborasi lewat panggilan video yang stabil dan terintegrasi dengan sistem Anda.
          </p>
          <a
            href="/layanan"
            className="inline-block bg-[#00B8E5] text-white px-8 py-3 rounded-full hover:bg-[#0788F9] transition"
          >
            Jelajahi Layanan
          </a>
        </div>

        {/* Illustration – replace with your own visual */}
        <div className="md:w-1/2 flex justify-center mb-12 md:mb-0">
          <img
            src="/images/hero-illustration.png"
            alt="Orang berkomunikasi"
            className="max-w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

