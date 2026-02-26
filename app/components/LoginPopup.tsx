"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPopup() {
  const { data: session } = useSession();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogin = async (provider: string) => {
    await signIn(provider, { redirect: false });
    setShowPopup(false);
  };

  return (
    <>
      {/* Login Button */}
      {!session ? (
        <button 
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 text-blue-900 hover:text-blue-700 transition-colors"
        >
          <span className="text-2xl">👤</span>
          <span className="font-semibold">Login</span>
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <img 
            src={session.user?.image || ""} 
            alt="User" 
            className="w-8 h-8 rounded-full"
          />
          <span className="text-blue-900 font-semibold">{session.user?.name}</span>
          <button
            onClick={() => signOut()}
            className="text-blue-900 hover:text-blue-700 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      )}

      {/* Login Popup Modal */}
      {showPopup && !session && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-96">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="float-right text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-3xl font-bold text-blue-900 mb-2 clear-both">Welcome to HOMFLOW</h2>
            <p className="text-gray-600 mb-8">Sign in to your account</p>

            {/* Google Login Button */}
            <button
              onClick={() => handleLogin("google")}
              className="w-full bg-white border-2 border-blue-200 text-blue-900 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-3 mb-4"
            >
              <span className="text-2xl">🔵</span>
              Sign in with Google
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email Input (Future use) */}
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-blue-500"
              disabled
            />

            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
            >
              Sign in with Email (Coming Soon)
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 mt-6 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      )}
    </>
  );
}
