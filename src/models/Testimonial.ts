import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company?: string;
  content: string;
  image?: string;
  rating: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String },
    content: { type: String, required: true },
    image: { type: String },
    rating: { type: Number, default: 5 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
