import { NextRequest, NextResponse } from "next/server";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, displayName, image } = body;

    if (!name || !displayName || !image) {
      return NextResponse.json(
        {
          error: "Missing required fields. Please provide: name, displayName, image",
        },
        { status: 400 }
      );
    }

    // Generate UUID for the document ID
    const categoryId = uuidv4();

    // Add document to Firestore with UUID as document ID
    await setDoc(doc(db, "categories", categoryId), {
      id: categoryId,
      name,
      displayName,
      image,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category added successfully",
        id: categoryId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      {
        error: "Failed to add category",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to test the API
export async function GET() {
  return NextResponse.json({
    message: "Category API is working",
    usage: {
      method: "POST",
      endpoint: "/api/categories/create",
      body: {
        name: "string (required)",
        displayName: "string (required)",
        image: "string (required - image URL)",
      },
      example: {
        name: "plywood",
        displayName: "Plywood",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop",
      },
    },
  });
}
