import Hero from "@/components/home/hero";
import Transformation from "@/components/home/transformation";
import Audience from "@/components/home/audience";
import Journey from "@/components/home/journey";
import Approach from "@/components/home/approach";
import Blog from "@/components/home/blog";
import { getAllBlogs } from "@/services/blog";
import Events from "@/components/home/events";
import Footer from "@/components/home/footer";
import Navbar from "@/components/navbar";
import { getUpcomingEvents } from "@/services/event";

export default async function Home() {
  const blogs = await getAllBlogs();
  const upcomingEvents = await getUpcomingEvents();

  return (
    <main className="relative bg-white font-outfit">
      <Navbar />

      <div className="relative z-10">
        <Hero />
      </div>

      <div className="md:sticky top-0 z-20 md:h-152 overflow-hidden">
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
        <Blog blogs={blogs} />
      </div>

      <div className="relative z-45 bg-white">
        <Events events={upcomingEvents} />
      </div>

      <div className="relative z-50">
        <Footer />
      </div>
    </main>
  );
}
