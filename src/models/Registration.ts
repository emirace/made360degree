import mongoose, { Schema, Document } from "mongoose";

export interface IRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  amount: number;
  paymentMethod: "card" | "offline";
  paymentStatus: "pending" | "completed" | "failed";
  transactionId?: string;
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
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["card", "offline"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);
