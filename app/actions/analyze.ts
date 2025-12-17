"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function detectProducts(imageBase64: string) {
    console.log("--------------------------------");
    console.log("🚀 Server Action: Start Product Detection");

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.warn("⚠️ Google API Key missing. Returning fallback products.");
        return { success: false, products: [] };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Clean Base64
        const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

        const prompt = `
        Analyze this interior design image.
        Identify the top 3-4 most prominent furniture or decor items (e.g., sofa, rug, lamp, chair, table).
        For each item:
        1. Give it a specific name (e.g. "White Boucle Sofa", "Jute Area Rug").
        2. Assign a broad type (Furniture, Lighting, Decor).
        3. Create a short shopping search query.

        Return ONLY valid JSON array with this format:
        [
            { "name": "Item Name", "type": "Type", "q": "Search Query" }
        ]
        Do not include markdown formatting or backticks.
        `;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: cleanBase64, mimeType: "image/png" } }
        ]);

        const response = await result.response;
        let text = response.text();

        // Cleanup JSON
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        console.log("🤖 Gemini Output:", text);

        const products = JSON.parse(text);
        return { success: true, products: products };

    } catch (error: any) {
        console.error("❌ Gemini Vision Failed:", error.message);
        return { success: false, products: [] };
    }
}
