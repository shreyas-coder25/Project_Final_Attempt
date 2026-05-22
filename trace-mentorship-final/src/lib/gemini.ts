import { GoogleGenAI, Type } from "@google/genai";
import { getCallable } from "./firebase";
import { normalizeRoadmap, type RoadmapMilestone } from "./store";

interface StudentContext {
  domain?: string;
  skills?: string[];
  goals?: string;
  availability?: string;
}

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "VITE_GEMINI_API_KEY is missing. Add it to your .env file.",
      );
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function generateRoadmap(
  domain: string,
  skills: string[],
  goals: string,
  availability: string,
): Promise<RoadmapMilestone[]> {
  try {
    const call = getCallable<StudentContext, { roadmap: RoadmapMilestone[] }>("generateRoadmap");
    const result = await call({ domain, skills, goals, availability });
    return normalizeRoadmap(result.data.roadmap || []);
  } catch {
    try {
      const ai = getGeminiClient();
      const prompt = `Create a high-level learning roadmap for an engineering student.
Domain: ${domain}
Current Skills: ${skills.join(", ")}
Goals: ${goals}
Availability: ${availability}

Return a JSON array of up to 6 roadmap milestones. For each, provide a title and a simple status ("upcoming").`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                status: { type: Type.STRING },
              },
              required: ["title", "status"],
            },
          },
        },
      });

      return normalizeRoadmap(JSON.parse(response.text || "[]"));
    } catch {
      return [];
    }
  }
}

export async function generateLearningInsights(
  domain: string,
  skills: string[],
  goals: string,
): Promise<string[]> {
  try {
    const call = getCallable<StudentContext, { insights: string[] }>("generateLearningInsights");
    const result = await call({ domain, skills, goals });
    return result.data.insights || [];
  } catch {
    try {
      const ai = getGeminiClient();
      const prompt = `Provide 3 short, personalized, highly specific learning insights/tips for a student learning ${domain}.
Their current skills: ${skills.join(", ")}.
Their goal: ${goals}.
Focus on what to learn next, productivity, or placement readiness. Provide practical, non-generic advice.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      });

      return JSON.parse(response.text || "[]");
    } catch {
      return [];
    }
  }
}

export async function assistantReply(
  studentProfile: StudentContext,
  message: string,
): Promise<string> {
  try {
    const call = getCallable<StudentContext & { message: string }, { reply: string }>("assistantReply");
    const result = await call({ ...studentProfile, message });
    return result.data.reply || "I could not generate a response right now.";
  } catch {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are a supportive AI learning companion for an engineering student.
Domain: ${studentProfile.domain || "Unknown"}
Goals: ${studentProfile.goals || "Unknown"}
Current Skills: ${studentProfile.skills?.join(", ") || "Unknown"}

Provide helpful, very concise, encouraging responses. Suggest resources if applicable.
User's query: ${message}`,
    });
    return response.text || "I could not generate a response right now.";
  }
}

export async function generateMentorMatchExplanation(
  domain: string,
  goals: string,
): Promise<string> {
  try {
    const ai = getGeminiClient();
    const prompt = `Write a short 2-3 sentence explanation of why a Senior Mentor specializing in ${domain} is the perfect match for a student whose goal is "${goals}". Make it encouraging and specific.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text || "";
  } catch {
    return "";
  }
}
