'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/services/user/cart';
import { useDeleteNotification, useMarkNotificationRead, useNotifications, useReadAllNotifications, useUnreadCount } from '@/services/user/notifications';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/catalog', label: 'CATALOG' },
  { href: '/contact', label: 'CONTACT' },
  // { href: '/affiliate', label: 'AFFILIATE' },
  // { href: '/admin', label: 'ADMIN' },
];

function token() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => setHasToken(!!token()), []);

  const { data: cartData } = useCart();
  const cartCount = cartData?.totalItems ?? 0;
  const { data: unread } = useUnreadCount();
  const { data: notifs } = useNotifications();
  const markRead = useMarkNotificationRead();
  const readAll = useReadAllNotifications();
  const delNotif = useDeleteNotification();

  const count = unread?.count ?? notifs?.unreadCount ?? 0;

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

            {/* Notifications bell */}
            {hasToken && (
              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setBellOpen(!bellOpen)}
                  className="relative text-sm hover:text-brand-gray transition-colors"
                >
                  ♪
                  {count > 0 && (
                    <span className="absolute -top-2 -right-3 w-5 h-5 bg-brand-black text-brand-white text-2xs flex items-center justify-center rounded-full">
                      {count}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 top-8 w-80 max-h-96 overflow-y-auto bg-brand-white border border-brand-border shadow-lg">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                      <span className="text-xs font-semibold uppercase tracking-wider">Notifications</span>
                      <button type="button" onClick={() => readAll.mutate()} className="text-2xs text-brand-gray hover:text-brand-black uppercase">
                        Read all
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {(notifs?.notifications ?? []).map((n) => (
                        <div key={n.id} className={`px-4 py-3 border-b border-brand-border last:border-b-0 text-sm ${n.isRead ? '' : 'bg-brand-gray'}`}>
                          <p className="font-medium text-xs">{n.title}</p>
                          <p className="text-2xs text-brand-gray mt-1">{n.message}</p>
                          <div className="flex gap-3 mt-1 text-2xs uppercase tracking-wider">
                            {!n.isRead && (
                              <button type="button" onClick={() => markRead.mutate(n.id)} className="text-brand-gray hover:text-brand-black">
                                Mark read
                              </button>
                            )}
                            <button type="button" onClick={() => delNotif.mutate(n.id)} className="text-brand-gray hover:text-ui-error">
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      {!notifs?.notifications.length && <p className="px-4 py-3 text-2xs text-brand-gray">No notifications</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile / Login */}
            {hasToken ? (
              <Link href="/profile" className="hidden md:block text-xs font-medium tracking-widest hover:text-brand-gray transition-colors">
                PROFILE
              </Link>
            ) : (
              <Link href="/login" className="hidden md:block text-xs font-medium tracking-widest hover:text-brand-gray transition-colors">
                LOGIN
              </Link>
            )}

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
