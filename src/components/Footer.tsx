import Link from 'next/link';
import { Phone, Mail, Twitter, Instagram, Facebook } from 'lucide-react';
import RomelyyLogo from './RomelyyLogo';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 text-3xl font-bold font-headline text-white mb-4">
              <RomelyyLogo className="h-10 w-10 text-primary" />
              <span className="mt-1">ROMELYY</span>
            </Link>
            <p className="text-sm">Your journey, our passion. Crafting unforgettable travel experiences since 2024.</p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors">Packages</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>contact@romelyy.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="hover:text-primary transition-colors">+1 (234) 567-890</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex items-center gap-5">
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-primary transition-colors"><Twitter /></a>
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-primary transition-colors"><Facebook /></a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-primary transition-colors"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ROMELYY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
