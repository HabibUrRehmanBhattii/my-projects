"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart, CartItem } from './CartContext';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    cartTotal, 
    closeCart, 
    removeFromCart, 
    updateQuantity 
  } = useCart();

  // Disable body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button 
            className="text-neutral-500 hover:text-neutral-900 transition-colors" 
            onClick={closeCart}
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow py-16 px-4">
            <svg className="w-16 h-16 text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Your cart is empty</h3>
            <p className="text-neutral-500 text-center mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link 
              href="/categories" 
              className="btn-primary"
              onClick={closeCart}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-4">
              <ul className="space-y-4">
                {cart.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </ul>
            </div>
            
            {/* Cart Summary */}
            <div className="border-t border-neutral-200 p-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Subtotal</span>
                <span>${(cartTotal / 100).toFixed(2)}</span>
              </div>
              <p className="text-neutral-500 text-sm">Shipping and taxes calculated at checkout</p>
              <div className="flex flex-col space-y-2">
                <Link 
                  href="/checkout" 
                  className="btn-primary py-3 text-center"
                  onClick={closeCart}
                >
                  Checkout
                </Link>
                <button 
                  className="btn-outline py-3"
                  onClick={closeCart}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Cart Item Component
function CartItem({ 
  item, 
  onRemove, 
  onUpdateQuantity 
}: { 
  item: CartItem; 
  onRemove: (id: string) => void; 
  onUpdateQuantity: (id: string, quantity: number) => void; 
}) {
  const price = item.variant.prices[0]?.amount || 0;
  const formattedPrice = (price / 100).toFixed(2);
  const totalPrice = ((price * item.quantity) / 100).toFixed(2);
  
  return (
    <li className="flex gap-4 py-4 border-b border-neutral-100">
      {/* Product Image */}
      <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
        <Image 
          src={item.product.thumbnail || '/placeholder-product.jpg'} 
          alt={item.product.title} 
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-grow">
        <div className="flex justify-between">
          <Link 
            href={`/products/${item.product.handle}`} 
            className="text-neutral-900 font-medium hover:text-primary transition-colors line-clamp-1"
          >
            {item.product.title}
          </Link>
          <button 
            className="text-neutral-400 hover:text-red-500 transition-colors"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.product.title} from cart`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        {/* Variant Options */}
        {item.variant.options?.length > 0 && (
          <div className="text-xs text-neutral-500 mt-1">
            {item.variant.options.map((option, index) => (
              <span key={option.option_id}>
                {option.value}
                {index < item.variant.options.length - 1 ? ' / ' : ''}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-neutral-300 rounded">
            <button 
              className="px-2 py-1 text-neutral-600 hover:text-primary transition-colors"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="px-2 py-1 text-neutral-800 min-w-[1.5rem] text-center">
              {item.quantity}
            </span>
            <button 
              className="px-2 py-1 text-neutral-600 hover:text-primary transition-colors"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          {/* Prices */}
          <div className="text-right">
            <span className="font-medium">${totalPrice}</span>
            {item.quantity > 1 && (
              <div className="text-xs text-neutral-500">
                ${formattedPrice} each
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}