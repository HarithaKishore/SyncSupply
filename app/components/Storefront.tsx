"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import LoginPopup from "./LoginPopup";

type IconName = "box" | "search" | "arrow" | "cart";

const iconPaths: Record<IconName, ReactNode> = {
  box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 8v8l9 5 9-5V8M12 13v8M7.5 5.5l9 5" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
  arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
  cart: <><path d="M3 3h2l3 12h10l3-9H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
};

export function StoreIcon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

export function Brand() {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2.5" aria-label="SyncSupply home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white">
        <StoreIcon name="box" className="h-5 w-5" />
      </span>
      <span className="text-xl font-semibold tracking-tight text-slate-900">Sync<span className="text-blue-700">Supply</span></span>
    </Link>
  );
}

export default function Storefront({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="site-container flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <Brand />
          <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-6">
            <Link href="/#catalog" className="hidden text-sm font-medium text-slate-600 hover:text-blue-700 sm:block">Catalog</Link>
            <LoginPopup />
            <button className="secondary-button" type="button" aria-label="Cart">
              <StoreIcon name="cart" />
              <span className="hidden sm:inline">Cart</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="site-container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Brand />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">Your trusted partner for all construction materials.</p>
          </div>
          <div className="lg:pl-12">
            <h2 className="text-sm font-semibold text-slate-900">Get in touch</h2>
            <a href="mailto:info@syncsupply.com" className="mt-3 block text-sm text-slate-500 hover:text-blue-700">info@syncsupply.com</a>
            <a href="tel:+919876543210" className="mt-2 block text-sm text-slate-500 hover:text-blue-700">+91 9876543210</a>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Based in Chennai</h2>
            <p className="mt-3 text-sm text-slate-500">Chennai, Tamil Nadu</p>
            <Link href="/#catalog" className="mt-2 inline-block text-sm text-blue-700 hover:text-blue-900">Explore the catalog</Link>
          </div>
        </div>
        <div className="site-container border-t border-slate-100 py-5 text-xs text-slate-500">
          &copy; 2026 SyncSupply. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
