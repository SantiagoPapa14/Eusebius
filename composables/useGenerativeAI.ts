import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let conversationHistory: string[] = [];

export async function useGenerativeAI(newPrompt: string) {
  conversationHistory.push(`You: ${newPrompt}`);
  const result = await model.generateContent([conversationHistory.join("\n")]);
  const responseText = result.response.text();
  conversationHistory.push(`Model: ${responseText}`);
  return responseText;
}
