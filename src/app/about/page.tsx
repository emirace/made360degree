import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import AboutHero from "@/components/about/hero";
import OurStory from "@/components/about/ourStory";
import Philosophy from "@/components/about/philosophy";
import Founder from "@/components/about/founder";

export default function About() {
  return (
    <main className="relative bg-black text-white">
      <Navbar />

      <div className="relative z-10">
        <AboutHero />
      </div>

      <OurStory />

      <Philosophy />

      <Founder />

      <Footer />
    </main>
  );
}
