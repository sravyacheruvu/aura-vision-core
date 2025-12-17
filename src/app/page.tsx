import React from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

export default function LandingPage() {
    return (
        <div className={`min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 ${inter.className}`}>

            {/* Navbar */}
            <nav className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg"></div>
                        <h1 className={`${playfair.className} text-xl font-medium tracking-tight`}>Aura Vision</h1>
                    </div>
                    <div className="flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#features" className="hover:text-white transition">Features</a>
                        <a href="#pricing" className="hover:text-white transition">Pricing</a>
                        <Link href="/design" className="bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition">
                            Launch App
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-40 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -z-10"></div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-medium text-gray-300">V2.0 Now Available</span>
                    </div>
                    <h1 className={`${playfair.className} text-6xl md:text-7xl font-medium leading-tight mb-8`}>
                        Reimagine your space <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">in seconds.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Transform any room with AI-powered interior design.
                        Visualize new styles, furniture, and layouts instantly with photo-realistic precision.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/design" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium text-lg transition shadow-lg shadow-indigo-500/25">
                            Start Designing Free
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-lg transition">
                            View Gallery
                        </button>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="py-24 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Real-Time Rendering", desc: "See changes instantly with our high-speed SDXL Lightning engine." },
                            { title: "Smart Shopping", desc: "Our AI identifies furniture and finds the best prices on Google & Amazon." },
                            { title: "Style Matching", desc: "Upload a photo and let our engine match the exact aesthetic you want." }
                        ].map((f, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-black border border-white/10 hover:border-indigo-500/50 transition group">
                                <h3 className="text-xl font-medium mb-3 group-hover:text-indigo-400 transition">{f.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className={`${playfair.className} text-4xl font-medium mb-4`}>Simple, Transparent Pricing</h2>
                        <p className="text-gray-400">Start for free, upgrade for power.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Tier */}
                        <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-gray-300 mb-2">Starter</h3>
                                <div className="text-4xl font-medium">$0 <span className="text-lg text-gray-500">/mo</span></div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1 text-gray-400">
                                <li className="flex items-center gap-3"><span className="text-indigo-500">✓</span> 5 Designs per day</li>
                                <li className="flex items-center gap-3"><span className="text-indigo-500">✓</span> Standard Speed</li>
                                <li className="flex items-center gap-3"><span className="text-indigo-500">✓</span> Basic Styles</li>
                            </ul>
                            <Link href="/design" className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 transition font-medium text-center">
                                Try Now
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="p-8 rounded-3xl border border-indigo-500/50 bg-indigo-500/[0.05] flex flex-col relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</div>
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-indigo-300 mb-2">Pro</h3>
                                <div className="text-4xl font-medium">$10 <span className="text-lg text-gray-500">/mo</span></div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1 text-gray-300">
                                <li className="flex items-center gap-3"><span className="text-indigo-400">✓</span> Unlimited Designs</li>
                                <li className="flex items-center gap-3"><span className="text-indigo-400">✓</span> Fast "Lightning" Mode</li>
                                <li className="flex items-center gap-3"><span className="text-indigo-400">✓</span> Custom "Type Anything" Prompts</li>
                                <li className="flex items-center gap-3"><span className="text-indigo-400">✓</span> Commercial License</li>
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-medium text-white shadow-lg shadow-indigo-500/20">
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
                <p>&copy; 2025 Aura Vision Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}