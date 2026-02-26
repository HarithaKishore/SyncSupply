"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define the Category interface matching your Firestore structure
export interface Category {
  id: string;
  name: string;
  image: string;
  displayName: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const q = query(collection(db, "categories"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
      setLoading(false);
    }
  }, []);

  return { categories, loading, error };
}
