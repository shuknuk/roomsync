import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { MorphingHero } from './components/MorphingHero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { FinalCTA } from './components/FinalCTA';
import { HowItWorksPage } from './components/HowItWorksPage';
import { AboutPage } from './components/AboutPage';
import { FAQsPage } from './components/FAQsPage';
import { PageTransition } from './components/PageTransition';

function HomePage() {
  return (
    <PageTransition transitionKey="home">
      <MorphingHero />
      <Features />
      <HowItWorks />
      <FinalCTA />
    </PageTransition>
  );
}

function HowItWorksPageWrapper() {
  return (
    <PageTransition transitionKey="how-it-works">
      <HowItWorksPage />
    </PageTransition>
  );
}

function AboutPageWrapper() {
  return (
    <PageTransition transitionKey="about">
      <AboutPage />
    </PageTransition>
  );
}

function FAQsPageWrapper() {
  return (
    <PageTransition transitionKey="faqs">
      <FAQsPage />
    </PageTransition>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPageWrapper />} />
        <Route path="/about" element={<AboutPageWrapper />} />
        <Route path="/faqs" element={<FAQsPageWrapper />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen transition-colors duration-300">
        <Header />
        <main>
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}