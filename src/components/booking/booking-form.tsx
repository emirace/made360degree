"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Briefcase,
  Users,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const services = [
  {
    id: "leadership-training",
    name: "Leadership Training",
    icon: Users,
    description: "Develop effective leadership skills",
  },
  {
    id: "strategic-planning",
    name: "Strategic Planning",
    icon: Target,
    description: "Create actionable business strategies",
  },
  {
    id: "executive-coaching",
    name: "Executive Coaching",
    icon: Briefcase,
    description: "One-on-one executive development",
  },
  {
    id: "organizational-development",
    name: "Organizational Development",
    icon: TrendingUp,
    description: "Transform your organization",
  },
];

interface BookingFormData {
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  preferredDate: string;
  sessionType: "virtual" | "in-person" | "";
  notes: string;
}

export default function BookingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    preferredDate: "",
    sessionType: "",
    notes: "",
  });

  const totalSteps = 4;

  const updateFormData = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.serviceType) {
          toast.error("Please select a service");
          return false;
        }
        return true;
      case 2:
        if (!formData.name || !formData.email || !formData.phone) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        return true;
      case 3:
        if (!formData.preferredDate || !formData.sessionType) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Booking request submitted successfully!");
        router.push("/");
      } else {
        toast.error("Failed to submit booking. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  step < currentStep
                    ? "bg-primary border-primary text-white"
                    : step === currentStep
                      ? "border-primary text-primary"
                      : "border-zinc-700 text-zinc-500"
                }`}
              >
                {step < currentStep ? <Check size={20} /> : <span>{step}</span>}
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    step < currentStep ? "bg-primary" : "bg-zinc-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-zinc-500">Service</span>
          <span className="text-xs text-zinc-500">Contact</span>
          <span className="text-xs text-zinc-500">Schedule</span>
          <span className="text-xs text-zinc-500">Review</span>
        </div>
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-8"
        >
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Select a Service
                </h2>
                <p className="text-zinc-400">
                  Choose the service that best fits your needs
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => updateFormData("serviceType", service.id)}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      formData.serviceType === service.id
                        ? "border-primary bg-primary/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <service.icon
                      className={`mb-3 ${
                        formData.serviceType === service.id
                          ? "text-primary"
                          : "text-zinc-400"
                      }`}
                      size={32}
                    />
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {service.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Contact Information
                </h2>
                <p className="text-zinc-400">Tell us a bit about yourself</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-zinc-300">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-zinc-300">
                    Company (Optional)
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => updateFormData("company", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Your Company"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Schedule & Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Schedule & Preferences
                </h2>
                <p className="text-zinc-400">When would you like to meet?</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate" className="text-zinc-300">
                    Preferred Date *
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      updateFormData("preferredDate", e.target.value)
                    }
                    className="bg-zinc-800 border-zinc-700 text-white"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Session Type *</Label>
                  <RadioGroup
                    value={formData.sessionType}
                    onValueChange={(value) =>
                      updateFormData("sessionType", value)
                    }
                  >
                    <div className="flex items-center space-x-2 p-4 rounded-lg border border-zinc-700 hover:border-zinc-600">
                      <RadioGroupItem value="virtual" id="virtual" />
                      <Label
                        htmlFor="virtual"
                        className="flex-1 cursor-pointer text-zinc-300"
                      >
                        Virtual (Online)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-lg border border-zinc-700 hover:border-zinc-600">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label
                        htmlFor="in-person"
                        className="flex-1 cursor-pointer text-zinc-300"
                      >
                        In-Person
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-zinc-300">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                    placeholder="Any specific topics or questions you'd like to discuss..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Review Your Booking
                </h2>
                <p className="text-zinc-400">
                  Please review your information before submitting
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-800 rounded-lg">
                  <p className="text-sm text-zinc-400 mb-1">Service</p>
                  <p className="text-white font-medium">
                    {services.find((s) => s.id === formData.serviceType)?.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Name</p>
                    <p className="text-white">{formData.name}</p>
                  </div>
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Email</p>
                    <p className="text-white">{formData.email}</p>
                  </div>
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Phone</p>
                    <p className="text-white">{formData.phone}</p>
                  </div>
                  {formData.company && (
                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <p className="text-sm text-zinc-400 mb-1">Company</p>
                      <p className="text-white">{formData.company}</p>
                    </div>
                  )}
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Preferred Date</p>
                    <p className="text-white">
                      {new Date(formData.preferredDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Session Type</p>
                    <p className="text-white capitalize">
                      {formData.sessionType}
                    </p>
                  </div>
                </div>
                {formData.notes && (
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Notes</p>
                    <p className="text-white">{formData.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={prevStep}
          disabled={currentStep === 1}
          variant="outline"
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep < totalSteps ? (
          <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Booking"}
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
