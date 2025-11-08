import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

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
