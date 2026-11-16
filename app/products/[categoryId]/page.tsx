"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useProductsByCategory } from "@/lib/hooks/useProductsByCategory";
import { useCategories } from "@/lib/hooks/useCatalogs";
import Storefront, { StoreIcon } from "@/app/components/Storefront";

export default function ProductsPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { products, loading: productsLoading } = useProductsByCategory(categoryId);
  const { categories, loading: categoriesLoading } = useCategories();
  const categoryName = categories.find((category) => category.id === categoryId)?.displayName;

  return (
    <Storefront>
      <section className="site-container py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/#catalog" className="hover:text-blue-700">Catalog</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-800">{categoryName || "Products"}</span>
        </nav>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Explore the range</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{categoryName || "Products"}</h1>
            <p className="mt-3 text-sm text-slate-500">Compare materials and find the right fit for your project.</p>
          </div>
          <label className="search-field w-full sm:w-80">
            <StoreIcon name="search" />
            <input type="search" aria-label="Search products" placeholder="Search products..." />
          </label>
        </div>

        {productsLoading || categoriesLoading ? (
          <div role="status" className="loading-state"><span className="loading-spinner" />Loading products...</div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <StoreIcon name="box" className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <h2 className="font-medium text-slate-800">No products available yet</h2>
            <p className="mt-2 text-sm text-slate-500">Explore another category or check back for new materials.</p>
            <Link href="/#catalog" className="secondary-button mt-6">Back to catalog</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="catalog-card group">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h2 className="line-clamp-2 min-h-12 text-sm font-medium leading-6 text-slate-900 group-hover:text-blue-700">{product.name}</h2>
                  <div className="mt-4 flex flex-wrap items-baseline gap-2 border-t border-slate-100 pt-4">
                    <span className="text-xl font-semibold tracking-tight text-blue-800">₹{product.price}</span>
                    <span className="text-xs text-slate-500">{product.postfix}</span>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-xs font-medium text-blue-700">View product <StoreIcon name="arrow" className="h-3.5 w-3.5" /></p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Storefront>
  );
}
