import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CompaniesSection from '@/components/CompaniesSection';
import OpportunitiesSection from '@/components/OpportunitiesSection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

export default function Home() {
  return (
    <>
      <SEOHead />
      <main className="min-h-screen">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <CompaniesSection />
        <OpportunitiesSection />
        <Footer />
      </main>
    </>
  );
}
