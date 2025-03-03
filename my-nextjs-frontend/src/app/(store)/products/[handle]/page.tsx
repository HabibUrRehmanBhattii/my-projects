"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Medusa from "@medusajs/medusa-js";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Types
type ProductImage = {
  id: string;
  url: string;
};

type ProductOption = {
  id: string;
  title: string;
  values: { id: string; value: string }[];
};

type ProductVariant = {
  id: string;
  title: string;
  prices: { amount: number; currency_code: string }[];
  options: { value: string; option_id: string }[];
  inventory_quantity: number;
};

type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: ProductImage[];
  thumbnail: string;
  options: ProductOption[];
  variants: ProductVariant[];
  tags: { value: string }[];
  collection?: { title: string; handle: string };
};

// Product Details Page Component
export default function ProductPage({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  
  // Initialize Medusa client
  const medusa = new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
    publishableApiKey: process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY!,
    maxRetries: 3
  });

  // Fetch product details
  useEffect(() => {
    setLoading(true);
    
    medusa.products
      .list({ handle: params.handle })
      .then(({ products }) => {
        if (products.length > 0) {
          const productData = products[0] as unknown as Product;
          setProduct(productData);
          
          // Initialize selected options with the first available option for each type
          const initialOptions: Record<string, string> = {};
          productData.options.forEach((option) => {
            if (option.values.length > 0) {
              initialOptions[option.id] = option.values[0].value;
            }
          });
          setSelectedOptions(initialOptions);
          
        } else {
          setError("Product not found");
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.handle]);

  // Update selected variant when options change
  useEffect(() => {
    if (!product) return;
    
    const variant = product.variants.find((v) => {
      return v.options.every((option) => {
        const optionId = option.option_id;
        return selectedOptions[optionId] === option.value;
      });
    });
    
    setSelectedVariant(variant || null);
  }, [selectedOptions, product]);

  // Handle option change
  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
  };

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    // In a real application, this would update the cart in Medusa
    console.log("Adding to cart:", {
      variant_id: selectedVariant.id,
      quantity: quantity,
    });
    
    // Show confirmation
    alert("Item added to cart!");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="w-full md:w-1/2 bg-neutral-200 aspect-square rounded-lg"></div>
          <div className="w-full md:w-1/2">
            <div className="h-10 bg-neutral-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-neutral-200 rounded w-1/4 mb-8"></div>
            <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-8"></div>
            <div className="h-10 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-neutral-200 rounded w-full mb-6"></div>
            <div className="h-12 bg-primary/20 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-800 mb-4">Oops! Something went wrong</h1>
        <p className="text-neutral-600 mb-8">{error || "Product not found"}</p>
        <Link href="/categories" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const productPrice = selectedVariant?.prices[0]?.amount 
    ? (selectedVariant.prices[0].amount / 100).toFixed(2)
    : "N/A";

  const isInStock = selectedVariant?.inventory_quantity && selectedVariant.inventory_quantity > 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
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
            {product.collection ? (
              <Link 
                href={`/categories/${product.collection.handle}`}
                className="text-primary hover:text-primary-dark"
              >
                {product.collection.title}
              </Link>
            ) : (
              <Link href="/categories" className="text-primary hover:text-primary-dark">
                Products
              </Link>
            )}
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-neutral-500 truncate max-w-[150px]">{product.title}</span>
          </li>
        </ol>
      </nav>
      
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-24">
            {product.images && product.images.length > 0 ? (
              <div className="relative">
                <Carousel 
                  selectedItem={activeImageIndex}
                  onChange={setActiveImageIndex}
                  showStatus={false}
                  showIndicators={false}
                  infiniteLoop
                  className="product-carousel"
                >
                  {product.images.map((image) => (
                    <div key={image.id} className="aspect-square relative overflow-hidden rounded-lg">
                      <Image
                        src={image.url}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </Carousel>
                
                {/* Thumbnail navigation */}
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {product.images.slice(0, 5).map((image, index) => (
                    <button
                      key={image.id}
                      className={`aspect-square overflow-hidden rounded border-2 ${
                        index === activeImageIndex
                          ? "border-primary"
                          : "border-transparent hover:border-neutral-300"
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          sizes="20vw"
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-neutral-200 rounded-lg flex items-center justify-center">
                <span className="text-neutral-400">No image available</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          {/* Tags & Limited Edition Badge */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.tags && product.tags.map((tag) => (
              <span 
                key={tag.value} 
                className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
              >
                {tag.value}
              </span>
            ))}
            {Math.random() > 0.7 && (
              <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium">
                Limited Edition
              </span>
            )}
          </div>
          
          {/* Product Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 font-heading mb-2">
            {product.title}
          </h1>
          
          {/* Price */}
          <div className="mb-6">
            <span className="text-2xl font-bold text-primary">${productPrice}</span>
            
            {Math.random() > 0.7 && (
              <span className="ml-2 text-lg text-neutral-400 line-through">
                ${((parseFloat(productPrice) * 1.2)).toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Short Description */}
          <div 
            className={`prose prose-sm max-w-none mb-8 text-neutral-600 overflow-hidden transition-all duration-300 ${
              isDescriptionExpanded ? "max-h-[1000px]" : "max-h-24"
            }`}
          >
            <p>{product.description}</p>
          </div>
          
          {/* Read More/Less */}
          <button 
            className="text-primary font-medium text-sm mb-8 flex items-center"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          >
            {isDescriptionExpanded ? "Read Less" : "Read More"} 
            <svg 
              className={`ml-1 w-4 h-4 transition-transform ${isDescriptionExpanded ? "rotate-180" : ""}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Product Options */}
          <div className="space-y-6 mb-8">
            {product.options.map((option) => (
              <div key={option.id}>
                <h3 className="font-medium mb-2">{option.title}:</h3>
                
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isSelected = selectedOptions[option.id] === value.value;
                    
                    return (
                      <button
                        key={value.id}
                        className={`
                          px-4 py-2 rounded border-2 transition-all
                          ${isSelected 
                            ? "border-primary bg-primary/5 text-primary font-medium" 
                            : "border-neutral-300 text-neutral-600 hover:border-primary/50"
                          }
                        `}
                        onClick={() => handleOptionChange(option.id, value.value)}
                      >
                        {value.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Quantity */}
          <div className="mb-8">
            <h3 className="font-medium mb-2">Quantity:</h3>
            
            <div className="flex items-center border-2 border-neutral-300 rounded w-fit">
              <button 
                className="px-4 py-2 text-neutral-600 hover:text-primary disabled:opacity-50"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              
              <span className="px-4 py-2 text-neutral-800 font-medium">
                {quantity}
              </span>
              
              <button 
                className="px-4 py-2 text-neutral-600 hover:text-primary disabled:opacity-50"
                onClick={() => handleQuantityChange(1)}
                disabled={selectedVariant && quantity >= selectedVariant.inventory_quantity}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Availability */}
          <div className="mb-8 flex items-center">
            <span className="font-medium mr-2">Availability:</span>
            {isInStock ? (
              <span className="text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                In Stock ({selectedVariant?.inventory_quantity} available)
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              className="btn-primary flex-1 py-4"
              onClick={handleAddToCart}
              disabled={!isInStock || !selectedVariant}
            >
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </button>
            
            <button className="btn-outline flex-1 py-4 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Add to Wishlist
            </button>
          </div>
          
          {/* Additional Information */}
          <div className="border-t border-neutral-200 pt-8 space-y-6">
            {/* Shipping Info */}
            <div className="flex items-start space-x-4">
              <div className="bg-neutral-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Free Shipping</h4>
                <p className="text-sm text-neutral-600">On orders over $100</p>
              </div>
            </div>
            
            {/* Returns */}
            <div className="flex items-start space-x-4">
              <div className="bg-neutral-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Easy Returns</h4>
                <p className="text-sm text-neutral-600">30-day return policy</p>
              </div>
            </div>
            
            {/* Secure Checkout */}
            <div className="flex items-start space-x-4">
              <div className="bg-neutral-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Secure Checkout</h4>
                <p className="text-sm text-neutral-600">SSL encrypted payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Tabs - Details, Care Instructions, Reviews */}
      <div className="mt-16">
        <div className="border-b border-neutral-200">
          <div className="flex space-x-8">
            <button className="border-b-2 border-primary text-primary font-medium pb-4 px-1">
              Product Details
            </button>
            <button className="text-neutral-600 hover:text-neutral-800 pb-4 px-1">
              Care Instructions
            </button>
            <button className="text-neutral-600 hover:text-neutral-800 pb-4 px-1">
              Reviews
            </button>
          </div>
        </div>
        
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="prose prose-sm max-w-none text-neutral-600">
              <h4 className="text-neutral-800 font-medium text-lg mb-4">Description</h4>
              <p>{product.description}</p>
              
              <ul className="mt-6 space-y-2">
                <li>Authentic South Asian craftsmanship</li>
                <li>Premium fabric quality</li>
                <li>Hand embroidered details</li>
                <li>Traditional design with modern fit</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-neutral-800 font-medium text-lg mb-4">Details</h4>
              <div className="space-y-4">
                <div className="flex border-b border-neutral-200 pb-3">
                  <span className="w-1/3 text-neutral-600">Material</span>
                  <span className="w-2/3 font-medium">Cotton, Silk</span>
                </div>
                <div className="flex border-b border-neutral-200 pb-3">
                  <span className="w-1/3 text-neutral-600">Style</span>
                  <span className="w-2/3 font-medium">Traditional, Festive</span>
                </div>
                <div className="flex border-b border-neutral-200 pb-3">
                  <span className="w-1/3 text-neutral-600">Occasion</span>
                  <span className="w-2/3 font-medium">Party, Wedding, Festival</span>
                </div>
                <div className="flex border-b border-neutral-200 pb-3">
                  <span className="w-1/3 text-neutral-600">Origin</span>
                  <span className="w-2/3 font-medium">Pakistan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6 font-heading">You May Also Like</h3>
        
        {/* This would typically fetch related products based on product tags or categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Placeholder for related products - in a real app, fetch from API */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="product-card animate-pulse">
              <div className="bg-neutral-200 aspect-[3/4] rounded-lg mb-3"></div>
              <div className="h-5 bg-neutral-200 rounded w-2/3 mb-2"></div>
              <div className="h-5 bg-neutral-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}