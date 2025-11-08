import { Document, Schema, model, models } from "mongoose";
import { createSlug } from "@/lib/utils";

// Define the interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      validate: {
        validator: (value: string) => !isNaN(Date.parse(value)),
        message: "Invalid date format",
      },
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      validate: {
        validator: (value: string) =>
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?\s*(?:AM|PM)?$/i.test(
            value
          ),
        message: "Invalid time format",
      },
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "{VALUE} is not supported",
      },
    },
    audience: {
      type: String,
      required: [true, "Target audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda items are required"],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0,
        message: "At least one agenda item is required",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0,
        message: "At least one tag is required",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Generate slug from title and normalize date/time before saving
eventSchema.pre("save", function (next) {
  // Only update slug if title is modified or document is new
  if (this.isModified("title")) {
    this.slug = createSlug(this.title);
  }

  // Normalize date to ISO format if modified
  if (this.isModified("date")) {
    const normalized = new Date(this.date).toISOString().split("T")[0];
    this.date = normalized;
  }

  // Normalize time format if modified
  if (this.isModified("time")) {
    const timeMatch = this.time.match(
      /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i
    );
    if (timeMatch) {
      const [, hours, minutes, , period] = timeMatch;
      let hour = parseInt(hours, 10);

      // Convert to 24-hour format if period is provided
      if (period) {
        const periodUpper = period.toUpperCase();
        if (periodUpper === "PM" && hour < 12) hour += 12;
        if (periodUpper === "AM" && hour === 12) hour = 0;
      }

      this.time = `${hour.toString().padStart(2, "0")}:${minutes}`;
    }
  }

  next();
});

// Create indexes
eventSchema.index({ slug: 1 });
eventSchema.index({ createdAt: -1 });

// Export the Event model
export const Event = models.Event || model<IEvent>("Event", eventSchema);
