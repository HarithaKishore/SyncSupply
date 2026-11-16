"use client";

import Link from "next/link";
import Storefront, { StoreIcon } from "./components/Storefront";
import { useCategories } from "@/lib/hooks/useCatalogs";

export default function Home() {
  const { categories, loading } = useCategories();

  return (
    <Storefront>
      <section className="border-b border-blue-100 bg-blue-50/60">
        <div className="site-container grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Materials for your next project</p>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Build with confidence.<br /><span className="text-blue-700">Source with simplicity.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">Explore construction materials and tools, compare products, and find what your project needs. All in one place.</p>
            <Link href="#catalog" className="primary-button mt-7">Explore the catalog <StoreIcon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white p-7 sm:p-8">
            <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><StoreIcon name="box" className="h-6 w-6" /></span>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">From planning to building.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">A straightforward way to explore your options, one category at a time.</p>
            <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
              {["Browse materials by category", "Compare prices and specifications", "Choose what works for your project"].map((text, index) => (
                <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">{index + 1}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="site-container scroll-mt-6 py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">The catalog</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Find your materials</h2>
            <p className="mt-2 text-sm text-slate-500">Start with a category to explore available products.</p>
          </div>
          <label className="search-field w-full sm:w-80">
            <StoreIcon name="search" />
            <input type="search" aria-label="Search materials" placeholder="Search materials and tools..." />
          </label>
        </div>

        {loading ? (
          <div role="status" className="loading-state"><span className="loading-spinner" />Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <StoreIcon name="box" className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <h3 className="font-medium text-slate-800">The catalog is on its way</h3>
            <p className="mt-2 text-sm text-slate-500">No categories available yet. Check back for new materials.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/products/${category.id}`} className="catalog-card group">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-100">
                  {category.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={category.image} alt={category.displayName} className="h-full w-full object-cover" />
                  ) : <StoreIcon name="box" className="h-10 w-10 text-slate-300" />}
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <h3 className="font-medium text-slate-900 group-hover:text-blue-700">{category.displayName}</h3>
                  <StoreIcon name="arrow" className="h-4 w-4 shrink-0 text-blue-700" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Storefront>
  );
}
