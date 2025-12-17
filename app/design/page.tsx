"use client";

import React, { useState, useRef } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import Link from 'next/link';
import { generateRoom } from '../actions/generate';
import { detectProducts } from '../actions/analyze';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

// --- UTILS: Resize Image ---
const resizeImage = async (file: File): Promise<string> => {
    // 1. Handle HEIC formatting
    let fileToProcess: Blob | File = file;
    if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
        try {
            console.log("🍏 HEIC Detected. Converting...");
            const heic2any = (await import('heic2any')).default;
            const converted = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.8
            });
            fileToProcess = Array.isArray(converted) ? converted[0] : converted;
        } catch (err) {
            console.error("HEIC Conversion Failed:", err);
            throw new Error("Could not allow this image format.");
        }
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileToProcess);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 1500;
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                } else {
                    if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            img.onerror = () => reject(new Error("invalid_image_data"));
        };
        reader.onerror = () => reject(new Error("read_failed"));
    });
};

// --- SMART EXPLANATION ---
const generateDesignExplanation = (style: string, room: string, prompt: string) => {
    const styleDescriptions: Record<string, string> = {
        'boho': `We transformed this ${room} using organic textures (rattan, jute) and earthy tones to create a relaxed, free-spirited atmosphere.`,
        'industrial': `We redesigned the ${room} with raw materials like leather and metal accents, focusing on a bold, structural aesthetic.`,
        'elegant': `We refined the ${room} with luxurious materials, velvet finishes, and sophisticated lighting for a high-end look.`,
        'minimalist': `We decluttered the ${room}, focusing on clean lines, monochromatic tones, and airy spatial flow.`,
        'custom': `We applied a custom design to the ${room}, harmonizing the color palette and updating the furniture silhouettes.`
    };

    let explanation = styleDescriptions[style] || styleDescriptions['custom'];
    if (prompt && prompt.length > 5) {
        explanation += ` We also incorporated your specific request: "${prompt}".`;
    }
    return explanation;
};

// --- SMART SHOPPING ---
const generateSmartProducts = (style: string, room: string, prompt: string) => {
    const products = [];
    const cleanPrompt = prompt.toLowerCase();
    const cleanStyle = style === 'custom' ? 'Modern' : style.charAt(0).toUpperCase() + style.slice(1);

    // 1. Detect Keywords
    const keywords = [
        { term: 'sofa', label: 'Sofa' }, { term: 'couch', label: 'Sofa' },
        { term: 'chair', label: 'Accent Chair' }, { term: 'rug', label: 'Area Rug' },
        { term: 'lamp', label: 'Lighting' }, { term: 'light', label: 'Lighting' },
        { term: 'mirror', label: 'Mirror' }, { term: 'plant', label: 'Indoor Plant' },
        { term: 'table', label: 'Table' }, { term: 'curtains', label: 'Curtains' },
        { term: 'stool', label: 'Bar Stool' }, { term: 'bed', label: 'Bed Frame' },
    ];

    keywords.forEach(k => {
        if (cleanPrompt.includes(k.term)) {
            products.push({
                name: `${cleanStyle} ${k.label}`, type: "Detected Item", price: "Check Prices",
                img: `https://placehold.co/200x200/F5F5F4/333?text=${k.label}`,
                link: `https://www.google.com/search?tbm=shop&q=${cleanStyle}+${k.label}`
            });
        }
    });

    // 2. Room-Specific Defaults (If no keywords found)
    if (products.length < 3) {
        let roomDefaults: any[] = [];

        if (room === 'Kitchen') {
            roomDefaults = [
                { name: `${cleanStyle} Bar Stool`, type: "Furniture", q: `${cleanStyle}+Bar+Stool` },
                { name: `${cleanStyle} Pendant Light`, type: "Lighting", q: `${cleanStyle}+Kitchen+Pendant` },
                { name: "Kitchen Decor Set", type: "Decor", q: `${cleanStyle}+Kitchen+Decor` }
            ];
        } else if (room === 'Bedroom') {
            roomDefaults = [
                { name: `${cleanStyle} Bed Frame`, type: "Furniture", q: `${cleanStyle}+Bed+Frame` },
                { name: `${cleanStyle} Nightstand`, type: "Furniture", q: `${cleanStyle}+Nightstand` },
                { name: "Table Lamp", type: "Lighting", q: `${cleanStyle}+Table+Lamp` }
            ];
        } else if (room === 'Bathroom') {
            roomDefaults = [
                { name: `${cleanStyle} Vanity Mirror`, type: "Decor", q: `${cleanStyle}+Bathroom+Mirror` },
                { name: "Bath Accessories", type: "Decor", q: `${cleanStyle}+Bath+Set` },
                { name: "Wall Sconce", type: "Lighting", q: `${cleanStyle}+Wall+Sconce` }
            ];
        } else {
            // Living Room / General defaults
            roomDefaults = [
                { name: `${cleanStyle} Lounge Chair`, type: "Furniture", q: `${cleanStyle}+Accent+Chair` },
                { name: `${cleanStyle} Rug`, type: "Decor", q: `${cleanStyle}+Area+Rug` },
                { name: `${cleanStyle} Floor Lamp`, type: "Lighting", q: `${cleanStyle}+Floor+Lamp` }
            ];
        }

        // Fill remaining slots
        roomDefaults.forEach(item => {
            if (products.length < 3) {
                products.push({
                    name: item.name, type: item.type, price: "Check Prices",
                    img: `https://placehold.co/200x200/F5F5F4/333?text=${item.name.split(' ')[1]}`,
                    link: `https://www.google.com/search?tbm=shop&q=${item.q}`
                });
            }
        });
    }
    return products.slice(0, 3);
};

