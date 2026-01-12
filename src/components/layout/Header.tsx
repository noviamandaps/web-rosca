'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/catalog', label: 'CATALOG' },
  { href: '/contact', label: 'CONTACT' },
  // { href: '/affiliate', label: 'AFFILIATE' },
  // { href: '/admin', label: 'ADMIN' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = 0; // Will be connected to state later

  return (
    <header className="sticky top-0 z-50 bg-brand-white border-b border-brand-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-4xl font-bold tracking-widest">
            ROSCA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-widest hover:text-brand-gray transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Cart */}
            <Link href="/cart" className="relative text-xs font-medium tracking-widest hover:text-brand-gray transition-colors">
              CART
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 w-5 h-5 bg-brand-black text-brand-white text-2xs flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login */}
            <Link href="/login" className="hidden md:block text-xs font-medium tracking-widest hover:text-brand-gray transition-colors">
              LOGIN
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 bg-brand-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 bg-brand-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-brand-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-brand-border">
            <nav className="py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium tracking-widest hover:text-brand-gray transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="text-sm font-medium tracking-widest hover:text-brand-gray transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                LOGIN
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
