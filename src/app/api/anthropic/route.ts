import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages.mjs";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key not configured. Please add your API key to the environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt } = body;

    const completion = await anthropic.messages.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
    });

    // Get the response
    const response = completion.content[0] as TextBlock;
    return NextResponse.json({ response: response.text });
  } catch (error: any) {
    console.error("Anthropic API error:", error);

    // Extract the actual error message from OpenAI
    let errorMessage = error?.message || error?.error?.message || "Failed to process the request. Please try again.";
    
    // Truncate error message if it's too long (max 200 characters)
    if (errorMessage.length > 200) {
      errorMessage = errorMessage.substring(0, 197) + "...";
    }
    
    // Get the status code from the error, default to 500
    const statusCode = error?.status || 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
