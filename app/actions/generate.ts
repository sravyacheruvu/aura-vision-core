"use server";

import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateRoom(
    imageBase64: string,
    style: string,
    roomType: string,
    userPrompt: string,
    strength: number
) {
    console.log("--------------------------------");
    console.log("🚀 Server Action: Start Generation (Safe Mode)");

    if (!process.env.REPLICATE_API_TOKEN) {
        return { success: false, error: "Server Error: API Key missing." };
    }

    try {
        const knownPrompts: Record<string, string> = {
            "boho": "bohemian interior design, rattan furniture, organic textures, few plants, warm beige walls, cozy atmosphere, natural lighting",
            "industrial": "industrial loft interior, exposed brick walls, leather furniture, black metal accents, concrete floor, dramatic lighting",
            "elegant": "luxury contemporary interior, white marble floors, velvet furniture, brass gold accents, crystal chandelier, sophisticated",
            "minimalist": "minimalist interior, pure white walls, light oak wood floor, decluttered, clean lines, modern furniture, soft daylight",
            "custom": ""
        };

        const styleDesc = knownPrompts[style] || `${style} style`;

        // PROMPT ENGINEERING: "Renovation" + "Retain Structure"
        const finalPrompt = `Professional interior design photography of a ${roomType}, ${styleDesc}, ${userPrompt}, retaining original room geometry, high quality, 8k, photorealistic, architectural digest style`;

        // NEGATIVE PROMPT: Explicitly forbid "overgrowth" and "clutter"
        // This stops the "Rattan Explosion"
        const negativePrompt = "changing structure, changing windows, changing doors, messy, clutter, overgrown plants, too many plants, busy, distortion, blurry, low quality, cartoon, illustration";

        // CALIBRATED STRENGTH
        // Previous Range: 0.15 - 0.45 (Too subtle, just a tint)
        // New Range: 0.30 - 0.80
        // - 0.30: Light retouch
        // - 0.80: Complete transformation (may alter structure slightly)
        const safeStrength = 0.30 + (strength / 100.0) * 0.50;

        console.log(`📝 Prompt: "${finalPrompt}"`);
        console.log(`🎚 Strength Calibrated: ${strength}% -> ${safeStrength.toFixed(2)}`);

        // MODEL: stability-ai/sdxl
        console.log("🔍 Fetching latest model version for stability-ai/sdxl...");
        // Fallback hash if fetch fails (SDXL 1.0)
        let versionId = "39ed52f2a78e934b3ba6e3a854c1490940a94f116920628e1746e29251626120";
        try {
            const model = await replicate.models.get("stability-ai", "sdxl");
            if (model.latest_version?.id) {
                versionId = model.latest_version.id;
            }
        } catch (e) {
            console.warn("⚠️ Could not fetch latest version, using fallback.");
        }
        console.log(`✅ Using version: ${versionId}`);

        console.log("🚀 Creating Prediction...");
        let prediction = await replicate.predictions.create({
            version: versionId,
            input: {
                image: imageBase64,
                prompt: finalPrompt,
                negative_prompt: negativePrompt,
                prompt_strength: safeStrength,
                num_inference_steps: 40,
                guidance_scale: 7.5
            }
        });

        console.log(`🆔 Prediction ID: ${prediction.id}`);
        console.log(`⏳ Status: ${prediction.status}`);

        // POLL FOR COMPLETION
        const maxAttempts = 180; // 3 minutes timeout
        let attempts = 0;

        while (prediction.status !== "succeeded" && prediction.status !== "failed" && prediction.status !== "canceled") {
            if (attempts > maxAttempts) {
                await replicate.predictions.cancel(prediction.id);
                return { success: false, error: "Timeout: Generation took too long." };
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            prediction = await replicate.predictions.get(prediction.id);
            attempts++;

            if (attempts % 5 === 0) console.log(`...polling (${attempts}s) Status: ${prediction.status}`);
        }

        if (prediction.status === "failed" || prediction.status === "canceled") {
            console.error("❌ Prediction Failed:", prediction.error);
            return { success: false, error: "Model Failed: " + prediction.error };
        }

        const output = prediction.output;

        console.log("✅ Success!");
        return { success: true, imageUrl: (output as string[])[0] };

    } catch (error: any) {
        console.error("❌ MODEL FAILED:", error.message);

        if (error.message.includes("429")) return { success: false, error: "⚠️ High Traffic: Please wait 10s." };

        return { success: false, error: "AI Error: " + error.message };
    }
}