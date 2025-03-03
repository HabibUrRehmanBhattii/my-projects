"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Medusa from "@medusajs/medusa-js";

// Types
export type CartItem = {
  id: string;
  variant_id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    handle: string;
    thumbnail: string;
  };
  variant: {
    id: string;
    title: string;
    prices: { amount: number; currency_code: string }[];
    options: { value: string; option_id: string }[];
  };
};

type CartContextType = {
  cart: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize Medusa client 
  const medusa = new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
    publishableApiKey: process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY!,
    maxRetries: 3
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('desiEleganceCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('desiEleganceCart', JSON.stringify(cart));
  }, [cart]);

  // Calculate cart count and total
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => {
      const price = item.variant.prices[0]?.amount || 0;
      return total + price * item.quantity;
    },
    0
  );

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.variant_id === item.variant_id
      );

      if (existingItemIndex > -1) {
        // If item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        // If item doesn't exist, add it with a unique ID
        return [...prevCart, { ...item, id: `cart_item_${Date.now()}` }];
      }
    });

    // Open cart drawer when adding items
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Toggle cart open/closed
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Close cart
  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Context value
  const value = {
    cart,
    isCartOpen,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};