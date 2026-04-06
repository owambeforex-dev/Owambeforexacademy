import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

export default function Footer() {
  return (
    <footer id="contact" className="hidden md:block bg-bg-primary border-t border-border-base pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center font-serif font-bold text-bg-primary text-xl">
                O
              </div>
              <span className="font-serif font-bold text-xl text-text-primary">
                Owambe <span className="text-brand-primary">Forex</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Empowering traders globally with institutional-grade education, premium signals, and professional account management services.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-bg-secondary border border-border-base flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary/50 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-secondary border border-border-base flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary/50 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-secondary border border-border-base flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary/50 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-secondary border border-border-base flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary/50 transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-text-primary">Our Services</h4>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">Forex Mentorship</Link></li>
              <li><Link to="/services" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">Premium Signals</Link></li>
              <li><Link to="/services" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">Prop Firm Passing</Link></li>
              <li><Link to="/services" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">Account Management</Link></li>
              <li><Link to="/services" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">Investment Program</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-text-primary">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">About Us</Link></li>
              <li><Link to="/trade" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">Demo Trading</Link></li>
              <li><Link to="/support" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">Support Center</Link></li>
              <li><Link to="/faq" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-text-secondary hover:text-brand-primary text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-text-primary">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-primary shrink-0 mt-0.5" />
                <span className="text-text-secondary text-sm">16 Adetokunbo Ademola Cres, Obum plaza, Wuse 904101, Abuja, FCT.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-primary shrink-0" />
                <span className="text-text-secondary text-sm">+234 906 5244 842</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-primary shrink-0" />
                <span className="text-text-secondary text-sm">owambeforexacademy@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border-base pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Owambe Forex Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <LanguageSelector position="top" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              <span className="text-text-muted text-sm">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
