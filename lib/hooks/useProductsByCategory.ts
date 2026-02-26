"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/types/product";

export function useProductsByCategory(categoryId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "products"),
        where("categories", "array-contains", categoryId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as Product[];
        setProducts(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setLoading(false);
    }
  }, [categoryId]);

  return { products, loading, error };
}
