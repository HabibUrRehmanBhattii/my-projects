"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplyingCoupon(true);
    
    // Simulate coupon validation - in production, this would call the backend
    setTimeout(() => {
      alert(couponCode === 'DESI20' ? 'Coupon applied successfully!' : 'Invalid coupon code');
      setIsApplyingCoupon(false);
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-neutral-100 rounded-full h-28 w-28 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-neutral-600 mb-8">Looks like you haven't added any South Asian fashion items to your cart yet.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/categories/women" className="btn-outline">
              Shop Women's Collection
            </Link>
            <Link href="/categories/men" className="btn-primary">
              Shop Men's Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          {/* Cart Header - Desktop */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-neutral-200 text-sm font-medium text-neutral-500">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          {/* Cart Items */}
          <div className="space-y-6 mt-6">
            {cart.map((item) => {
              const itemPrice = (item.variant.prices[0]?.amount || 0) / 100;
              const totalPrice = itemPrice * item.quantity;
              
              return (
                <div key={item.id} className="grid grid-cols-12 gap-4 py-6 border-b border-neutral-100">
                  {/* Product Image and Info */}
                  <div className="col-span-12 md:col-span-6 flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.product.thumbnail || '/placeholder-product.jpg'} 
                        alt={item.product.title}
                        fill
                        sizes="(max-width: 768px) 96px, 96px"
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <Link 
                          href={`/products/${item.product.handle}`}
                          className="text-neutral-800 font-medium hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.product.title}
                        </Link>
                        
                        {/* Variant Options */}
                        {item.variant.options?.length > 0 && (
                          <div className="text-sm text-neutral-500 mt-1">
                            {item.variant.options.map((option, index) => (
                              <span key={option.option_id}>
                                {option.value}
                                {index < item.variant.options.length - 1 ? ' / ' : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Mobile Price */}
                      <div className="md:hidden mt-2">
                        <span className="text-sm font-medium">${itemPrice.toFixed(2)}</span>
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        className="text-neutral-500 hover:text-red-500 text-sm mt-2 md:mt-0 flex items-center transition-colors"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price - Desktop */}
                  <div className="hidden md:flex col-span-2 items-center justify-center">
                    <span className="font-medium">${itemPrice.toFixed(2)}</span>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="col-span-6 md:col-span-2 flex items-center md:justify-center">
                    <div className="flex items-center border border-neutral-300 rounded">
                      <button 
                        className="px-3 py-1 text-neutral-600 hover:text-primary"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-neutral-800 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        className="px-3 py-1 text-neutral-600 hover:text-primary"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Total Price */}
                  <div className="col-span-6 md:col-span-2 flex items-center justify-end">
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <Link href="/" className="text-primary font-medium hover:text-primary-dark transition-colors flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
            
            <button 
              className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors flex items-center"
              onClick={() => {
                if (confirm("Are you sure you want to clear your cart?")) {
                  const { clearCart } = useCart();
                  clearCart();
                }
              }}
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            {/* Coupon Code */}
            <form onSubmit={handleApplyCoupon} className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Apply Discount Code
              </label>
              <div className="flex">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow px-4 py-2 border border-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="Enter code"
                />
                <button 
                  type="submit" 
                  className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                  disabled={!couponCode || isApplyingCoupon}
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Try code "DESI20" for 20% off</p>
            </form>
            
            {/* Price Breakdown */}
            <div className="space-y-3 border-b border-neutral-200 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">${(cartTotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Tax</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-xl font-bold text-primary">${(cartTotal / 100).toFixed(2)}</span>
            </div>
            
            {/* Checkout Button */}
            <Link 
              href="/checkout" 
              className="btn-primary w-full py-3 text-center"
            >
              Proceed to Checkout
            </Link>
            
            {/* Security and Payment Info */}
            <div className="mt-6">
              <div className="flex items-center justify-center mb-4 space-x-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm text-neutral-600">
                  Secure Checkout
                </span>
              </div>
              <div className="flex justify-center space-x-2">
                <div className="bg-white p-1 rounded border border-neutral-200">
                  <img src="/visa.svg" alt="Visa" className="h-6" />
                </div>
                <div className="bg-white p-1 rounded border border-neutral-200">
                  <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                </div>
                <div className="bg-white p-1 rounded border border-neutral-200">
                  <img src="/paypal.svg" alt="PayPal" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}