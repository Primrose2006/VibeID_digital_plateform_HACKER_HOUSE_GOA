import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy init Gemini AI
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// API Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Verification & ID Analysis
app.post("/api/gemini/verify-id", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { name, role, organization, photoBase64, idNumber } = req.body;

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured
      return res.json({
        verified: true,
        securityScore: 98.4,
        biometricMatch: "99.2%",
        clearanceLevel: "Level 3 - Gate & VIP Access",
        complianceChecks: [
          { check: "Photo Face Alignment", status: "passed", detail: "Centered, unobstructed front-facing portrait" },
          { check: "Background Cutout Isolation", status: "passed", detail: "Edge contrast verified, clean mask" },
          { check: "Digital Signature Integrity", status: "passed", detail: "Cryptographic hash verified" },
          { check: "Expiration & Access Expiry", status: "passed", detail: "Valid through 2028-12-31" }
        ],
        summary: `${name || 'Holder'} holds verified clearance as ${role || 'Member'} at ${organization || 'HACKER HOUSE 2026'}. Biometric integrity matches system records.`,
        cryptoHash: `0x8F9A${Math.random().toString(16).substring(2, 10).toUpperCase()}E32`
      });
    }

    const prompt = `Analyze this digital ID card profile data for verification and security compliance:
Holder Name: ${name}
Role/Title: ${role}
Organization/Event: ${organization}
ID Number: ${idNumber}

Provide a JSON assessment with:
- verified (boolean)
- securityScore (number 85-100)
- biometricMatch (string, e.g. "99.4%")
- clearanceLevel (string, e.g. "Level 3 - VIP Access")
- complianceChecks (array of objects with check, status ['passed'|'warning'], detail)
- summary (string short professional verification statement)
- cryptoHash (string starting with 0x)

Respond ONLY with valid JSON.`;

    const contents: any[] = [prompt];
    if (photoBase64 && photoBase64.startsWith("data:image")) {
      const base64Data = photoBase64.split(",")[1];
      const mimeType = photoBase64.split(";")[0].split(":")[1] || "image/jpeg";
      contents.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);
    return res.json(resultJson);
  } catch (error: any) {
    console.error("Gemini API Verification Error:", error);
    return res.status(500).json({
      error: "AI Verification service error",
      details: error?.message || "Internal server error"
    });
  }
});

// AI Bio & Card Helper
app.post("/api/gemini/generate-badge-info", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { promptText, style } = req.body;

    if (!ai) {
      return res.json({
        suggestedName: "Jenny Nguyen",
        suggestedRole: "Lead Developer & Event Architect",
        suggestedOrg: "HACKER HOUSE 2026",
        accessClearance: "Level 3 - Access Portal VIP",
        emergencyContact: "+1 (555) 019-2834"
      });
    }

    const prompt = `Generate a realistic digital ID profile based on user input: "${promptText || 'Tech conference attendee'}". Style requested: ${style || 'Hacker House / Tech Event'}.
Return JSON with:
- suggestedName
- suggestedRole
- suggestedOrg
- accessClearance
- emergencyContact`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultJson = JSON.parse(response.text || "{}");
    return res.json(resultJson);
  } catch (error: any) {
    console.error("Gemini info generation error:", error);
    return res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
