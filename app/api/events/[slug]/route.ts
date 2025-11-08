import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handle GET requests for /api/events/[slug] and return the matching event.
 *
 * @param context - An object containing `params` as a Promise that resolves to `{ slug: string }`, where `slug` is the route parameter used to find the event.
 * @returns A NextResponse:
 * - Status 200 with JSON `{ message: "the event return successfully", event }` when a matching event is found.
 * - Status 404 with plain text "Event not found" when no matching event exists.
 * - Status 500 with plain text `something went wrong: <message>` (or "Unknown error") when an unexpected error occurs.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await context.params;
    console.log("Slug received:", slug); // Debugging line
    const event = await Event.findOne({ slug }).lean();
    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }
    return NextResponse.json(
      { message: "the event return successfully", event },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      `something went wrong: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}