export default function DesignPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [designMemo, setDesignMemo] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);

    // Controls
    const [roomType, setRoomType] = useState('Living Room');
    const [selectedStyle, setSelectedStyle] = useState('boho');
    const [customStyleInput, setCustomStyleInput] = useState('');
    const [customPrompt, setCustomPrompt] = useState("");
    const [strength, setStrength] = useState(75);

    // Refine Controls
    const [refinePrompt, setRefinePrompt] = useState("");
    const [refineStrength, setRefineStrength] = useState(60);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMsg(null);
        if (e.target.files?.[0]) {
            setLoading(true);
            try {
                const resizedDataUrl = await resizeImage(e.target.files[0]);
                setSelectedImage(resizedDataUrl);
                setGeneratedImage(null); setProducts([]); setDesignMemo("");
            } catch (err: any) {
                setErrorMsg(err.message === "heic_detected" ? "⚠️ Please use JPG/PNG." : "Could not process image.");
            } finally { setLoading(false); }
        }
    };

    const runGeneration = async (inputImage: string, prompt: string, str: number) => {
        if (!inputImage) return;
        setLoading(true); setErrorMsg(null);
        const styleToSend = selectedStyle === 'custom' ? customStyleInput : selectedStyle;
        try {
            const result = await generateRoom(inputImage, styleToSend, roomType, prompt, str);
            if (result.success && result.imageUrl) {
                setGeneratedImage(result.imageUrl);
                setDesignMemo(generateDesignExplanation(styleToSend, roomType, prompt));

                // 🚀 AI PRODUCT DETECTION
                setProducts([]); // Clear old products
                const analysis = await detectProducts(result.imageUrl);

                if (analysis.success && analysis.products.length > 0) {
                    const formattedProducts = analysis.products.map((p: any) => ({
                        name: p.name,
                        type: p.type,
                        price: "Check Prices",
                        img: `https://placehold.co/200x200/F5F5F4/333?text=${p.name.split(' ')[0]}`, // Placeholder for now
                        link: `https://www.google.com/search?tbm=shop&q=${p.q}`
                    }));
                    setProducts(formattedProducts);
                } else {
                    // Fallback to keyword matching if AI fails (or no key)
                    setProducts(generateSmartProducts(styleToSend, roomType, prompt));
                }

            } else { setErrorMsg(result.error || "Generation failed."); }
        } catch (err: any) { setErrorMsg("Network error: " + err.message); }
        finally { setLoading(false); }
    };

    const handleGenerate = () => runGeneration(selectedImage!, customPrompt, strength);

    const handleRefine = () => {
        if (!generatedImage) return;
        runGeneration(generatedImage, refinePrompt, refineStrength);
        setRefinePrompt("");
    };

    const handleShare = async () => {
        if (!generatedImage) return;
        try {
            if (navigator.share) await navigator.share({ title: 'My Aura Design', url: generatedImage });
            else { await navigator.clipboard.writeText(generatedImage); alert("Link copied!"); }
        } catch (err) { console.log("Share skipped"); }
    };

    const ROOM_TYPES = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Dining Room", "Office", "Backyard", "Kids Room"];

    const PRESET_STYLES = [
        { id: 'boho', label: 'Bohemian', desc: 'Warm, earthy' },
        { id: 'industrial', label: 'Industrial', desc: 'Raw, metallic' },
        { id: 'elegant', label: 'Elegant', desc: 'Luxe, gold' },
        { id: 'minimalist', label: 'Minimalist', desc: 'Clean, airy' },
        { id: 'custom', label: 'Custom', desc: 'Your Vibe' },
    ];

    return (
        <div className={`min-h-screen bg-stone-50 text-gray-900 ${inter.className}`}>
            <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition"><span className="text-sm font-medium text-gray-500">← Back Home</span></Link>
                    <h1 className={`${playfair.className} text-xl font-semibold tracking-tight`}>Studio Mode</h1>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 pb-20">

                {/* LEFT CONTROLS */}
                <div className="lg:col-span-4 space-y-8 h-fit">
                    {errorMsg && <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">🚨 {errorMsg}</div>}

                    {/* DESIGN EXPLANATION */}
                    {generatedImage && designMemo && (
                        <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-sm animate-fade-in">
                            <h4 className="text-rose-600 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">✨ AI Design Insight</h4>
                            <p className="text-gray-700 text-sm leading-relaxed">{designMemo}</p>
                        </div>
                    )}

                    {/* MAIN CONTROLS */}
                    <div className="space-y-8 transition-opacity opacity-100">

                        {/* 1. ROOM TYPE */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">1. Room Type</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                {ROOM_TYPES.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRoomType(r)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${roomType === r ? 'bg-gray-900 text-white shadow-md' : 'bg-white border border-stone-200 text-gray-600 hover:bg-stone-100'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. STYLE */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">2. Aesthetic</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {PRESET_STYLES.map((s) => (
                                    <button key={s.id} onClick={() => setSelectedStyle(s.id)} className={`p-4 rounded-2xl border text-left transition-all ${selectedStyle === s.id ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-white border-stone-200 text-gray-600'}`}>
                                        <span className="font-bold block text-sm">{s.label}</span>
                                        <span className={`text-[10px] ${selectedStyle === s.id ? 'text-gray-400' : 'text-gray-400'}`}>{s.desc}</span>
                                    </button>
                                ))}
                            </div>
                            {selectedStyle === 'custom' && <input type="text" placeholder="Type a style" value={customStyleInput} onChange={(e) => setCustomStyleInput(e.target.value)} className="w-full bg-white border border-stone-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />}
                        </div>

                        {/* 3. INSTRUCTIONS */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">3. Instructions</h3>
                            <textarea placeholder="e.g. 'Add a kitchen island'" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} className="w-full bg-white border border-stone-200 rounded-2xl p-4 text-sm min-h-[100px] focus:border-rose-500 focus:outline-none resize-none" />
                        </div>

                        {/* 4. INTENSITY */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center"><h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">4. Intensity</h3><span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded">{strength}%</span></div>
                            <input type="range" min="10" max="100" value={strength} onChange={(e) => setStrength(Number(e.target.value))} className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-gray-900" />
                        </div>

                        <button onClick={handleGenerate} disabled={!selectedImage || loading} className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide uppercase transition-all shadow-xl ${!selectedImage ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'}`}>
                            {loading && !generatedImage ? "Designing..." : "Redesign Space"}
                        </button>
                    </div>

                    {/* REFINE PANEL */}
                    {generatedImage && !loading && (
                        <div className="pt-8 border-t-2 border-stone-100 animate-fade-in font-sans">
                            <h3 className={`${playfair.className} text-lg font-bold text-gray-900 mb-4`}>Iterate & Refine</h3>
                            <div className="space-y-5 p-5 bg-white rounded-3xl border-2 border-rose-100 shadow-sm">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">What to change?</label>
                                    <textarea placeholder="e.g. 'Move the plant', 'Make it brighter'" value={refinePrompt} onChange={(e) => setRefinePrompt(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm focus:bg-white focus:border-rose-500 outline-none resize-none" rows={3} />
                                </div>
                                <button onClick={handleRefine} disabled={!refinePrompt} className={`w-full py-3 rounded-2xl font-bold text-sm tracking-wide uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ${!refinePrompt ? 'bg-stone-200 text-gray-400' : 'bg-gray-900 text-white hover:bg-black'}`}>
                                    Update Design
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* MIDDLE CANVAS */}
                <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24 h-fit">
                    <div className="bg-white border border-stone-200 rounded-3xl relative overflow-hidden flex items-center justify-center min-h-[600px] shadow-sm transition-all">
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} hidden />
                        {!selectedImage ? (
                            <button onClick={() => fileInputRef.current?.click()} className="bg-stone-50 border border-stone-200 text-gray-600 px-8 py-4 rounded-full text-sm font-bold hover:bg-stone-100 hover:border-stone-300 transition flex items-center gap-2">
                                <span>+</span> Upload Room Photo
                            </button>
                        ) : (
                            <div className="relative w-full h-full min-h-[600px] flex items-center justify-center bg-stone-100">
                                <img src={selectedImage} className="max-w-full max-h-[600px] object-contain relative z-10" />
                                {generatedImage && <img key={generatedImage} src={generatedImage} className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 z-20 ${showOriginal ? 'opacity-0' : 'opacity-100'}`} />}
                                {generatedImage && !loading && (
                                    <div className="absolute top-4 right-4 flex gap-2 z-30">
                                        <button onMouseDown={() => setShowOriginal(true)} onMouseUp={() => setShowOriginal(false)} onMouseLeave={() => setShowOriginal(false)} className="bg-white/90 backdrop-blur text-gray-900 text-xs px-4 py-2 rounded-xl border border-stone-200 shadow-sm font-bold hover:bg-white">Hold Original</button>

                                        <button onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-50 shadow-sm border border-stone-200 text-xs font-bold flex items-center gap-2">
                                            <span>+</span> New
                                        </button>

                                        <button onClick={handleShare} className="bg-white text-gray-900 p-2 rounded-xl hover:bg-gray-50 shadow-sm border border-stone-200"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg></button>
                                        <a href={generatedImage} download="design.jpg" target="_blank" className="bg-gray-900 text-white p-2 rounded-xl hover:bg-black shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></a>
                                    </div>
                                )}
                            </div>
                        )}
                        {loading && <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-50"><div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-gray-900 font-bold animate-pulse">{generatedImage ? "Refining..." : "Redesigning..."}</p></div>}
                    </div>
                </div>

                {/* RIGHT SHOPPING */}
                <div className="lg:col-span-3 bg-white border border-stone-200 rounded-3xl p-6 flex flex-col h-[600px] shadow-sm sticky top-24">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Shop The Look</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        {products.length === 0 ? <div className="h-full flex items-center justify-center text-center text-gray-400 text-sm p-4">Products will appear here after generation.</div> : products.map((item, i) => (
                            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="group bg-stone-50 hover:bg-white p-3 rounded-2xl flex gap-4 border border-stone-100 hover:border-rose-200 hover:shadow-md transition">
                                <img src={item.img} className="w-16 h-16 rounded-xl object-cover bg-stone-200" />
                                <div className="flex-1 flex flex-col justify-center"><h4 className="text-sm font-bold text-gray-900 leading-tight mb-1 group-hover:text-rose-600">{item.name}</h4><p className="text-xs text-gray-500">{item.price}</p></div>
                            </a>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}