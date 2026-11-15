// resources/js/Pages/LandingPage.jsx
import App from '@/layouts/App';
import Hero from '@/components/Landing/Hero';
import Features from '@/components/Landing/Features';
import BlogPreview from '@/components/Landing/BlogPreview';
import About from '@/components/Landing/About';
import Contact from '@/components/Landing/Contact';
import FAQ from '@/components/Landing/FAQ';

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

