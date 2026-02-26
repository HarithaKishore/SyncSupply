"use client";

export default function LoadingPage() {
  return (
    <main 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(135deg, #e3f2fd 0%, #b3e5fc 100%)`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Construction Icons Animated */}
      <div className="flex gap-6 mb-8 text-5xl animate-bounce">
        <span>🏗️</span>
        <span>🔨</span>
        <span>🛠️</span>
      </div>

      {/* Main Heading */}
      <div className="text-center mb-12">
        <h1 className="flex items-baseline justify-center gap-2">
          <span className="text-8xl font-bold text-blue-900">homflow</span>
          <span className="text-3xl font-semibold text-blue-700">.com</span>
        </h1>
      </div>

      {/* Loading Text */}
      <p className="text-xl text-blue-800">Loading...</p>

      {/* Loading Bar */}
      <div className="mt-8 w-64 h-2 bg-blue-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full animate-pulse"
          style={{
            width: '100%',
            animation: 'pulse 1.5s infinite'
          }}
        ></div>
      </div>
    </main>
  );
}
