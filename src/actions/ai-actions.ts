"use server";

import { generateBusinessInsights } from "@/lib/ai-insights";

export async function askAssistant(message: string) {
  // Mock AI response logic
  // In a real app, you'd integrate OpenAI/Gemini here with your Prisma data as context
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("revenue")) {
    return "Historical revenue shows a 12% upward trend. Based on current invoices, I forecast a 5% increase for next month.";
  }
  
  if (lowerMessage.includes("expense") || lowerMessage.includes("cost")) {
    return "Your highest expense category is Fuel, accounting for 42% of total spend. I recommend optimizing routes for vehicles with low KMPL.";
  }

  if (lowerMessage.includes("maintenance")) {
    return "3 vehicles are approaching their service intervals. Vehicle MH-04-1234 has a high risk score of 85 due to consecutive long trips.";
  }

  return "I am your NexusFleet AI assistant. I can help you analyze revenue, track expenses, or predict maintenance. What would you like to know?";
}
