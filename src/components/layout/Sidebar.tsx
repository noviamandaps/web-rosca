'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  icon?: string;
}

export interface SidebarConfig {
  title: string;
  logo: string;
  items: SidebarItem[];
  bottomItems?: SidebarItem[];
  userName?: string;
}

interface SidebarProps {
  config: SidebarConfig;
}

export function Sidebar({ config }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-brand-white border-r border-brand-border flex flex-col transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo/Header */}
      <div className="h-16 border-b border-brand-border flex items-center justify-between px-4">
        {!isCollapsed && (
          <Link href="/" className="text-xl font-bold uppercase tracking-wider">
            {config.logo}
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-brand-gray rounded transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="px-3 mb-4">
          {!isCollapsed && (
            <p className="text-2xs font-medium uppercase tracking-wider text-brand-gray px-3">
              Menu
            </p>
          )}
          <ul className="space-y-1 mt-2">
            {config.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                      isActive
                        ? 'bg-brand-black text-brand-white'
                        : 'text-brand-dark hover:bg-brand-gray'
                    }`}
                  >
                    {item.icon && <span className="text-sm">{item.icon}</span>}
                    {!isCollapsed && (
                      <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User Info & Bottom Items */}
      <div className="border-t border-brand-border p-3">
        {config.bottomItems && (
          <ul className="space-y-1 mb-4">
            {config.bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                      isActive
                        ? 'bg-brand-black text-brand-white'
                        : 'text-brand-dark hover:bg-brand-gray'
                    }`}
                  >
                    {item.icon && <span className="text-sm">{item.icon}</span>}
                    {!isCollapsed && (
                      <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {config.userName && !isCollapsed && (
          <div className="px-3 py-2 bg-brand-gray rounded">
            <p className="text-2xs text-brand-gray">Logged in as</p>
            <p className="text-xs font-medium truncate">{config.userName}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
