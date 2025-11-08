import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
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
