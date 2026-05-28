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

export interface WizardContext {
  domain: string;
  skillLevel: string;
  targetRole: string;
  deadline: string;
}

export async function generatePersonalizedRoadmap(
  context: WizardContext
): Promise<any> {
  const ai = getGeminiClient();
  const prompt = `You are an expert tech and non-tech career mentor.
Create a personalized learning roadmap for an engineering student.
Domain: ${context.domain} (Can be tech like CS, AI, or non-tech like Mechanical, Civil, Electrical, etc.)
Current Skill Level: ${context.skillLevel}
Target Role/Goal: ${context.targetRole}
Deadline / Commitment: ${context.deadline}

Return a STRICT JSON object matching this schema exactly. Do NOT use markdown code blocks.
Include 4-8 milestones split between "short-term" and "long-term" phases.
Use high-quality resources. For non-tech domains, use appropriate resources (NPTEL, MIT OpenCourseWare, specific domain books/portals).
"honestAdvice" must be 2-3 sentences, brutally realistic but encouraging.

Schema:
{
  "generatedAt": "ISO timestamp",
  "domain": "string",
  "targetRole": "string",
  "totalWeeks": number,
  "honestAdvice": "string",
  "mentorNote": "Discuss this with your mentor before starting.",
  "milestones": [
    {
      "id": "unique string",
      "phase": "short-term or long-term",
      "title": "string",
      "description": "1-2 sentences, beginner-friendly",
      "weekRange": "e.g. Week 1-2",
      "estimatedHours": number,
      "skills": ["string", "string"],
      "resources": [
        { "title": "string", "url": "string", "type": "video or doc or course" }
      ],
      "status": "upcoming"
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            generatedAt: { type: Type.STRING },
            domain: { type: Type.STRING },
            targetRole: { type: Type.STRING },
            totalWeeks: { type: Type.INTEGER },
            honestAdvice: { type: Type.STRING },
            mentorNote: { type: Type.STRING },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  phase: { type: Type.STRING, enum: ["short-term", "long-term"] },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  weekRange: { type: Type.STRING },
                  estimatedHours: { type: Type.INTEGER },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ["video", "doc", "course"] },
                      },
                      required: ["title", "url", "type"],
                    },
                  },
                  status: { type: Type.STRING, enum: ["upcoming", "active", "done"] },
                },
                required: ["id", "phase", "title", "description", "weekRange", "estimatedHours", "skills", "resources", "status"],
              },
            },
          },
          required: ["generatedAt", "domain", "targetRole", "totalWeeks", "honestAdvice", "mentorNote", "milestones"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Gemini API failed, returning mock roadmap. Error:", error);
    // Fallback Mock Data so the demo doesn't crash on invalid API key
    return {
      generatedAt: new Date().toISOString(),
      domain: context.domain,
      targetRole: context.targetRole,
      totalWeeks: 12,
      honestAdvice: "This is a fallback generated roadmap because the Gemini API key was invalid. To get real AI generation, please configure a valid VITE_GEMINI_API_KEY.",
      mentorNote: "Discuss this with your mentor before starting.",
      milestones: [
        {
          id: "mock-1",
          phase: "short-term",
          title: "Master the Fundamentals",
          description: "Build a strong foundation in the core principles of your domain before moving on to advanced topics.",
          weekRange: "Week 1-4",
          estimatedHours: 15,
          skills: ["Basics", "Problem Solving"],
          resources: [
            { title: "Crash Course on Basics", url: "https://youtube.com", type: "video" },
            { title: "Official Documentation", url: "https://docs.example.com", type: "doc" }
          ],
          status: "active"
        },
        {
          id: "mock-2",
          phase: "short-term",
          title: "Build Your First Project",
          description: "Apply what you have learned by building a small but complete project from scratch.",
          weekRange: "Week 5-8",
          estimatedHours: 20,
          skills: ["Practical Application", "Debugging"],
          resources: [
            { title: "Project Tutorial Series", url: "https://youtube.com", type: "course" }
          ],
          status: "upcoming"
        },
        {
          id: "mock-3",
          phase: "long-term",
          title: "Advanced Concepts & Optimization",
          description: "Dive deeper into advanced topics, performance optimization, and industry best practices.",
          weekRange: "Month 3-4",
          estimatedHours: 30,
          skills: ["Optimization", "Architecture"],
          resources: [
            { title: "Advanced Techniques", url: "https://example.com", type: "doc" }
          ],
          status: "upcoming"
        },
        {
          id: "mock-4",
          phase: "long-term",
          title: "Portfolio & Interview Prep",
          description: "Polish your projects, update your resume, and start preparing for technical interviews.",
          weekRange: "Month 5-6",
          estimatedHours: 25,
          skills: ["Interviewing", "Communication"],
          resources: [
            { title: "Mock Interview Guide", url: "https://example.com", type: "video" }
          ],
          status: "upcoming"
        }
      ]
    };
  }
}
