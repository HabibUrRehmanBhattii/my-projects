"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Medusa from "@medusajs/medusa-js";
import ProductCard from "@/components/product/ProductCard";

// Types
type Product = {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  variants: {
    prices: { amount: number; currency_code: string }[];
  }[];
  description?: string;
  collection_id?: string;
  categories?: { id: string; name: string; handle: string }[];
};

type Category = {
  id: string;
  name: string;
  handle: string;
  description?: string;
  parent_category_id?: string;
  category_children?: Category[];
};

// Sort options
const sortOptions = [
  { label: "Latest", value: "created_at:desc" },
  { label: "Price: Low to High", value: "price:asc" },
  { label: "Price: High to Low", value: "price:desc" },
  { label: "Name: A-Z", value: "title:asc" },
  { label: "Name: Z-A", value: "title:desc" },
];

// Filter price ranges
const priceRanges = [
  { label: "Under $50", min: 0, max: 5000 },
  { label: "$50 - $100", min: 5000, max: 10000 },
  { label: "$100 - $200", min: 10000, max: 20000 },
  { label: "$200 - $500", min: 20000, max: 50000 },
  { label: "$500+", min: 50000, max: 1000000 },
];

// Category banners for special categories
const categoryBanners: Record<string, { title: string; subtitle: string; image: string }> = {
  women: {
    title: "Women's Collection",
    subtitle: "Elegant sarees, salwar kameez, lehengas, and fusion wear for every occasion",
    image: "/images/banner-women.jpg",
  },
  men: {
    title: "Men's Collection",
    subtitle: "Traditional sherwanis, kurtas, and modern indo-western outfits for the modern man",
    image: "/images/banner-men.jpg",
  },
  wedding: {
    title: "Wedding Collection",
    subtitle: "Luxurious bridal and groom wear for your special day with intricate embroidery and details",
    image: "/images/banner-wedding.jpg",
  },
  new: {
    title: "New Arrivals",
    subtitle: "The latest additions to our South Asian fashion collection featuring contemporary designs",
    image: "/images/banner-new.jpg",
  },
  sale: {
    title: "Sale Collection",
    subtitle: "Premium Pakistani and Indian clothing at special prices for a limited time",
    image: "/images/banner-sale.jpg",
  },
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState(sortOptions[0].value);
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 12;

  // Check if category has a special banner
  const hasSpecialBanner = !!categoryBanners[params.slug];
  const categoryBanner = categoryBanners[params.slug];

  // Initialize Medusa client
  const medusa = new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
    publishableApiKey: process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY!,
    maxRetries: 3
  });

  // Fetch category and products
  useEffect(() => {
    setLoading(true);
    setPage(1); // Reset to page 1 when slug changes
    setHasMore(true);

    // In a real app, you would fetch the category and then fetch products by category ID
    // For now, we'll simulate this by using the slug as a placeholder for category ID
    
    // Fetch products with applied filters
    fetchProducts();
    
  }, [params.slug, sortOption, priceFilter]);

  // Function to fetch products
  const fetchProducts = async (pageToFetch = 1) => {
    try {
      setLoading(true);
      
      // In a real implementation, you would filter products by category ID
      // For now, just fetch all products and simulate filtering
      const response = await medusa.products.list({
        limit: itemsPerPage,
        offset: (pageToFetch - 1) * itemsPerPage,
      });
      
      // Simulate filtering by category - in a real app, this would be done through the API
      let filteredProducts = response.products as unknown as Product[];
      
      // Apply price filter if set
      if (priceFilter) {
        filteredProducts = filteredProducts.filter(product => {
          const price = product.variants?.[0]?.prices?.[0]?.amount || 0;
          return price >= priceFilter.min && price <= priceFilter.max;
        });
      }
      
      // For demo purposes, create a mock category if fetching real category fails
      const mockCategory = {
        id: params.slug,
        name: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
        handle: params.slug,
        description: `Collection of ${params.slug} items`,
      };
      
      if (pageToFetch === 1) {
        setProducts(filteredProducts);
        setCategory(mockCategory);
      } else {
        setProducts(prevProducts => [...prevProducts, ...filteredProducts]);
      }
      
      setTotalCount(30); // Mock total count
      setHasMore(filteredProducts.length === itemsPerPage);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load more products
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  // Apply price filter
  const handlePriceFilterChange = (min: number, max: number) => {
    setPriceFilter({ min, max });
  };

  // Clear price filter
  const clearPriceFilter = () => {
    setPriceFilter(null);
  };

  // Render active filters
  const renderActiveFilters = () => {
    if (!priceFilter) return null;
    
    const activePriceRange = priceRanges.find(
      range => range.min === priceFilter.min && range.max === priceFilter.max
    );
    
    if (!activePriceRange) return null;
    
    return (
      <div className="flex items-center mt-4">
        <span className="text-sm text-neutral-600 mr-2">Filters:</span>
        <div className="flex items-center bg-neutral-100 rounded px-3 py-1">
          <span className="text-sm text-neutral-800">{activePriceRange.label}</span>
          <button 
            className="ml-2 text-neutral-500 hover:text-neutral-900"
            onClick={clearPriceFilter}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Category Banner - Only for special categories */}
      {hasSpecialBanner && (
        <section className="relative h-[40vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-20" />
          
          {/* Placeholder for image - in production, use real images */}
          <div className="h-full w-full bg-gradient-to-r from-primary-dark to-primary-light">
            {/* If you have actual images: */}
            {/* <Image 
              src={categoryBanner.image} 
              alt={categoryBanner.title}
              fill
              className="object-cover"
            /> */}
          </div>
          
          <div className="container mx-auto px-4 h-full flex items-end relative z-30 pb-12">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading mb-2">
                {categoryBanner.title}
              </h1>
              <p className="text-lg text-white/90">
                {categoryBanner.subtitle}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Category Header - For non-special categories */}
        {!hasSpecialBanner && (
          <>
            <h1 className="text-3xl font-heading font-bold mb-2">
              {category?.name || params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}
            </h1>
            <p className="text-neutral-600 mb-8">
              {category?.description || `Explore our collection of ${params.slug} items`}
            </p>
          </>
        )}
        
        {/* Breadcrumbs */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-primary hover:text-primary-dark">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link href="/categories" className="text-primary hover:text-primary-dark">
                Categories
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-neutral-500">
                {category?.name || params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}
              </span>
            </li>
          </ol>
        </nav>
        
        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          {/* Mobile Filter Button */}
          <button 
            className="md:hidden flex items-center text-neutral-800 mb-4"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filter Products
          </button>
          
          {/* Product Count */}
          <p className="text-neutral-600 mb-4 md:mb-0">
            {loading ? 'Loading products...' : `Showing ${products.length} products`}
          </p>
          
          {/* Sort Dropdown */}
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-neutral-600">Sort:</label>
            <select 
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Mobile Filters */}
        {isFilterOpen && (
          <div className="md:hidden bg-white border border-neutral-200 rounded-lg p-4 mb-6">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.label} className="flex items-center">
                    <input 
                      type="radio" 
                      id={`mobile-price-${range.min}`}
                      name="mobile-price-range"
                      className="text-primary focus:ring-primary"
                      checked={priceFilter?.min === range.min && priceFilter?.max === range.max}
                      onChange={() => handlePriceFilterChange(range.min, range.max)}
                    />
                    <label htmlFor={`mobile-price-${range.min}`} className="ml-2 text-neutral-700">
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {priceFilter && (
              <button 
                className="text-primary text-sm hover:text-primary-dark"
                onClick={clearPriceFilter}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
        
        {/* Active Filters */}
        {renderActiveFilters()}
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters - Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <h3 className="font-medium border-b border-neutral-200 pb-2 mb-4">Filters</h3>
              
              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-sm uppercase text-neutral-500 mb-2">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.label} className="flex items-center">
                      <input 
                        type="radio" 
                        id={`price-${range.min}`}
                        name="price-range"
                        className="text-primary focus:ring-primary"
                        checked={priceFilter?.min === range.min && priceFilter?.max === range.max}
                        onChange={() => handlePriceFilterChange(range.min, range.max)}
                      />
                      <label htmlFor={`price-${range.min}`} className="ml-2 text-neutral-700">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Other filters would go here */}
              
              {/* Clear Filters */}
              {priceFilter && (
                <button 
                  className="text-primary text-sm hover:text-primary-dark"
                  onClick={clearPriceFilter}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            {error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                <p>{error}</p>
                <button 
                  className="text-primary mt-2"
                  onClick={() => fetchProducts()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {loading && products.length === 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="bg-neutral-200 rounded-lg aspect-[3/4] mb-3"></div>
                        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {products.map((product) => (
                        <ProductCard 
                          key={product.id}
                          id={product.id}
                          title={product.title}
                          thumbnail={product.thumbnail || '/placeholder-product.jpg'}
                          price={product.variants?.[0]?.prices?.[0]?.amount || 0}
                          handle={product.handle}
                          isNew={Math.random() > 0.8}
                          isSale={params.slug === 'sale' || Math.random() > 0.85}
                        />
                      ))}
                    </div>
                    
                    {/* Load More Button */}
                    {hasMore && (
                      <div className="text-center mt-12">
                        <button 
                          className="btn-outline px-8"
                          onClick={loadMore}
                          disabled={loading}
                        >
                          {loading ? 'Loading...' : 'Load More Products'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-neutral-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-medium mb-2">No Products Found</h2>
                    <p className="text-neutral-600 mb-6">
                      We couldn't find any products matching your criteria. Try adjusting your filters or check back later.
                    </p>
                    {priceFilter && (
                      <button 
                        className="text-primary hover:text-primary-dark font-medium"
                        onClick={clearPriceFilter}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}