import Hero from "@/components/home/hero";
import Transformation from "@/components/home/transformation";
import Audience from "@/components/home/audience";
import Journey from "@/components/home/journey";
import Approach from "@/components/home/approach";
import Blog from "@/components/home/blog";
import Events from "@/components/home/events";
import Footer from "@/components/home/footer";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="relative bg-black text-white">
      <Navbar />

      <div className="relative z-10">
        <Hero />
      </div>

      <div className="md:sticky top-0 z-20 md:h-screen overflow-hidden">
        <Transformation />
      </div>
      <div className="relative z-25">
        <Journey />
      </div>

      <div className="relative z-30">
        <Approach />
      </div>
      <div className="relative z-35 bg-black">
        <Audience />
      </div>

      <div className="relative z-40 bg-white">
        <Blog />
      </div>

      <div className="relative z-45 bg-white">
        <Events />
      </div>

      <div className="relative z-50">
        <Footer />
      </div>
    </main>
  );
}
