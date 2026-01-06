import { extractTextFromImage } from "../utils/ocr.js";
import { analyzeProductsAI } from "../utils/ecoAI.js";
import OpenAI from "openai";

// remove useless OCR lines
const sanitizeText = (text) =>
  text
    .split("\n")
    .map(l => l.trim())
    .filter(l =>
      l.length > 3 &&
      !l.match(/total|gst|invoice|amount|tax/i)
    )
    .slice(0, 15) // 🔥 limit size
    .join("\n");

export const analyzeBill = async (req, res) => {
  try {
    let billText = "";

    // IMAGE input
    if (req.file) {
      const raw = await extractTextFromImage(req.file.buffer);
      billText = sanitizeText(raw);
    }

    // TEXT input
    if (!billText && req.body.billText) {
      billText = sanitizeText(req.body.billText);
    }

    if (!billText) {
      return res.status(400).json({
        success: false,
        message: "Provide bill image or bill text"
      });
    }

    // 🔹 STEP 1: extract products only
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const extractRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Extract product names from bill text.
Return ONLY JSON array.

${billText}`
      }],
      temperature: 0
    });

    const products = JSON.parse(
      extractRes.choices[0].message.content.replace(/```json|```/g, "")
    );

    // 🔹 STEP 2: eco analysis (safe)
    let ecoResult;
    try {
      ecoResult = await analyzeProductsAI(products);
    } catch {
      ecoResult = {
        totalPollutionScore: 0,
        analysis: products.map(p => ({
          item: p,
          impact: "unknown",
          recyclable: false,
          pollution: 0,
          alternatives: [],
          reason: "AI unavailable"
        }))
      };
    }

    res.json({
      success: true,
      inputType: req.file ? "image" : "text",
      productsDetected: products.length,
      pollutionScore: ecoResult.totalPollutionScore,
      summary:
        ecoResult.totalPollutionScore > 15
          ? "⚠️ High environmental impact"
          : "🌱 Eco-friendly purchase",
      breakdown: ecoResult.analysis
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Bill analysis failed"
    });
  }
};
