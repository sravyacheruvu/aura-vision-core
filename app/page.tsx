"use client";

import React from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

export default function LandingPage() {
    return (
        <div className={`min-h-screen bg-stone-50 text-gray-900 selection:bg-rose-200 ${inter.className}`}>

            {/* Navbar */}
            <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-rose-400 to-orange-300 rounded-full flex items-center justify-center text-white font-bold font-serif italic">A</div>
                        <h1 className={`${playfair.className} text-2xl font-semibold tracking-tight`}>Aura Vision</h1>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link href="#features" className="hover:text-rose-500 transition hidden sm:block">Features</Link>
                        <Link href="#testimonials" className="hover:text-rose-500 transition hidden sm:block"> transformations</Link>
                        <Link href="#pricing" className="hover:text-rose-500 transition">Pricing</Link>
                        <Link href="/design" className="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
                            Start Designing
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-24 pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-200/30 blur-[120px] rounded-full -z-10 mix-blend-multiply"></div>
                <div className="absolute top-20 left-0 w-[600px] h-[600px] bg-orange-200/30 blur-[100px] rounded-full -z-10 mix-blend-multiply"></div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">V2.0 Live</span>
                    </div>
                    <h1 className={`${playfair.className} text-6xl md:text-8xl font-medium leading-[1.1] mb-8 text-gray-900`}>
                        Design spaces that <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-400 to-rose-500 animate-gradient">feel alive.</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                        Upload a photo of your room and watch our AI reimagine it in seconds.
                        Professional interior design, accessible to everyone.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/design" className="w-full sm:w-auto px-10 py-5 bg-gray-900 hover:bg-black text-white rounded-2xl font-medium text-lg transition shadow-xl hover:shadow-2xl">
                            Redesign My Room Free
                        </Link>
                        <Link href="#testimonials" className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-gray-50 border border-stone-200 text-gray-900 rounded-2xl font-medium text-lg transition shadow-sm hover:shadow-md">
                            See Transformations
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white border-y border-stone-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className={`${playfair.className} text-4xl font-medium mb-4`}>Why Aura Vision?</h2>
                        <p className="text-gray-500">Professional interior design tools, simplified.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Instant Rendering", icon: "⚡️", desc: "No waiting hours. Get high-definition renders in under 10 seconds." },
                            { title: "Smart Shopping", icon: "🛍️", desc: "We identify furniture in your design and find the best prices instantly." },
                            { title: "Any Aesthetic", icon: "🎨", desc: "Type 'Barbie Dreamhouse' or '1920s Paris' - we handle the rest." }
                        ].map((f, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-rose-200 transition group hover:shadow-lg">
                                <div className="text-4xl mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition">{f.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS (Restored) */}
            <section id="testimonials" className="py-24 bg-stone-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className={`${playfair.className} text-4xl md:text-5xl font-medium mb-4`}>Real Homes, <br />Reimagined.</h2>
                            <p className="text-gray-500">Join 10,000+ happy homeowners.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                            <div className="h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">Boho Chic</div>
                            </div>
                            <p className="text-gray-600 mb-4 italic">"I had no idea what to do with my small apartment. Aura Vision gave me 5 options in 2 minutes. I bought the rug immediately."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold">S</div>
                                <div>
                                    <div className="font-bold text-sm">Sarah Jenkins</div>
                                    <div className="text-xs text-gray-400">San Francisco, CA</div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                            <div className="h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">Industrial</div>
                            </div>
                            <p className="text-gray-600 mb-4 italic">"The shopping links are a game changer. It didn't just show me a pretty picture, it showed me exactly where to buy the sofa."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">M</div>
                                <div>
                                    <div className="font-bold text-sm">Mike Ross</div>
                                    <div className="text-xs text-gray-400">Austin, TX</div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                            <div className="h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=500" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">Minimalist</div>
                            </div>
                            <p className="text-gray-600 mb-4 italic">"Ideally, I'd hire an interior designer, but that costs $5k. This cost me $0 and gave me better ideas."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">E</div>
                                <div>
                                    <div className="font-bold text-sm">Elena G.</div>
                                    <div className="text-xs text-gray-400">London, UK</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="py-32 bg-white border-t border-stone-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className={`${playfair.className} text-4xl font-medium mb-4`}>Simple, Transparent Pricing</h2>
                        <p className="text-gray-500">Start for free, upgrade for power.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Tier */}
                        <div className="p-8 rounded-3xl border border-stone-200 bg-stone-50 flex flex-col hover:shadow-xl transition duration-300">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-500 mb-2 uppercase tracking-wider">Starter</h3>
                                <div className="text-5xl font-bold text-gray-900">$0 <span className="text-lg text-gray-400 font-normal">/mo</span></div>
                                <p className="text-gray-500 mt-4">Perfect for trying out the magic.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1 text-gray-600">
                                <li className="flex items-center gap-3"><span className="text-green-500 text-xl">✓</span> 3 Designs per day</li>
                                <li className="flex items-center gap-3"><span className="text-green-500 text-xl">✓</span> Standard Speed</li>
                                <li className="flex items-center gap-3"><span className="text-green-500 text-xl">✓</span> Access to all Styles</li>
                                <li className="flex items-center gap-3 text-gray-400"><span className="text-gray-300 text-xl">×</span> No Commercial License</li>
                            </ul>
                            <Link href="/design" className="w-full py-4 rounded-2xl border-2 border-stone-200 hover:border-stone-900 text-gray-900 font-bold text-center transition">
                                Start Free
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="p-8 rounded-3xl border-2 border-rose-500 bg-white flex flex-col relative shadow-2xl scale-105 transform">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg">
                                Most Popular
                            </div>
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-rose-500 mb-2 uppercase tracking-wider">Pro Access</h3>
                                <div className="text-5xl font-bold text-gray-900">$19 <span className="text-lg text-gray-400 font-normal">/mo</span></div>
                                <p className="text-gray-500 mt-4">For real estate agents & designers.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1 text-gray-600">
                                <li className="flex items-center gap-3"><span className="text-rose-500 text-xl">✓</span> <strong>Unlimited</strong> Designs</li>
                                <li className="flex items-center gap-3"><span className="text-rose-500 text-xl">✓</span> 4K Ultra HD Downloads</li>
                                <li className="flex items-center gap-3"><span className="text-rose-500 text-xl">✓</span> Commercial Usage License</li>
                                <li className="flex items-center gap-3"><span className="text-rose-500 text-xl">✓</span> Priority "Lightning" Server</li>
                                <li className="flex items-center gap-3"><span className="text-rose-500 text-xl">✓</span> 24/7 Priority Support</li>
                            </ul>
                            <button className="w-full py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-center transition shadow-lg hover:shadow-xl">
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-stone-200 text-center text-gray-500 text-sm bg-white">
                <p>&copy; 2025 Aura Vision Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}