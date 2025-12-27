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
