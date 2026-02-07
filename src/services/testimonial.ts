"use server";

import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";

export async function getAllTestimonials() {
  await dbConnect();
  try {
    const testimonials = await Testimonial.find({})
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(testimonials));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function getPendingTestimonialsCount() {
  await dbConnect();
  try {
    const pendingCount = await Testimonial.countDocuments({
      isApproved: false,
    });
    return pendingCount;
  } catch (error) {
    return 0;
  }
}
