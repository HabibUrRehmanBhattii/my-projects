// my-nextjs-frontend/src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Medusa from "@medusajs/medusa-js";
import ProductCard from "@/components/product/ProductCard";

// Type definitions
type Price = {
  amount: number;
  currency_code: string;
};

type Variant = {
  prices?: Price[];
};

type Product = {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  variants?: Variant[];
  description?: string;
};

// Featured categories for South Asian fashion
const featuredCategories = [
  {
    name: "Women's Collection",
    image: "/images/category-women.jpg",
    handle: "women",
    description: "Elegant sarees, salwar kameez, lehengas, and fusion wear"
  },
  {
    name: "Men's Collection",
    image: "/images/category-men.jpg",
    handle: "men",
    description: "Traditional sherwanis, kurtas, and modern indo-western outfits"
  },
  {
    name: "Wedding Attire",
    image: "/images/category-wedding.jpg",
    handle: "wedding",
    description: "Luxurious bridal and groom wear for your special day"
  },
  {
    name: "Accessories",
    image: "/images/category-accessories.jpg",
    handle: "accessories",
    description: "Complete your look with traditional jewelry and accessories"
  },
];

// Hero banner slides
const heroBanners = [
  {
    image: "/images/hero-1.jpg",
    title: "Timeless Elegance",
    subtitle: "Discover our new collection of traditional Pakistani & Indian attire",
    cta: "Shop Now",
    link: "/categories/new",
  },
  {
    image: "/images/hero-2.jpg",
    title: "Wedding Season",
    subtitle: "Find the perfect outfit for your special occasions",
    cta: "Explore Collection",
    link: "/categories/wedding",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);

  // Initialize medusa client
  const medusa = new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
    publishableApiKey: process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY!,
    maxRetries: 3
  });

  // Cycle through hero banners
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prevIndex) => (prevIndex + 1) % heroBanners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch products from Medusa backend
  useEffect(() => {
    setLoading(true);
    
    // Fetch all products
    medusa.products
      .list({ limit: 12 })
      .then(({ products }) => {
        setProducts(products as unknown as Product[]);
        
        // Filter for featured products (could be based on collection, tags, etc.)
        setFeaturedProducts(products.slice(0, 4) as unknown as Product[]);
        
        // Filter for new arrivals (could be based on created_at date)
        setNewArrivals(products.slice(4, 10) as unknown as Product[]);
        
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Error fetching products. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Sliding Banners */}
      <section className="relative h-[70vh] overflow-hidden">
        {heroBanners.map((banner, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeHeroIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative h-full w-full">
              <div className="absolute inset-0 bg-black/30 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-20" />
              
              {/* Placeholder for image - in production, use real images */}
              <div className="h-full w-full bg-gradient-to-r from-primary-dark to-primary-light">
                {/* If you have actual images: */}
                {/* <Image 
                  src={banner.image} 
                  alt={banner.title}
                  fill
                  className="object-cover"
                /> */}
              </div>
              
              <div className="container mx-auto px-4 h-full flex items-center relative z-30">
                <div className="max-w-lg">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading mb-4">
                    {banner.title}
                  </h1>
                  <p className="text-xl text-white/90 mb-8">
                    {banner.subtitle}
                  </p>
                  <Link 
                    href={banner.link}
                    className="btn-accent inline-block"
                  >
                    {banner.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Banner Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-40">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveHeroIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeHeroIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-fancy inline-block mb-4">Shop by Category</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Explore our curated collections of authentic South Asian fashion, 
              from traditional to contemporary designs for every occasion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCategories.map((category) => (
              <Link 
                key={category.handle} 
                href={`/categories/${category.handle}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 z-10" />
                  
                  {/* Placeholder for category image - in production, use real images */}
                  <div className="h-full w-full bg-neutral-300">
                    {/* If you have actual images: */}
                    {/* <Image 
                      src={category.image} 
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    /> */}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-xl font-heading text-white font-bold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/80 mb-3">
                      {category.description}
                    </p>
                    <span className="inline-flex items-center text-accent text-sm font-medium">
                      Shop Now
                      <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="heading-fancy mb-2">Featured Collection</h2>
              <p className="text-neutral-600">
                Our most popular picks from Pakistani and Indian fashion
              </p>
            </div>
            <Link 
              href="/categories/featured"
              className="text-primary font-medium hidden md:flex items-center hover:text-primary-dark transition-colors"
            >
              View All
              <svg className="ml-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-neutral-200 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  thumbnail={product.thumbnail || '/placeholder-product.jpg'}
                  price={product.variants?.[0]?.prices?.[0]?.amount || 0}
                  originalPrice={product.variants?.[0]?.prices?.[0]?.amount ? product.variants[0].prices[0].amount * 1.2 : undefined}
                  handle={product.handle}
                  isNew={Math.random() > 0.7}
                  isSale={Math.random() > 0.7}
                />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/categories/featured"
              className="btn-outline"
            >
              View All Featured
            </Link>
          </div>
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="py-12 bg-pattern bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border-2 border-accent/20 p-8 md:p-12 bg-white shadow-soft">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">
                  Special Offer for Eid Collection
                </h2>
                <p className="text-lg text-neutral-700 mb-6">
                  Get up to 30% off on our exclusive Eid collection. Limited time offer!
                </p>
                <Link href="/categories/sale" className="btn-primary">
                  Shop the Sale
                </Link>
              </div>
              
              <div className="w-full md:w-1/3 aspect-square md:aspect-[4/3] rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 flex items-center justify-center">
                <span className="text-6xl md:text-8xl font-bold text-accent">
                  30%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="heading-fancy mb-2">New Arrivals</h2>
              <p className="text-neutral-600">
                The latest additions to our South Asian fashion collection
              </p>
            </div>
            <Link 
              href="/categories/new"
              className="text-primary font-medium hidden md:flex items-center hover:text-primary-dark transition-colors"
            >
              View All
              <svg className="ml-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-neutral-200 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  thumbnail={product.thumbnail || '/placeholder-product.jpg'}
                  price={product.variants?.[0]?.prices?.[0]?.amount || 0}
                  handle={product.handle}
                  isNew={true}
                />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/categories/new"
              className="btn-outline"
            >
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Authentic Designs</h3>
              <p className="text-neutral-600">Genuine South Asian craftsmanship in every piece</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Secure Payment</h3>
              <p className="text-neutral-600">Multiple payment options with enhanced security</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Premium Quality</h3>
              <p className="text-neutral-600">Hand-selected fabrics and meticulous craftsmanship</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Customer Support</h3>
              <p className="text-neutral-600">Dedicated assistance for all your shopping needs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
