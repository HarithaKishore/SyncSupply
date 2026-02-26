import { NextRequest, NextResponse } from "next/server";
import { collection, doc, setDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

// Helper function to convert category names to IDs
async function getCategoryIds(categoryNames: string[]): Promise<string[]> {
  const categoryIds: string[] = [];

  for (const categoryName of categoryNames) {
    try {
      const q = query(
        collection(db, "categories"),
        where("name", "==", categoryName.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const categoryId = querySnapshot.docs[0].data().id;
        categoryIds.push(categoryId);
      } else {
        throw new Error(`Category not found: ${categoryName}`);
      }
    } catch (error) {
      throw new Error(`Failed to find category: ${categoryName}`);
    }
  }

  return categoryIds;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, image, price, postfix, categories } = body;

    if (!name || !image || price === undefined || !postfix || !categories || categories.length === 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["name", "image", "price", "postfix", "categories (array of category names)"],
        },
        { status: 400 }
      );
    }

    // Validate price is a number
    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        {
          error: "Price must be a positive number",
        },
        { status: 400 }
      );
    }

    // Validate categories is an array
    if (!Array.isArray(categories)) {
      return NextResponse.json(
        {
          error: "Categories must be an array of category names",
        },
        { status: 400 }
      );
    }

    // Convert category names to IDs
    let categoryIds: string[];
    try {
      categoryIds = await getCategoryIds(categories);
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Failed to process categories",
        },
        { status: 400 }
      );
    }

    // Generate UUID for the product ID
    const productId = uuidv4();

    // Add document to Firestore with UUID as document ID
    await setDoc(doc(db, "products", productId), {
      id: productId,
      name,
      image,
      price,
      postfix,
      categories: categoryIds, // Save category IDs, not names
      createdAt: Timestamp.now(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        id: productId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      {
        error: "Failed to add product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to test the API
export async function GET() {
  return NextResponse.json({
    message: "Product API is working",
    endpoints: {
      "POST /api/products/create": "Add single product",
      "POST /api/products/batch": "Add multiple products",
    },
    usage: {
      method: "POST",
      endpoint: "/api/products/create",
      body: {
        name: "string (required)",
        image: "string (required - image URL)",
        price: "number (required)",
        postfix: "string (required - e.g., 'per piece', 'bundle of 12')",
        categories: "array (required - array of CATEGORY NAMES from 'name' field)",
      },
      example: {
        name: "Plywood 4x8 feet",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop",
        price: 1200,
        postfix: "per sheet",
        categories: ["plywood", "wood"],
      },
    },
  });
}
