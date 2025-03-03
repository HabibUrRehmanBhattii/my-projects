"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../cart/CartContext";

interface ProductCardProps {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  handle: string;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
}

export default function ProductCard({
  id,
  title,
  thumbnail,
  price,
  handle,
  isNew = false,
  isSale = false,
  originalPrice,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Format price to display correctly
  const displayPrice = (price / 100).toFixed(2);
  const displayOriginalPrice = originalPrice ? (originalPrice / 100).toFixed(2) : undefined;

  // Safely use cart context with a try/catch to handle cases where the component
  // is used outside of a CartProvider (like on the main homepage)
  const safelyUseCart = () => {
    try {
      return useCart();
    } catch (error) {
      // Return a dummy implementation that does nothing
      return {
        addToCart: () => {
          console.warn("Cannot add to cart: CartProvider not found");
          alert("Please navigate to a product page to add items to your cart");
        },
        // Include other cart methods if needed
        cart: [],
        isCartOpen: false,
        cartCount: 0,
        cartTotal: 0,
        removeFromCart: () => {},
        updateQuantity: () => {},
        clearCart: () => {},
        toggleCart: () => {},
        closeCart: () => {}
      };
    }
  };
  
  const { addToCart } = safelyUseCart();

  // Quick add to cart handler
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      variant_id: id, // Using product ID as variant ID for demo
      quantity: 1,
      product: {
        id,
        title,
        handle,
        thumbnail,
      },
      variant: {
        id,
        title,
        prices: [{ amount: price, currency_code: "USD" }],
        options: [],
      }
    });
  };

  return (
    <Link
      href={`/products/${handle}`}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        {/* Product Image */}
        <div 
          className={`aspect-[3/4] bg-neutral-100 relative ${
            !isImageLoaded ? "animate-pulse" : ""
          }`}
        >
          <Image
            src={thumbnail || "/placeholder-product.jpg"}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : ""
            } ${!isImageLoaded ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>

        {/* Quick Add Button - Only shown on hover on desktop */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-black/70 p-3 transform transition-transform ${
            isHovered ? "translate-y-0" : "translate-y-full"
          } md:block hidden`}
        >
          <button
            className="w-full py-2 bg-white text-neutral-900 hover:bg-accent hover:text-neutral-800 font-medium rounded transition-colors"
            onClick={handleQuickAdd}
          >
            Add to Cart
          </button>
        </div>

        {/* Sale or New Badge */}
        {(isSale || isNew) && (
          <div className="absolute top-2 left-2">
            {isSale && (
              <span className="bg-accent text-neutral-900 text-xs font-bold px-2 py-1 rounded-sm">
                SALE
              </span>
            )}
            {isNew && !isSale && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-sm">
                NEW
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h3 className="text-neutral-800 font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center">
          <span className="font-bold text-primary">
            ${displayPrice}
          </span>
          
          {displayOriginalPrice && (
            <span className="ml-2 text-neutral-500 text-sm line-through">
              ${displayOriginalPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}