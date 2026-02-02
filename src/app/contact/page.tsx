import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import ContactHero from "@/components/contact/hero";
import ContactForm from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <main className="relative bg-black text-white">
      <Navbar />

      <div className="relative z-10">
        <ContactHero />
      </div>

      <ContactForm />

      <Footer />
    </main>
  );
}
