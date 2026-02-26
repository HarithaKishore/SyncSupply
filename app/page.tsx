
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "./components/LoadingPage";
import LoginPopup from "./components/LoginPopup";
import { useCategories } from "@/lib/hooks/useCatalogs";

export default function Home() {
  const [showLoading, setShowLoading] = useState(true);
  const { categories, loading } = useCategories();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return <LoadingPage />;
  }

  return (
    <main 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `linear-gradient(135deg, #e3f2fd 0%, #b3e5fc 100%)`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header Section */}
      <header 
        className="w-full shadow-lg py-8"
        style={{
          backgroundImage: `linear-gradient(135deg, #e3f2fd 0%, #b3e5fc 100%)`,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Top Bar with Login and Cart */}
        <div className="max-w-7xl mx-auto px-8 flex justify-end gap-6 mb-6">
          <LoginPopup />
          <button className="flex items-center gap-2 text-blue-900 hover:text-blue-700 transition-colors">
            <span className="text-2xl">🛒</span>
            <span className="font-semibold">Cart</span>
          </button>
        </div>

        {/* Construction Icons */}
        <div className="flex gap-4 mb-6 text-4xl justify-center">
          <span>🏗️</span>
          <span>🔨</span>
          <span>🛠️</span>
          <span>⚒️</span>
        </div>
        
        {/* Logo */}
        <div className="flex items-center justify-center">
          <h1 
            className="text-7xl font-black text-blue-900 tracking-wider"
            style={{
              textShadow: '3px 3px 0px rgba(0, 0, 0, 0.1), 6px 6px 12px rgba(30, 60, 114, 0.3)',
              letterSpacing: '0.05em'
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
              placeholder="Search for materials, tools, and more..." 
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Catalog Section (Placeholder for now) */}
      <section className="flex-1 p-12 bg-white">
        <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">Build Your Dream - Shop Materials</h2>
        
        {/* Catalog Grid - Dynamically grows based on number of items */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No categories available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  onClick={() => router.push(`/products/${category.id}`)}
                  className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="w-full h-40 bg-cover bg-center flex items-center justify-center overflow-hidden relative">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.displayName}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-200">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-lg font-semibold text-blue-900">{category.displayName}</p>
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
