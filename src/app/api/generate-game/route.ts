import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GameConfig } from "@/types/gameConfig";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const { companyName, primaryColor, secondaryColor, accentColor, goal, audience, products } = await req.json();

    // Basic validation
    if (!companyName || !primaryColor || !secondaryColor || !accentColor || !goal || !audience) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Parse products (comma-separated)
    const productList = products
      ? products.split(",").map((p: string) => p.trim()).filter((p: string) => p.length > 0)
      : [];

    // Call OpenAI to generate a GameConfig
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are an expert game designer who creates highly personalized, branded arcade experiences.

**Your Task**: Analyze the user's goal and audience, then intelligently select the BEST game type and create compelling, authentic copy.

**Available Game Types**:
- spaceDefender: Fast-paced shooting (good for: tech, defense, protection themes)
- coinCollector: Catching falling items (good for: sales, growth, collection themes)
- bubblePopper: Click to pop rising bubbles (good for: engagement, discovery, fun themes)
- targetShooter: Precision clicking (good for: accuracy, goals, KPIs themes)
- runnerDash: Obstacle jumping (good for: endurance, journey, progression themes)
- memoryMatch: Card matching (good for: learning, education, cognitive themes)

**Selection Criteria**:
1. READ the goal carefully - if they mention a specific game style (e.g., "fast-paced", "competitive", "memory"), choose that type
2. Match game mechanics to their industry/goal metaphors
3. Consider audience preferences (developers like technical challenges, marketers like engagement metrics, etc.)

**Copy Guidelines**:
- startHeadline: Make it punchy, branded, and directly related to THEIR specific goal (not generic). Use {companyName} placeholder.
- endWinHeadline: Celebrate their specific achievement, tie to their mission
- gameElements: If products/services are provided, use them as game elements (for card content, collectibles, targets, etc.). This personalizes the game with actual company products.
- Be SPECIFIC to their industry - use their language, their metrics, their vibe

**Settings**:
- enemySpawnRate: 800-1800ms (adjust for challenge level implied in goal)
- playerSpeed: 5-7
- maxLives: 3-4

Return ONLY valid JSON:
{
  "gameType": "chosen game type",
  "brand": {
    "name": "exact company name",
    "primaryColor": "exact color",
    "secondaryColor": "exact color",
    "accentColor": "exact color",
    "products": ["product1", "product2", ...] // if products provided
  },
  "copy": {
    "startHeadline": "specific, branded headline",
    "endWinHeadline": "specific celebration",
    "gameElements": ["element1", "element2", ...] // use products if provided, otherwise creative elements
  },
  "settings": {
    "enemySpawnRate": number,
    "playerSpeed": number,
    "maxLives": number
  }
}
`.trim(),
        },
        {
          role: "user",
          content: `
Company: ${companyName}
Colors: Primary ${primaryColor}, Secondary ${secondaryColor}, Accent ${accentColor}

GOAL: ${goal}

TARGET AUDIENCE: ${audience}

${productList.length > 0 ? `PRODUCTS/SERVICES: ${productList.join(", ")}

IMPORTANT: Use these exact products as gameElements. For memoryMatch, these should be card content. For coinCollector, these should be falling items. For bubblePopper, these should be bubble labels. Etc.` : ""}

Choose the perfect game type and create copy that speaks directly to this goal and audience. Be specific and creative!
`.trim(),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No content returned from OpenAI" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content) as GameConfig;

    // Log the generated config for debugging
    console.log("=== AI Generated Game Config ===");
    console.log(JSON.stringify(parsed, null, 2));
    console.log("================================");

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Error in /api/generate-game:", err);
    return NextResponse.json(
      { error: "Failed to generate game config" },
      { status: 500 }
    );
  }
}
