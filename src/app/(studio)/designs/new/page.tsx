import type { Metadata } from "next";
import { NewDesignForm } from "@/components/NewDesignForm";
import { apiGet } from "@/lib/api";
import type { Market, Product } from "@/lib/types";

export const metadata: Metadata = { title: "New design" };

export default async function NewDesignPage() {
  const [{ products }, { markets }] = await Promise.all([
    apiGet<{ products: Product[] }>("/catalog/products"),
    apiGet<{ markets: Market[] }>("/catalog/markets"),
  ]);

  return (
    <div className="grid gap-6">
      <h1 className="text-4xl">New design</h1>
      {products.length === 0 || markets.length === 0 ? (
        <p className="text-mid">The catalog is not ready yet. Please check back soon.</p>
      ) : (
        <NewDesignForm products={products} markets={markets} />
      )}
    </div>
  );
}
