import Navigation from "@/components/Navigation";
import ScrollToTop from "@/components/ScrollToTop";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Achievements from "@/components/Achievements";
import Experience from "@/components/Experience";
import Consulting from "@/components/Consulting";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <ScrollToTop />
      <main className="min-h-screen">
        <Hero />
        <section id="about">
          <About />
        </section>
        <section id="achievements">
          <Achievements />
        </section>
        <section id="experience">
          <Experience />
        </section>
        <section id="consulting">
          <Consulting />
        </section>
        <section id="skills">
          <Skills />
        </section>
        <section id="contact">
          <Contact />
        </section>
        <Footer />
      </main>
    </>
  );
}
