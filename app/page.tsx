import LandingHero from '@/components/landing/hero';
import LandingFeatures from '@/components/landing/features';
import LandingRoles from '@/components/landing/roles';
import LandingFooter from '@/components/landing/footer';
import { LandingNavbar } from '@/components/landing/navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-grow">
        <LandingHero />
        <LandingFeatures />
        <LandingRoles />
      </main>
      <LandingFooter />
    </div>
  );
}