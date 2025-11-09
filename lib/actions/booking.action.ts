"use server";

import { Booking } from "@/database";
import connectToDatabase from "../mongodb";

export const createBooking = async ({
  eventId,
  email,
  slug,
}: {
  eventId: string;
  email: string;
  slug: string;
}) => {
  try {
    console.log(eventId, email, slug);
    await connectToDatabase();
    await Booking.create({ eventId, email });
    return { success: "Booking created successfully" };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false };
  }
};
