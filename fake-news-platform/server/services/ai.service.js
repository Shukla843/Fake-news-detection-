// =============================================
// services/ai.service.js - AI Analysis Engine
// =============================================
// This service calls the OpenAI API to analyze
// whether a piece of news is Fake, Real, or Suspicious.
// If OpenAI key is missing, it uses a MOCK response
// so the app still works for development/demos.

import OpenAI from "openai";

// ── Lazy OpenAI client ──────────────────────
// Only created when needed — prevents crash on startup
// if OPENAI_API_KEY is not set in .env
let _openai = null;
const getOpenAIClient = () => {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
};

// ── Main AI Analysis Function ───────────────
export const analyzeNews = async (newsText) => {
  // If no API key is set, use mock response (for demos/testing)
  if (
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY === "your_openai_api_key_here"
  ) {
    console.log("⚠️  No OpenAI key found. Using mock AI response.");
    return getMockAnalysis(newsText);
  }

  try {
    const openai = getOpenAIClient();

    // ── Prompt Engineering ──────────────────
    // We ask OpenAI to return a strict JSON format
    // so we can reliably parse the response
    const prompt = `
You are a professional fact-checker and misinformation expert.

Analyze the following news text and determine if it is:
- "Real": Credible, factual, well-sourced news
- "Fake": Misinformation, fabricated, or false news
- "Suspicious": Possibly misleading, lacks sources, or cannot be verified

News Text:
"""
${newsText}
"""

Respond ONLY with a valid JSON object in this exact format (no extra text, no markdown):
{
  "label": "Real" | "Fake" | "Suspicious",
  "confidence": <number between 0 and 100>,
  "explanation": "<2-3 sentences explaining your analysis>"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert misinformation detector. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    // Extract the text content from OpenAI's response
    const rawText = response.choices[0].message.content.trim();

    // Parse JSON response from AI
    const result = JSON.parse(rawText);

    // Validate the response has expected fields
    if (!result.label || result.confidence === undefined || !result.explanation) {
      throw new Error("Invalid AI response format");
    }

    return result;
  } catch (error) {
    console.error("OpenAI API Error:", error.message);

    // If OpenAI fails, fall back to mock response
    console.log("Falling back to mock analysis...");
    return getMockAnalysis(newsText);
  }
};

// ── Mock Analysis (used when OpenAI is unavailable) ──
// This simulates AI behavior based on simple keyword checks
// Perfect for demos and testing without an API key
const getMockAnalysis = (newsText) => {
  const text = newsText.toLowerCase();

  // Keywords that suggest fake news
  const fakeKeywords = [
    "breaking: secret",
    "they don't want you to know",
    "mainstream media won't",
    "hidden truth",
    "conspiracy",
    "deep state",
    "microchip",
    "miracle cure",
    "shocking secret",
    "share before this gets deleted",
    "doctors don't want you",
  ];

  // Keywords that suggest real/credible news
  const realKeywords = [
    "according to",
    "researchers found",
    "study shows",
    "officials said",
    "confirmed by",
    "published in",
    "data shows",
    "statistics",
    "percent",
    "report says",
    "journal of",
  ];

  // Count matches
  const fakeMatches = fakeKeywords.filter((kw) => text.includes(kw)).length;
  const realMatches = realKeywords.filter((kw) => text.includes(kw)).length;

  if (fakeMatches > realMatches) {
    return {
      label: "Fake",
      confidence: Math.min(65 + fakeMatches * 5, 95),
      explanation:
        "This news contains language patterns commonly associated with misinformation, including sensationalist claims and lack of credible sourcing. The writing style and unverified assertions suggest this may be fabricated content.",
    };
  } else if (realMatches > fakeMatches) {
    return {
      label: "Real",
      confidence: Math.min(60 + realMatches * 5, 92),
      explanation:
        "This news appears to follow journalistic standards with references to sources, data, and credible language patterns. The structured presentation and cited evidence support its authenticity.",
    };
  } else {
    return {
      label: "Suspicious",
      confidence: 58,
      explanation:
        "This news cannot be conclusively verified or debunked based on available information. It contains some elements of legitimate reporting but lacks sufficient sourcing or contains unverifiable claims that warrant caution.",
    };
  }
};
