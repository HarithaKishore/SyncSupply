"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LoginPopup from "@/app/components/LoginPopup";

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
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("id", "==", productId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const productData = querySnapshot.docs[0].data() as Product;
          setProduct(productData);

          // Fetch categories if product has any
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

  // Fetch categories by IDs
  const fetchCategories = async (categoryIds: string[]) => {
    try {
      const q = query(
        collection(db, "categories"),
        where("id", "in", categoryIds)
      );
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

  const handleAddToCart = () => {
    // TODO: Add to cart functionality
    console.log(`Added ${quantity} of product ${product?.name} to cart`);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: `linear-gradient(135deg, #e3f2fd 0%, #b3e5fc 100%)`,
        backgroundAttachment: "fixed",
      }}>
        <p className="text-lg text-gray-600">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: `linear-gradient(135deg, #e3f2fd 0%, #b3e5fc 100%)`,
        backgroundAttachment: "fixed",
      }}>
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => router.back()}
            className="text-blue-900 hover:text-blue-700 font-semibold"
          >
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `linear-gradient(135deg, #e3f2fd 0%, #b3e5fc 100%)`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header Section */}
      <header
        className="w-full shadow-lg py-8"
        style={{
          backgroundImage: `linear-gradient(135deg, #e3f2fd 0%, #b3e5fc 100%)`,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Top Bar with Navigation */}
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-900 hover:text-blue-700 transition-colors font-semibold flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="flex justify-end gap-6">
            <LoginPopup />
            <button className="flex items-center gap-2 text-blue-900 hover:text-blue-700 transition-colors">
              <span className="text-2xl">🛒</span>
              <span className="font-semibold">Cart</span>
            </button>
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center">
          <h1
            className="text-7xl font-black text-blue-900 tracking-wider"
            style={{
              textShadow: "3px 3px 0px rgba(0, 0, 0, 0.1), 6px 6px 12px rgba(30, 60, 114, 0.3)",
              letterSpacing: "0.05em",
            }}
          >
            HOMFLOW
          </h1>
        </div>
      </header>

      {/* Product Details Section */}
      <section className="flex-1 p-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-start">
              {/* Product Name */}
              <h1 className="text-4xl font-bold text-blue-900 mb-4">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="mb-8 pb-8 border-b-2 border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Price</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-bold text-blue-700">₹{product.price}</p>
                  <p className="text-lg text-gray-600">{product.postfix}</p>
                </div>
              </div>

              {/* Quantity Section */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="text-2xl font-semibold text-blue-900 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-900 text-white py-4 rounded-lg hover:bg-blue-800 transition-colors font-bold text-lg mb-4"
              >
                Add to Cart
              </button>

              {/* Categories */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <span
                        key={category.id}
                        className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {category.displayName}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No categories assigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer
        className="w-full py-12 px-8"
        style={{
          backgroundImage: `linear-gradient(135deg, #e3f2fd 0%, #b3e5fc 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="flex flex-col items-start">
              <div className="text-5xl mb-4">🏗️</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">HOMFLOW</h3>
              <p className="text-blue-800 text-sm mb-6">
                Your trusted partner for all construction materials
              </p>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col justify-start space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <p className="font-semibold text-blue-900">Email</p>
                  <p className="text-blue-800">info@homflow.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-semibold text-blue-900">Location</p>
                  <p className="text-blue-800">Chennai, Tamil Nadu</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <p className="font-semibold text-blue-900">Contact</p>
                  <p className="text-blue-800">+91 9876543210</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-8 border-blue-300" />

          {/* Copyright */}
          <div className="text-center text-blue-800 text-sm">
            <p>&copy; 2026 HOMFLOW. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
