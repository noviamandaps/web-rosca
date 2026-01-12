'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { products, formatPrice, type Product } from '@/lib/data';

// Temporary cart state (will be replaced with proper state management)
interface CartItem extends Product {
  quantity: number;
}

// Demo cart items
const initialCartItems: CartItem[] = [
  { ...products[0], quantity: 1 },
  { ...products[1], quantity: 2 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-4">
            YOUR CART
          </h1>
          <p className="text-brand-gray mb-8">Your cart is empty.</p>
          <Button href="/catalog">CONTINUE SHOPPING</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-8 md:mb-12">
          YOUR CART ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border border-brand-border">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-4 md:p-6 ${
                    index < cartItems.length - 1 ? 'border-b border-brand-border' : ''
                  }`}
                >
                  {/* Image */}
                  <Link href={`/catalog/${item.slug}`} className="shrink-0">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 bg-brand-light border border-brand-border">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/catalog/${item.slug}`}>
                      <h3 className="text-sm font-medium tracking-wider uppercase hover:underline">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-brand-gray mt-1">{item.category}</p>
                    <p className="text-sm font-medium mt-2">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity & Remove - Mobile */}
                    <div className="flex items-center justify-between mt-4 md:hidden">
                      <div className="flex items-center border border-brand-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-sm hover:bg-brand-light"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-xs border-x border-brand-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-sm hover:bg-brand-light"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-brand-gray hover:text-brand-black underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity - Desktop */}
                  <div className="hidden md:flex items-center border border-brand-border h-fit">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 text-sm hover:bg-brand-light"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-xs border-x border-brand-border">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-sm hover:bg-brand-light"
                    >
                      +
                    </button>
                  </div>

                  {/* Price & Remove - Desktop */}
                  <div className="hidden md:flex flex-col items-end justify-between">
                    <span className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-brand-gray hover:text-brand-black underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-xs font-medium tracking-widest mt-6 hover:underline"
            >
              <span>&larr;</span>
              CONTINUE SHOPPING
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-brand-black p-6 md:p-8 sticky top-24">
              <h2 className="text-lg font-bold tracking-widest uppercase mb-6">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-gray">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-gray">Shipping</span>
                  <span className="text-xs text-brand-gray">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-brand-border my-6 pt-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <Button fullWidth size="lg" href="/checkout">
                CHECKOUT
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-brand-border">
                <div className="flex flex-col gap-2 text-xs text-brand-gray text-center">
                  <span>✓ Secure Checkout</span>
                  <span>✓ Free Returns within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
