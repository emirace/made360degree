import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  preferredDate: Date;
  sessionType: "virtual" | "in-person";
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    serviceType: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String },
    preferredDate: { type: Date, required: true },
    sessionType: {
      type: String,
      enum: ["virtual", "in-person"],
      required: true,
    },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
