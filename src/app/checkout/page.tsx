'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '@/components/ui';
import { getAddresses, getCart } from '@/services/user/cart';
import { useCreateOrderFromCart } from '@/services/user/orders';
import { useCreatePayment } from '@/services/user/payments';

function token() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const hasToken = !!token();
  const { data: cart } = useQuery({ queryKey: ['cart'], queryFn: getCart, enabled: hasToken });
  const { data: addressesRes } = useQuery({ queryKey: ['addresses'], queryFn: getAddresses, enabled: hasToken });
  const createOrder = useCreateOrderFromCart();
  const createPayment = useCreatePayment();

  const [addressId, setAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'TRANSFER' | 'COD'>('TRANSFER');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const items = cart?.items ?? cart?.cartItems ?? [];
  const subtotal =
    cart?.summary?.subtotal ?? items.reduce((a, i) => a + (i.subtotal ?? (i.unitPrice ?? 0) * i.quantity), 0);
  const addresses = Array.isArray(addressesRes) ? addressesRes : (addressesRes?.data ?? []);

  async function place(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!addressId) {
      setError('Select an address');
      return;
    }
    setPlacing(true);
    try {
      const order = await createOrder.mutateAsync({
        addressId,
        cartItemIds: items.map((i) => i.id),
        notes: notes || undefined,
        paymentMethod,
      });
      const orderId = (order as { id?: string }).id;
      if (paymentMethod === 'TRANSFER' && orderId) {
        await createPayment.mutateAsync({ orderId, paymentMethod: 'VIRTUAL_ACCOUNT' });
      }
      router.push('/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setPlacing(false);
    }
  }

  if (!token())
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-4">Checkout</h1>
        <p className="text-brand-gray mb-8">Please login to checkout.</p>
        <Button href="/login">LOGIN</Button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wider mb-12">Checkout</h1>
      <form onSubmit={place} className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="border border-brand-border p-6">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
              Shipping Address
            </h2>
            <div className="space-y-3">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className="flex items-start gap-3 p-4 border border-brand-border cursor-pointer hover:border-brand-black transition-colors text-sm"
                >
                  <input
                    type="radio"
                    name="address"
                    value={a.id}
                    checked={addressId === a.id}
                    onChange={() => a.id && setAddressId(a.id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium">{a.recipientName}</span>
                    <span className="block text-xs text-brand-gray">{a.fullAddress}</span>
                  </span>
                </label>
              ))}
              {addresses.length === 0 && (
                <p className="text-xs text-brand-gray">
                  No saved address yet — add one in your profile.
                </p>
              )}
            </div>
          </section>

          <section className="border border-brand-border p-6">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-brand-border cursor-pointer hover:border-brand-black transition-colors text-sm">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'TRANSFER'}
                  onChange={() => setPaymentMethod('TRANSFER')}
                />
                <span>Virtual Account (Transfer)</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-brand-border cursor-pointer hover:border-brand-black transition-colors text-sm">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <span>COD</span>
              </label>
            </div>
          </section>

          <section className="border border-brand-border p-6">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">Notes</h2>
            <Input label="Order notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-brand-border p-6 sticky top-6">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-brand-gray">
                    {i.productName ?? '-'} × {i.quantity}
                  </span>
                  <span>Rp {(i.subtotal ?? (i.unitPrice ?? 0) * i.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-brand-border">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
            {error && <p className="text-2xs text-ui-error mt-3">{error}</p>}
            <Button fullWidth className="mt-6" type="submit">
              {placing ? 'Placing order…' : 'Place Order'}
            </Button>
            <Link
              href="/cart"
              className="block text-center text-sm text-brand-gray hover:text-brand-black underline underline-offset-4 mt-4"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
