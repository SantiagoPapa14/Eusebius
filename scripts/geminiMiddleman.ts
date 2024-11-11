import { GoogleGenerativeAI } from "@google/generative-ai";
import { getWords } from "./sqliteLibrary";

let conversationHistory: string[] = [];
let geminiAPIKey = "AIzaSyDJFgSpP_Z7FN_6YEPFUxQTFKssSlvfX2s";

const genAI = new GoogleGenerativeAI(geminiAPIKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export function resetConversation() {
  conversationHistory = [];
}

async function primeConversation() {
  const words = await getWords();
  const primer = `Hello gemini, we will pretend that you are a latin professor.
You must be ready to answer any doubts about the latin language, its grammar, cases, etc.
It is important that you do not make your answers very long, and always be as kind as possible torwards the student.
Here is a list of words that the student knows, whenever possible try to vinculate your response with these words: \n ${JSON.stringify(
    words.map((word) => word.word)
  )}`;
  conversationHistory.push(`You: ${primer}`);
  const result = await model.generateContent([conversationHistory.join("\n")]);
  const responseText = result.response.text();
  conversationHistory.push(`Model: ${responseText}`);
}

export async function sendMessage(newPrompt: string) {
  if (conversationHistory.length === 0) {
    await primeConversation();
  }
  conversationHistory.push(`You: ${newPrompt}`);
  const result = await model.generateContent([conversationHistory.join("\n")]);
  const responseText = result.response.text();
  conversationHistory.push(`Model: ${responseText}`);
  return responseText;
}
