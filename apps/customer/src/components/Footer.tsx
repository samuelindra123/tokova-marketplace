import Link from 'next/link';
import { TokovaLogo } from './TokovaLogo';

const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_URL || 'http://localhost:3002';

export function Footer() {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <TokovaLogo className="w-8 h-8" />
                            <span className="text-xl font-bold">Tokova</span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Trusted marketplace for online shopping with quality products from selected sellers.
                        </p>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-4">About Tokova</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Seller */}
                    <div>
                        <h4 className="font-semibold mb-4">Sell on Tokova</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href={VENDOR_URL} className="hover:text-white transition-colors" target="_blank">Seller Center</a></li>
                            <li><Link href="/sell" className="hover:text-white transition-colors">Start Selling</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Tokova. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
