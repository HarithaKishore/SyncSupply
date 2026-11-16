"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Storefront, { StoreIcon } from "@/app/components/Storefront";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  postfix: string;
  categories: string[];
}

interface Category {
  id: string;
  displayName: string;
}

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchCategories = async (categoryIds: string[]) => {
      try {
        const q = query(collection(db, "categories"), where("id", "in", categoryIds));
        const querySnapshot = await getDocs(q);
        const fetchedCategories = querySnapshot.docs.map((doc) => ({
          id: doc.data().id,
          displayName: doc.data().displayName,
        })) as Category[];
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProduct = async () => {
      try {
        const q = query(collection(db, "products"), where("id", "==", productId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const productData = querySnapshot.docs[0].data() as Product;
          setProduct(productData);
          if (productData.categories && productData.categories.length > 0) {
            await fetchCategories(productData.categories);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    // TODO: Add to cart functionality
    console.log(`Added ${quantity} of product ${product?.name} to cart`);
  };

  return (
    <Storefront>
      <section className="site-container py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/#catalog" className="hover:text-blue-700">Catalog</Link>
          {categories[0] && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={`/products/${categories[0].id}`} className="hover:text-blue-700">{categories[0].displayName}</Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-800">{product?.name || "Product details"}</span>
        </nav>

        {loading ? (
          <div role="status" className="loading-state"><span className="loading-spinner" />Loading product...</div>
        ) : !product ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <StoreIcon name="box" className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <h1 className="text-xl font-semibold text-slate-900">Product not found</h1>
            <p className="mt-3 text-sm text-slate-500">Explore the catalog to find materials for your project.</p>
            <Link href="/#catalog" className="secondary-button mt-6">Back to catalog</Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
            </div>
            <div className="py-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Product details</p>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
              <div className="mt-7 border-b border-slate-200 pb-7">
                <p className="mb-2 text-sm text-slate-500">Price</p>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-semibold tracking-tight text-blue-800">₹{product.price}</span>
                  <span className="text-sm text-slate-500">{product.postfix}</span>
                </div>
              </div>
              <div className="mt-7">
                <p id="quantity-label" className="mb-3 text-sm font-medium text-slate-700">Quantity</p>
                <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white" role="group" aria-labelledby="quantity-label">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity === 1} className="h-11 w-11 text-lg text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300" aria-label="Decrease quantity">−</button>
                  <span className="min-w-12 px-3 text-center text-sm font-semibold text-slate-900" aria-live="polite">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="h-11 w-11 text-lg text-slate-600 hover:bg-slate-50" aria-label="Increase quantity">+</button>
                </div>
              </div>
              <button onClick={handleAddToCart} className="primary-button mt-6 w-full"><StoreIcon name="cart" className="h-4 w-4" />Add to cart</button>
              <div className="mt-8 border-t border-slate-200 pt-6">
                <h2 className="mb-3 text-sm font-medium text-slate-700">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.length > 0 ? categories.map((category) => (
                    <Link key={category.id} href={`/products/${category.id}`} className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-800 hover:border-blue-300">{category.displayName}</Link>
                  )) : <p className="text-sm text-slate-500">No categories assigned</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Storefront>
  );
}
