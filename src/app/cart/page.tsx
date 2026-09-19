'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { formatPrice } from '@/lib/data';
import { getCart, useRemoveCartItem, useUpdateCartItem } from '@/services/user/cart';

function localStorageToken() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

export default function CartPage() {
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
  const { data: cart, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: hasToken,
  });
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();

  const items = cart?.items ?? cart?.cartItems ?? [];
  const subtotal =
    cart?.summary?.subtotal ?? items.reduce((a, i) => a + (i.subtotal ?? (i.unitPrice ?? i.price ?? 0) * i.quantity), 0);

  if (!localStorageToken())
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-4">YOUR CART</h1>
          <p className="text-brand-gray mb-8">Please login to view your cart.</p>
          <Button href="/login">LOGIN</Button>
        </div>
      </div>
    );

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-8 md:mb-12">YOUR CART</h1>
        {isLoading && <p className="text-xs text-brand-gray">Loading cart…</p>}
        {error && (
          <p className="text-sm text-ui-error mb-4">
            {error instanceof Error ? error.message : 'Failed to load cart'}
          </p>
        )}

        {items.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-brand-gray mb-8">Your cart is empty.</p>
            <Button href="/catalog">CONTINUE SHOPPING</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="border border-brand-border">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-4 md:p-6 ${index < items.length - 1 ? 'border-b border-brand-border' : ''}`}
                  >
                    <Link href={`/catalog/${item.slug ?? ''}`} className="shrink-0">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 bg-brand-light border border-brand-border">
                        {(item.image ?? item.imageUrl) && (
                          <Image
                            src={(item.image ?? item.imageUrl) as string}
                            alt={item.productName ?? ''}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/catalog/${item.slug ?? ''}`}>
                        <h3 className="text-sm font-medium tracking-wider uppercase hover:underline">
                          {item.productName ?? '-'}
                        </h3>
                      </Link>
                      <p className="text-xs text-brand-gray mt-1">{item.variantLabel ?? ''}</p>
                      <p className="text-sm font-medium mt-2">{formatPrice(item.unitPrice ?? item.price ?? 0)}</p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-brand-border">
                          <button
                            onClick={() =>
                              update.mutate({ cartItemId: item.id, quantity: Math.max(1, item.quantity - 1) })
                            }
                            className="px-3 py-1 text-sm hover:bg-brand-light"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-xs border-x border-brand-border">{item.quantity}</span>
                          <button
                            onClick={() => update.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })}
                            className="px-3 py-1 text-sm hover:bg-brand-light"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => remove.mutate(item.id)}
                          className="text-xs text-brand-gray hover:text-brand-black underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end justify-between">
                      <span className="text-sm font-medium">
                        {formatPrice(item.subtotal ?? (item.unitPrice ?? 0) * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-widest mt-6 hover:underline"
              >
                <span>&larr;</span> CONTINUE SHOPPING
              </Link>
            </div>

            <div className="lg:col-span-1">
              <div className="border border-brand-black p-6 md:p-8 sticky top-24">
                <h2 className="text-lg font-bold tracking-widest uppercase mb-6">ORDER SUMMARY</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-gray">Subtotal ({items.length} items)</span>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
