import mongoose, { Schema, Document } from "mongoose";

export interface IBankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  image?: string;
  status: "upcoming" | "past" | "cancelled";
  isPaid: boolean;
  price?: number;
  paymentMethod: "gateway" | "manual";
  bankDetails?: IBankDetails;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String },
    isPaid: { type: Boolean, default: false },
    price: { type: Number },
    paymentMethod: {
      type: String,
      enum: ["gateway", "manual"],
      default: "gateway",
    },
    bankDetails: {
      bankName: { type: String },
      accountName: { type: String },
      accountNumber: { type: String },
    },
    status: {
      type: String,
      enum: ["upcoming", "past", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
