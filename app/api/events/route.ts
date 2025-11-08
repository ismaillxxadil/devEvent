import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
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

    const maxImageSizeMb =
      Number(process.env.NEXT_PUBLIC_EVENT_IMAGE_MAX_MB ?? "5") || 5;
    const maxImageSizeBytes = maxImageSizeMb * 1024 * 1024;

    const imageEntry = formData.get("image");
    if (!(imageEntry instanceof File)) {
      return new NextResponse("A valid image file is required.", {
        status: 400,
      });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(imageEntry.type)) {
      return new NextResponse(
        `Unsupported image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(
          ", "
        )}`,
        { status: 400 }
      );
    }

    if (imageEntry.size > maxImageSizeBytes) {
      return new NextResponse(
        `Image exceeds the ${maxImageSizeMb}MB size limit.`,
        { status: 400 }
      );
    }

    let tags: string[];
    try {
      const parsedTags = JSON.parse(event.tags as string);
      if (!Array.isArray(parsedTags)) {
        throw new Error("Tags must be a JSON array.");
      }
      tags = parsedTags;
    } catch (parseError) {
      return new NextResponse(
        `Invalid tags payload: ${
          parseError instanceof Error ? parseError.message : "Malformed JSON"
        }`,
        { status: 400 }
      );
    }

    let agenda: string[];
    try {
      const parsedAgenda = JSON.parse(event.agenda as string);
      if (!Array.isArray(parsedAgenda)) {
        throw new Error("Agenda must be a JSON array.");
      }
      agenda = parsedAgenda;
    } catch (parseError) {
      return new NextResponse(
        `Invalid agenda payload: ${
          parseError instanceof Error ? parseError.message : "Malformed JSON"
        }`,
        { status: 400 }
      );
    }

    const file = imageEntry;

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
