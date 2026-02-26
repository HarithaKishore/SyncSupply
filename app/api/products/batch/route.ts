import { NextRequest, NextResponse } from "next/server";
import { collection, doc, setDoc, Timestamp, writeBatch, query, where, getDocs } from "firebase/firestore";
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

    // Validate that products is an array
    if (!Array.isArray(body.products)) {
      return NextResponse.json(
        {
          error: "Invalid format. Use: { products: [{ name, image, price, postfix, categories }, ...] }",
        },
        { status: 400 }
      );
    }

    const products = body.products;

    // Validate products array is not empty
    if (products.length === 0) {
      return NextResponse.json(
        {
          error: "Products array cannot be empty",
        },
        { status: 400 }
      );
    }

    // Validate each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.name || !product.image || product.price === undefined || !product.postfix || !product.categories) {
        return NextResponse.json(
          {
            error: `Product at index ${i} is missing required fields`,
            required: ["name", "image", "price", "postfix", "categories"],
            product: product,
          },
          { status: 400 }
        );
      }

      if (typeof product.price !== "number" || product.price < 0) {
        return NextResponse.json(
          {
            error: `Product at index ${i} has invalid price`,
          },
          { status: 400 }
        );
      }

      if (!Array.isArray(product.categories)) {
        return NextResponse.json(
          {
            error: `Product at index ${i} categories must be an array`,
          },
          { status: 400 }
        );
      }
    }

    // Convert category names to IDs for all products
    const productsWithIds = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      try {
        const categoryIds = await getCategoryIds(product.categories);
        productsWithIds.push({ ...product, categories: categoryIds });
      } catch (error) {
        return NextResponse.json(
          {
            error: `Failed to process categories for product at index ${i}`,
            details: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 400 }
        );
      }
    }

    // Batch insert all products
    const batch = writeBatch(db);
    const insertedIds: string[] = [];

    productsWithIds.forEach((product: any) => {
      const productId = uuidv4();
      const productRef = doc(db, "products", productId);

      batch.set(productRef, {
        id: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        postfix: product.postfix,
        categories: product.categories,
        createdAt: Timestamp.now(),
      });

      insertedIds.push(productId);
    });

    // Commit the batch
    await batch.commit();

    return NextResponse.json(
      {
        success: true,
        message: `${products.length} products added successfully`,
        count: products.length,
        ids: insertedIds,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding products:", error);
    return NextResponse.json(
      {
        error: "Failed to add products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint with documentation
export async function GET() {
  return NextResponse.json({
    message: "Batch Product API",
    method: "POST",
    endpoint: "/api/products/batch",
    description: "Add multiple products at once",
    format: {
      body: {
        products: [
          {
            name: "string (required)",
            image: "string (required - image URL)",
            price: "number (required)",
            postfix: "string (required)",
            categories: "array of CATEGORY NAMES from 'name' field (required)",
          },
        ],
      },
    },
    example: {
      products: [
        {
          name: "Plywood 4x8 feet",
          image: "https://...",
          price: 1200,
          postfix: "per sheet",
          categories: ["plywood"],
        },
        {
          name: "Cement 50kg",
          image: "https://...",
          price: 450,
          postfix: "per bag",
          categories: ["cement", "building"],
        },
      ],
    },
  });
}
