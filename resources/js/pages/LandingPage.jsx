// resources/js/Pages/LandingPage.jsx
import App from '@/Layouts/App';
import Hero from '@/Components/Landing/Hero';
import Features from '@/Components/Landing/Features';
import BlogPreview from '@/Components/Landing/BlogPreview';
import About from '@/Components/Landing/About';
import Contact from '@/Components/Landing/Contact';
import FAQ from '@/Components/Landing/FAQ';

export default function LandingPage() {
  return (
    <App title="Beranda – Padhang">
      <Hero />
      <Features />
      <BlogPreview />
      <About />
      <Contact />
      <FAQ />
    </App>
  );
}

