import { Button } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wider mb-12">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <section className="border border-brand-border p-6">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
                Shipping Information
              </h2>
              <div className="space-y-4">
                <Input label="Full Name" placeholder="Enter your full name" required name="fullName" />
                <Input label="Phone" placeholder="Enter your phone number" required name="phone" />
                <div className="space-y-1">
                  <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">
                    Address <span className="text-ui-error ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    required
                    className="w-full border border-brand-border px-4 py-3 text-sm text-brand-dark placeholder:text-brand-gray focus:border-brand-black focus:outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" placeholder="City" required name="city" />
                  <Input label="Province" placeholder="Province" required name="province" />
                </div>
                <Input label="Postal Code" placeholder="Postal Code" required name="postalCode" />
              </div>
            </section>

            {/* Shipping Method */}
            <section className="border border-brand-border p-6">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
                Shipping Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-brand-border cursor-pointer hover:border-brand-black transition-colors">
                  <input type="radio" name="shipping" value="regular" defaultChecked className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Regular Shipping</p>
                    <p className="text-xs text-brand-gray">3-5 business days</p>
                  </div>
                  <span className="text-sm font-medium">Rp 20.000</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-brand-border cursor-pointer hover:border-brand-black transition-colors">
                  <input type="radio" name="shipping" value="express" className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Express Shipping</p>
                    <p className="text-xs text-brand-gray">1-2 business days</p>
                  </div>
                  <span className="text-sm font-medium">Rp 40.000</span>
                </label>
              </div>
            </section>

            {/* Payment Method */}
            <section className="border border-brand-border p-6">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-brand-border cursor-pointer hover:border-brand-black transition-colors">
                  <input type="radio" name="payment" value="bank" defaultChecked className="w-4 h-4" />
                  <span className="font-medium text-sm">Bank Transfer</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-brand-border cursor-pointer hover:border-brand-black transition-colors">
                  <input type="radio" name="payment" value="ewallet" className="w-4 h-4" />
                  <span className="font-medium text-sm">E-Wallet (GoPay, OVO, Dana)</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-brand-border cursor-pointer hover:border-brand-black transition-colors">
                  <input type="radio" name="payment" value="card" className="w-4 h-4" />
                  <span className="font-medium text-sm">Credit Card</span>
                </label>
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-brand-border p-6 sticky top-6">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Sunshine Perfume x 1</span>
                  <span>Rp 450.000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Velvet Cream x 2</span>
                  <span>Rp 700.000</span>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-brand-border">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>Rp 1.150.000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Rp 20.000</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-brand-border mt-2">
                  <span>Total</span>
                  <span>Rp 1.170.000</span>
                </div>
              </div>

              <Button fullWidth className="mt-6">
                Place Order
              </Button>

              <Link
                href="/cart"
                className="block text-center text-sm text-brand-gray hover:text-brand-black underline underline-offset-4 mt-4"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
