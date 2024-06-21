import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function GET(request: Request) {
  return new Response("Hello, Next.js!");
}

export async function POST(request: Request) {
  try {
    const { userText, language } = await request.json();

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful in-store AI assistant for an online retail store. Assist customers with finding products, answering questions about inventory, prices, and store policies. Respond in ${language}.`,
        },
        { role: "user", content: userText },
      ],
    });

    const aiMessage = completion.data.choices[0].message?.content;
    console.log("AI Response:", aiMessage);

    return NextResponse.json(
      {
        message: aiMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      {
        message: "Error processing your request",
      },
      { status: 500 }
    );
  }
}
