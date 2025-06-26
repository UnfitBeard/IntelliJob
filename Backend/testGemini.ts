import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

async function testGemini() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const result = await model.generateContent("Say hello in a funny way");
  const response = result.response;
  console.log(response.text());
}

testGemini().catch(console.error);
