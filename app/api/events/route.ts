import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
/**
 * Creates a new event from multipart form data, uploads the provided image to Cloudinary, and persists the event in the database.
 *
 * @param req - NextRequest containing multipart form-data. Expects an "image" File and string fields `tags` and `agenda` that are valid JSON.
 * @returns A NextResponse: on success returns status 201 with a message and the created event; returns status 400 for invalid form data; returns status 500 for other errors.
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await req.formData();
    let event;
    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return new NextResponse("Invalid form data" + error, { status: 400 });
    }
    const file = formData.get("image") as File;
    const tags = JSON.parse(event.tags as string);

    const agenda = JSON.parse(event.agenda as string);

    const arrBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrBuffer);
    const uploadedImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "devEvent" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });
    event.image = (uploadedImage as { secure_url: string }).secure_url;
    const createdEvent = await Event.create({ ...event, tags, agenda });
    return NextResponse.json(
      { message: "The event was created successfully", event: createdEvent },
      { status: 201 }
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
/**
 * Fetches all events sorted by creation time in descending order.
 *
 * Retrieves all Event documents from the database ordered newest-first and returns them as JSON.
 *
 * @returns A NextResponse containing a JSON array of events, or a 500 response with an error message if retrieval fails.
 */
export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error) {
    return new NextResponse(
      `something went wrong: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}