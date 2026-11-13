// resources/js/Components/Landing/About.jsx
export default function About() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <img
            src="/images/about-team.jpg"
            alt="Tim Padhang"
            className="rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2 md:pl-12">
          <h2 className="text-3xl font-bold text-[#0788F9] mb-4">Tentang Padhang</h2>
          <p className="text-[#202124] mb-4">
            Kami adalah tim engineer yang berfokus pada pengalaman kolaborasi real‑time. Dengan teknologi WebRTC modern, kami menyediakan solusi yang **terang**, **handal**, dan **mudah diintegrasikan**.
          </p>
          <p className="text-[#202124]">
            Misi kami: Membantu setiap tim berkomunikasi tanpa batas, di mana pun mereka berada.
          </p>
        </div>
      </div>
    </section>
  );
}

