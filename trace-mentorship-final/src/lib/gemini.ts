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
  topic: string;
  timeline: string;
  currentLevel: string;
  hoursPerWeek: number;
  studentBranch?: string;
  studentRole?: string;
  studentSkills?: string[];
  studentGoals?: string;
}

export async function generatePersonalizedRoadmap(
  context: WizardContext
): Promise<any> {
  const ai = getGeminiClient();

  const prompt = `You are an expert learning roadmap designer for engineering students in India.

Topic: ${context.topic}
Goal: ${context.studentGoals || "General upskilling in " + context.topic}
Current Level: ${context.currentLevel}
Timeline: ${context.timeline} months
Hours per week: ${context.hoursPerWeek}

Student Context (use to personalize):
- Branch: ${context.studentBranch || "Unknown"}
- Target Role: ${context.studentRole || "Unknown"}
- Known Skills: ${context.studentSkills?.join(", ") || "None (absolute beginner)"}

OUTPUT RULES:
- Return ONLY raw JSON matching the schema below. No markdown formatting, no code fences.
- If timeline is <= 3 months -> 3 phases, 6 months -> 4 phases, >= 1 year -> 5 phases
- Milestones per phase: 3-5. Resources per milestone: 2-4.
- Each milestone MUST have practiceTask and completionCriteria.
- tips: 4 practical, topic-specific tips.
- YouTube: prefer Apna College, CodeWithHarry, Kunal Kushwaha, Striver, Jenny's Lectures.
- Free courses: prefer NPTEL, Coursera free audit, freeCodeCamp, CS50.
- First phase: absolute zero. Last phase: real-world project.

Expected JSON format:
{
  "meta": {
    "topic": "${context.topic}",
    "goal": "${context.studentGoals || "General upskilling"}",
    "timeline": "${context.timeline} months",
    "totalWeeks": ${Number(context.timeline) * 4},
    "hoursPerWeek": ${context.hoursPerWeek},
    "level": "${context.currentLevel}"
  },
  "summary": "string",
  "tips": ["string", "string"],
  "phases": [
    {
      "phaseNumber": 1,
      "title": "string",
      "theme": "string",
      "durationWeeks": 4,
      "weeklyGoal": "string",
      "milestones": [
        {
          "id": "unique string",
          "title": "string",
          "description": "string",
          "why": "string",
          "difficulty": "beginner|intermediate|advanced",
          "skills": ["string"],
          "estimatedHours": 10,
          "practiceTask": "string",
          "completionCriteria": "string",
          "status": "upcoming",
          "resources": [
            {
              "title": "string",
              "url": "https://...",
              "type": "youtube|nptel|coursera|docs|article|practice|course|video",
              "estimatedMinutes": 60,
              "isPrimary": true
            }
          ]
        }
      ]
    }
  ],
  "flatMilestones": [
    {
      "id": "same unique string",
      "title": "string",
      "phaseNumber": 1,
      "estimatedHours": 10
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Gemini API failed, returning mock roadmap. Error:", error);
    return {
      meta: {
        topic: context.topic,
        goal: context.studentGoals || "Upskilling",
        timeline: context.timeline + " months",
        totalWeeks: Number(context.timeline) * 4,
        hoursPerWeek: context.hoursPerWeek,
        level: context.currentLevel
      },
      summary: "This is a fallback generated roadmap because the Gemini API key was invalid. To get real AI generation, please configure a valid VITE_GEMINI_API_KEY.",
      tips: ["Practice coding daily", "Read documentation"],
      phases: [
        {
          phaseNumber: 1,
          title: "Foundation",
          theme: "Master the Basics",
          durationWeeks: 4,
          weeklyGoal: "Complete the introductory concepts.",
          milestones: [
            {
              id: "mock-1",
              title: "Learn the Fundamentals",
              description: "Build a strong foundation in the core principles of your domain.",
              why: "Essential before moving to advanced topics.",
              difficulty: "beginner",
              skills: ["Basics"],
              estimatedHours: 15,
              practiceTask: "Create a simple hello world app.",
              completionCriteria: "Can explain the basic concepts without looking at notes.",
              status: "active",
              resources: [
                { title: "Crash Course", url: "https://youtube.com", type: "youtube", estimatedMinutes: 60, isPrimary: true }
              ]
            }
          ]
        }
      ],
      flatMilestones: [
        { id: "mock-1", title: "Learn the Fundamentals", phaseNumber: 1, estimatedHours: 15 }
      ]
    };
  }
}
