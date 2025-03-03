"use client";

import { useEffect, useState } from "react";
import Medusa from "@medusajs/medusa-js";

// Type definitions for better type safety
type Price = {
  amount: number;
  currency_code: string;
};

type Variant = {
  prices?: Price[];
};

// Update the Product type to match PricedProduct from Medusa
type Product = {
  id: string | undefined;
  title: string;
  variants?: Variant[];
  // Adding other potential fields that might come from Medusa
  description?: string | null;
  handle?: string | null;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Log the environment variables to verify they are loaded correctly
  console.log("Backend URL:", process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL);
  console.log("Publishable API Key:", process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY);

  const medusa = new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
    publishableApiKey: process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY!,
    maxRetries: 3
  });

  useEffect(() => {
    // If the default region is set correctly on the backend, you can call list() without extra params:
    medusa.products
      .list()
      .then(({ products }) => {
        setProducts(products as unknown as Product[]);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
        }
        setError("Error fetching products. Check your backend configuration.");
      });
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My E-Commerce Store</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <ul className="space-y-2">
        {products.length === 0 && !error && (
          <p>Loading products...</p>
        )}
        {products.map((product) => (
          <li key={product.id} className="p-4 bg-black-100 rounded shadow">
            {product.title} -{" "}
            {product.variants?.[0]?.prices?.[0]
              ? `$${product.variants[0].prices[0].amount / 100}`
              : "Price N/A"}
          </li>
        ))}
      </ul>
    </main>
  );
}
