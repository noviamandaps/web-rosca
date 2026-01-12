'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-center mb-8 md:mb-12">
          CONTACT US
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div>
            <h2 className="text-lg font-bold tracking-widest uppercase mb-6">
              GET IN TOUCH
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Subject"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">
                  Message <span className="text-ui-error">*</span>
                </label>
                <textarea
                  name="message"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full border border-brand-border px-4 py-3 text-sm text-brand-dark placeholder:text-brand-gray focus:border-brand-black focus:outline-none transition-colors resize-none"
                />
              </div>
              <Button type="submit" fullWidth size="lg">
                SEND MESSAGE
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-bold tracking-widest uppercase mb-6">
              CONTACT INFO
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Address</h3>
                <p className="text-sm text-brand-gray">
                  Jl. Sudirman No. 123<br />
                  Jakarta Pusat, 10220<br />
                  Indonesia
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Phone</h3>
                <a href="tel:+6281234567890" className="text-sm text-brand-gray hover:text-brand-black">
                  +62 812 3456 7890
                </a>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Email</h3>
                <a href="mailto:hello@rosca.id" className="text-sm text-brand-gray hover:text-brand-black">
                  hello@rosca.id
                </a>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Business Hours</h3>
                <p className="text-sm text-brand-gray">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-gray hover:text-brand-black">
                    Instagram
                  </a>
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-gray hover:text-brand-black">
                    TikTok
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-gray hover:text-brand-black">
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
