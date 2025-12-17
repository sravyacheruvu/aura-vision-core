"use client";
import React, { useState, useRef } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

interface Product {
    name: string;
    type: string;
    price: string;
    img: string;
    link: string;
}

const PRESET_STYLES = [
    { id: 'boho', label: 'Bohemian', desc: 'Warm, earthy, organic' },
    { id: 'industrial', label: 'Industrial', desc: 'Raw, edgy, metallic' },
    { id: 'elegant', label: 'Elegant', desc: 'Luxe, bright, gold' },
    { id: 'custom', label: 'Custom', desc: 'Create your own vibe' },
];

export default function DesignPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('boho');
    const [customStyleInput, setCustomStyleInput] = useState('');
    const [strength, setStrength] = useState(80);
    const [customPrompt, setCustomPrompt] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMsg(null);
        if (e.target.files?.[0]) {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", e.target.files[0]);
            try {
                const res = await fetch("http://127.0.0.1:8000/upload", { method: "POST", body: formData });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                setSelectedImage(data.url);
                setGeneratedImage(null);
                setProducts([]);
            } catch (err: any) { setErrorMsg("Upload failed."); } finally { setLoading(false); }
        }
    };

    const handleGenerate = async () => {
        if (!selectedImage) return;
        setLoading(true);
        setErrorMsg(null);
        const styleToSend = selectedStyle === 'custom' ? customStyleInput : selectedStyle;

        try {
            const res = await fetch("http://127.0.0.1:8000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image_url: selectedImage, style: styleToSend, custom_prompt: customPrompt, strength: strength }),
            });
            if (!res.ok) throw new Error("Generation failed");
            const data = await res.json();
            setGeneratedImage(data.generated_image);
            setProducts(data.products || []);
        } catch (err: any) { setErrorMsg(err.message); } finally { setLoading(false); }
    };

    return (
        <div className={`min-h-screen bg-[#0f172a] text-white ${inter.className}`}>
            {/* Navigation */}
            <nav className="border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        <span className="text-sm font-medium text-gray-300">Back to Home</span>
                    </Link>
                    <h1 className={`${playfair.className} text-xl font-medium tracking-tight`}>Studio Mode</h1>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                {/* Controls */}
                <div className="lg:col-span-4 space-y-8 h-fit">
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aesthetic</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {PRESET_STYLES.map((s) => (
                                <button key={s.id} onClick={() => setSelectedStyle(s.id)} className={`p-4 rounded-xl border text-left transition-all ${selectedStyle === s.id ? 'bg-white/5 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}>
                                    <span className="font-medium block text-sm">{s.label}</span>
                                    <p className="text-[10px] text-gray-500">{s.desc}</p>
                                </button>
                            ))}
                        </div>
                        {selectedStyle === 'custom' && (
                            <input type="text" placeholder="e.g. Cyberpunk, Barbie, Zen" value={customStyleInput} onChange={(e) => setCustomStyleInput(e.target.value)} className="w-full bg-indigo-500/10 border border-indigo-500/50 rounded-lg p-3 text-sm text-white focus:outline-none" />
                        )}
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Details</h3>
                        <textarea placeholder="e.g. 'Add a leather sofa'" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-gray-300 min-h-[100px]" />
                    </div>
                    <button onClick={handleGenerate} disabled={!selectedImage || loading} className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all shadow-xl ${!selectedImage ? 'bg-gray-800 text-gray-600' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
                        {loading ? "Designing..." : "Redesign Space"}
                    </button>
                </div>

                {/* Canvas */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center min-h-[600px]">
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} hidden />
                        {!selectedImage ? (
                            <button onClick={() => fileInputRef.current?.click()} className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-200">Upload Room</button>
                        ) : (
                            <>
                                <img src={(showOriginal || !generatedImage) ? selectedImage : generatedImage} className="max-w-full max-h-full object-contain" />
                                {generatedImage && !loading && (
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onMouseDown={() => setShowOriginal(true)} onMouseUp={() => setShowOriginal(false)} onMouseLeave={() => setShowOriginal(false)} className="bg-black/60 backdrop-blur text-white text-xs px-3 py-2 rounded-lg border border-white/10">Hold for Original</button>
                                        <a href={generatedImage} download="design.jpg" target="_blank" className="bg-indigo-600 text-white p-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></a>
                                    </div>
                                )}
                            </>
                        )}
                        {loading && <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-indigo-400 font-medium animate-pulse">Designing...</p></div>}
                    </div>
                </div>

                {/* Shopping */}
                <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col h-[600px]">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Shop The Look</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        {products.map((item, i) => (
                            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="group bg-white/5 hover:bg-white/10 p-3 rounded-xl flex gap-4 border border-transparent hover:border-white/10">
                                <img src={item.img} className="w-20 h-20 rounded-lg object-cover bg-gray-800" />
                                <div className="flex-1 flex flex-col justify-center"><span className="text-xs text-indigo-400 mb-1">{item.type}</span><h4 className="text-sm font-medium text-white leading-tight mb-1 group-hover:underline">{item.name}</h4><p className="text-sm text-gray-400">{item.price}</p></div>
                            </a>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
