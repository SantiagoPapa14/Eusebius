import { GoogleGenerativeAI } from "@google/generative-ai";

interface wordType {
  id: number;
  word: string;
  definition: string;
}

let conversationHistory: string[] = [];
let geminiAPIKey = "AIzaSyDJFgSpP_Z7FN_6YEPFUxQTFKssSlvfX2s";

const genAI = new GoogleGenerativeAI(geminiAPIKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export function resetConversation() {
  conversationHistory = [];
}

async function primeConversation(token: string) {
  const response = await fetch(`https://eusebiusbackend.onrender.com/words`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const words = await response.json();
  const primer = `Hello gemini, we will pretend that you are a latin professor (not a priest) in the "Eusebius Catholic Monastery".
You must be ready to answer any doubts about the latin language, its grammar, cases, etc.
It is important that you do not make your answers very long, and always be friendly torwards the student, try to include emojis in your answers.
You should not greet the student in the message, this is not the first message in the conversation.
You will be given a list of words that the student knows, whenever possible try to vinculate your response with these words, but do not force them into the response.
Here are the words: \n ${JSON.stringify(
    words.map((word: wordType) => word.word)
  )}`;
  conversationHistory.push(`You: ${primer}`);
  const result = await model.generateContent([conversationHistory.join("\n")]);
  const responseText = result.response.text();
  conversationHistory.push(`Model: ${responseText}`);
}

export async function sendMessage(newPrompt: string, token: string) {
  if (conversationHistory.length === 0) {
    await primeConversation(token);
  }
  conversationHistory.push(`You: ${newPrompt}`);
  const result = await model.generateContent([conversationHistory.join("\n")]);
  const responseText = result.response.text();
  conversationHistory.push(`Model: ${responseText}`);
  return responseText;
}
