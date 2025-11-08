"use server";
import { Event } from "@/database";
import connectToDatabase from "../mongodb";

export const getSimilarEvents = async (slug: string) => {
  try {
    await connectToDatabase();
    const event = await Event.findOne({ slug });
    if (!event) {
      return [];
    }
    return await Event.find({
      tags: { $in: event.tags },
      slug: { $ne: slug },
    })
      .limit(3)
      .lean();
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
};
