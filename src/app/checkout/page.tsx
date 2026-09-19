'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '@/components/ui';
import { getAddresses, getCart } from '@/services/user/cart';
import { useCreateOrderFromCart } from '@/services/user/orders';
import { useCreatePayment, getPaymentFees, type PaymentMethod } from '@/services/user/payments';
import { useCheckoutShipping } from '@/services/user/shipping';

function token() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

const nf = new Intl.NumberFormat('id-ID');

export default function CheckoutPage() {
  const router = useRouter();
  const hasToken = !!token();
  const { data: cart } = useQuery({ queryKey: ['cart'], queryFn: getCart, enabled: hasToken });
  const { data: addressesRes } = useQuery({ queryKey: ['addresses'], queryFn: getAddresses, enabled: hasToken });
  const createOrder = useCreateOrderFromCart();
  const createPayment = useCreatePayment();

  const items = cart?.items ?? [];
  const subtotal = Number(cart?.subtotal ?? 0);
  const addresses = addressesRes?.addresses ?? [];

  const [addressId, setAddressId] = useState('');
  const [courier, setCourier] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VIRTUAL_ACCOUNT');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  // ongkir dinamis: /shipping/checkout-shipping per address + cart items
  const shippingParams = useMemo(
    () => (addressId && items.length ? { addressId, cartItemIds: items.map((i) => i.id), itemValue: subtotal } : null),
    [addressId, items, subtotal]
  );
  const { data: shipping } = useCheckoutShipping(shippingParams);
  const services = (shipping?.results ?? []).flatMap((r) =>
    r.services.map((s) => ({ ...s, courier: r.courier, courierName: r.courierName }))
  );
  const selected = services.find((s) => `${s.courier}|${s.code}` === courier);
  const shippingCost = selected?.cost ?? 0;
  const total = subtotal + shippingCost;

  const { data: fees } = useQuery({
    queryKey: ['payments', 'fees', total],
    queryFn: () => getPaymentFees(total),
    enabled: hasToken && total > 0,
  });

  async function place(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!addressId) return setError('Select an address');
    if (!selected) return setError('Select a shipping option');
    setPlacing(true);
    try {
      const order = await createOrder.mutateAsync({
        addressId,
        cartItemIds: items.map((i) => i.id),
        courierCode: selected.courier,
        courierService: selected.code,
        shippingCost: shippingCost,
        notes: notes || undefined,
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'TRANSFER',
      });
      const orderId = (order as { id?: string }).id;
      let query = `orderId=${orderId}`;
      if (paymentMethod !== 'COD' && orderId) {
        const pay = await createPayment.mutateAsync({
          orderId,
          paymentMethod: paymentMethod,
          bankCode: paymentMethod === 'VIRTUAL_ACCOUNT' ? 'BCA' : undefined,
          channelCode: paymentMethod === 'EWALLET' ? 'GOPAY' : undefined,
        });
        const pid = pay.id ?? pay.paymentId ?? '';
        query = `paymentId=${pid}&orderId=${orderId}&amount=${Number(pay.amount ?? total)}`;
      }
      router.push(`/waiting-for-payment?${query}`);
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
                    checked={addressId === a.id}
                    onChange={() => setAddressId(a.id!)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium">{a.recipientName}</span>
                    <span className="block text-xs text-brand-gray">
                      {a.fullAddress}, {a.district}, {a.city}, {a.province} {a.postalCode}
                    </span>
                  </span>
                </label>
              ))}
              {addresses.length === 0 && (
                <p className="text-xs text-brand-gray">
                  Belum ada alamat — <Link href="/profile/addresses" className="underline">tambah alamat</Link> dulu.
                </p>
              )}
            </div>
          </section>

          <section className="border border-brand-border p-6">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
              Shipping Method
            </h2>
            {shippingParams ? (
              <CourierOptions list={services} courier={courier} onChange={setCourier} />
            ) : (
              <p className="text-xs text-brand-gray">Pilih alamat untuk melihat ongkir.</p>
            )}
          </section>

          <section className="border border-brand-border p-6">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
              Payment Method
            </h2>
            <div className="space-y-3">
              {[
                { v: 'VIRTUAL_ACCOUNT', l: 'Virtual Account (VA)' },
                { v: 'QRIS', l: 'QRIS' },
                { v: 'EWALLET', l: 'E-Wallet (GoPay)' },
                { v: 'COD', l: 'COD' },
              ].map((m) => (
                <label key={m.v} className="flex items-center justify-between gap-3 p-4 border border-brand-border cursor-pointer hover:border-brand-black transition-colors text-sm">
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === m.v}
                      onChange={() => setPaymentMethod(m.v)}
                    />
                    {m.l}
                  </span>
                  {fees && (
                    <span className="text-xs text-brand-gray">
                      + Rp {nf.format(Number(fees.options.find((o) => o.paymentMethod === m.v)?.fee ?? 0))}
                    </span>
                  )}
                </label>
              ))}
            </div>
            <p className="text-2xs text-brand-gray mt-3">
              Fee per metode via `GET /payments/fees` — VA/QRIS/EWallet/COD tersedia sesuai staging.
            </p>
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
                    {i.product?.name ?? '-'} × {i.quantity}
                  </span>
                  <span>Rp {Number(i.lineTotal ?? i.unitPrice ?? 0).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-brand-border">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{selected ? `Rp ${shippingCost.toLocaleString('id-ID')}` : '—'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-brand-border mt-2">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
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

function CourierOptions({
  list,
  courier,
  onChange,
}: {
  list: { courier: string; courierName: string; code: string; name: string; service: string; description?: string; cost: number; etd?: string }[];
  courier: string;
  onChange: (v: string) => void;
}) {
  if (!list.length) return <p className="text-xs text-brand-gray">Tidak ada opsi pengiriman.</p>;
  return (
    <div className="space-y-3">
      {list.map((s) => (
        <label
          key={`${s.courier}-${s.code}`}
          className="flex items-center justify-between gap-3 p-4 border border-brand-border cursor-pointer hover:border-brand-black transition-colors text-sm"
        >
          <span className="flex items-center gap-3">
            <input
              type="radio"
              name="courier"
              value={`${s.courier}|${s.code}`}
              checked={courier === `${s.courier}|${s.code}`}
              onChange={() => onChange(`${s.courier}|${s.code}`)}
            />
            <span>
              <span className="font-medium">{s.courierName} {s.service}</span>
              <span className="block text-xs text-brand-gray">{s.description ?? s.etd}</span>
            </span>
          </span>
          <span className="text-sm font-medium">Rp {s.cost.toLocaleString('id-ID')}</span>
        </label>
      ))}
    </div>
  );
}
