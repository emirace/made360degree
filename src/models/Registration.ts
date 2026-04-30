import mongoose, { Schema, Document } from "mongoose";

export interface IRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  amount: number;
  paymentMethod: "card" | "manual_transfer";
  paymentStatus: "pending" | "completed" | "failed";
  transactionId?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema: Schema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["card", "manual_transfer"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: { type: String },
    receiptUrl: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);
