"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useProductsByCategory } from "@/lib/hooks/useProductsByCategory";
import { useCategories } from "@/lib/hooks/useCatalogs";
import LoginPopup from "@/app/components/LoginPopup";

export default function ProductsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const [categoryName, setCategoryName] = useState<string>("");

  const { products, loading: productsLoading } = useProductsByCategory(categoryId);
  const { categories, loading: categoriesLoading } = useCategories();

  // Find category name
  useEffect(() => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setCategoryName(category.displayName);
    }
  }, [categories, categoryId]);

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
        {/* Top Bar with Login and Cart */}
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/")}
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

      {/* Search Box Section */}
      <div className="w-full bg-white py-6 shadow-md">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-6 py-3">
            <span className="text-2xl">🔍</span>
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="flex-1 p-12 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Category Title */}
          <h2 className="text-4xl font-bold text-blue-900 mb-12">
            {categoryName ? `${categoryName} Products` : "Products"}
          </h2>

          {/* Products Grid */}
          {productsLoading || categoriesLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No products available in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="w-full h-48 bg-cover bg-center flex items-center justify-center overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Product Name (Truncated) */}
                    <p className="text-sm font-semibold text-blue-900 mb-2 truncate">
                      {product.name}
                    </p>

                    {/* Price and Postfix */}
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-blue-700">₹{product.price}</p>
                      <p className="text-xs text-gray-600">{product.postfix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              <p className="text-blue-800 text-sm mb-6">Your trusted partner for all construction materials</p>
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
