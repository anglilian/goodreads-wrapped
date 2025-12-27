import { OpenAI } from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please add your API key to the environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt } = body;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4o",
      max_tokens: 500,
      temperature: 0.7,
    });

    // Get the response
    const response = completion.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    // Check for insufficient quota
    if (error?.status === 429 || error?.error?.code === "insufficient_quota") {
      return NextResponse.json(
        { error: "Failed to process the request. Please check that your OpenAI API has sufficient credits, then try again." },
        { status: 429 }
      );
    }

    // Check for invalid API key
    if (error?.status === 401 || error?.error?.code === "invalid_api_key") {
      return NextResponse.json(
        { error: "Invalid API key. Please check your OpenAI API key configuration." },
        { status: 401 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "Failed to process the request. Please try again later or contact lilianang999@gmail.com" },
      { status: 500 }
    );
  }
}
