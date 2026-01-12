import Link from 'next/link';

const footerLinks = {
  'CUSTOMER SERVICE': [
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'FAQ', href: '/faq' },
  ],
  'INFORMATION': [
    { label: 'About Us', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
  'SOCIAL MEDIA': [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'TikTok', href: 'https://tiktok.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
  'CONTACT': [
    { label: 'hello@rosca.id', href: 'mailto:hello@rosca.id' },
    { label: '+62 812 3456 7890', href: 'tel:+6281234567890' },
    { label: 'Jakarta, Indonesia', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-brand-black">
      {/* Main Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-brand-black">
        {Object.entries(footerLinks).map(([title, links], index) => (
          <div
            key={title}
            className={`p-6 md:p-8 ${index < 3 ? 'border-r border-brand-black' : ''} ${index < 2 ? 'border-b md:border-b-0 border-brand-black' : ''}`}
          >
            <h3 className="text-xs font-bold tracking-widest mb-4">{title}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-brand-gray hover:text-brand-black transition-colors"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Footer */}
      <div className="px-6 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-2xs text-brand-gray">
        <p>&copy; {new Date().getFullYear()} ROSCA. All rights reserved.</p>
        <p>Built with care in Indonesia</p>
      </div>
    </footer>
  );
}
