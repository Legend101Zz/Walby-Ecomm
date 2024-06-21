// api/openai/route.ts
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    const { userText, language, showingDroneProduct, userName } =
      await request.json();

    const languageMap: { [key: string]: string } = {
      "en-US": "English",
      "es-ES": "Spanish",
      "fr-FR": "French",
      "de-DE": "German",
      "it-IT": "Italian",
      "ja-JP": "Japanese",
      "ko-KR": "Korean",
      "zh-CN": "Chinese",
      "hi-IN": "Hindi",
    };

    const languageName = languageMap[language] || "English";

    let systemMessage = `You are a helpful and friendly sales assistant in a drone store. Your customer's name is ${userName}. Respond in ${languageName}. Be conversational and natural, as if you're speaking, not writing. Use the customer's name occasionally. If the customer is quiet for a while, ask if they need help or if they want to see other products.`;

    if (showingDroneProduct) {
      systemMessage += ` The customer is currently viewing our Premium Drone X1000. It costs ₹74,999. Its features include a 4K Ultra HD Camera, 30 Minutes Flight Time, 5km Control Range, Obstacle Avoidance System, and a Foldable Design for Easy Transport. Guide them through its features, answer any questions, and offer to show it in AR if they're interested.`;
    } else {
      systemMessage += ` If the customer expresses interest in drones, respond with 'SHOW_DRONE_PRODUCT' at the start of your message, followed by your regular response.`;
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
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
