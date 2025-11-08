import { Document, Schema, model, models, Types } from "mongoose";
import { Event } from "./event.model";

// Define the interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Verify event exists before saving booking
bookingSchema.pre("save", async function (next) {
  if (this.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error("Event does not exist");
    }
  }
  next();
});

// Create indexes for common queries
bookingSchema.index({ eventId: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ createdAt: -1 });

// Export the Booking model
export const Booking =
  models.Booking || model<IBooking>("Booking", bookingSchema);
