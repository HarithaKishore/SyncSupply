"use client";

import { Brand } from "./Storefront";

export default function LoadingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50">
      <Brand />
      <p role="status" className="flex items-center gap-3 text-sm text-slate-500">
        <span className="loading-spinner" />Loading your catalog...
      </p>
    </main>
  );
}
