import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name");
    const displayName = searchParams.get("displayName");

    if (!name && !displayName) {
      return NextResponse.json(
        {
          error: "Please provide either 'name' or 'displayName' as query parameter",
          usage: "/api/categories/by-name?name=plywood",
        },
        { status: 400 }
      );
    }

    // Search by displayName (more user-friendly)
    let q;
    if (displayName) {
      q = query(collection(db, "categories"), where("displayName", "==", displayName));
    } else {
      // Search by name (lowercase for case-insensitive search)
      q = query(collection(db, "categories"), where("name", "==", name?.toLowerCase()));
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        {
          error: "Category not found",
          searchedFor: displayName ? `displayName: ${displayName}` : `name: ${name}`,
        },
        { status: 404 }
      );
    }

    const category = querySnapshot.docs[0].data();

    return NextResponse.json(
      {
        success: true,
        id: category.id,
        name: category.name,
        displayName: category.displayName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch category",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
