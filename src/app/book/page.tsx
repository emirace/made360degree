import BookingForm from "@/components/booking/booking-form";
import { Sparkles } from "lucide-react";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">
              Book a Consultation
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-outfit">
            Let's Transform Your{" "}
            <span className="text-primary">Leadership Journey</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Schedule a consultation with our experts to discuss how we can help
            you achieve your goals.
          </p>
        </div>

        <BookingForm />
      </div>
    </div>
  );
}
