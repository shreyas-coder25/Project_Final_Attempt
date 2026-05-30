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
  studentGraduationYear?: string;
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
- Graduation Year: ${context.studentGraduationYear || "Unknown"}

OUTPUT RULES:
- Return ONLY raw JSON matching the schema below. No markdown formatting, no code fences.
- If timeline is <= 3 months -> 3 phases, 6 months -> 4 phases, >= 1 year -> 5 phases
- Milestones per phase: 3-5. Resources per milestone: 2-4.
- Each milestone MUST have practiceTask and completionCriteria.
- tips: 4 practical, topic-specific tips.
- RESOURCES MUST BE EXTREMELY HIGH QUALITY AND REAL. Do not generate fake URLs.
- For DSA/Coding: prefer Striver, NeetCode, Aditya Verma, Kunal Kushwaha, CS50.
- For Web Dev/Tech: prefer freeCodeCamp, The Odin Project, Traversy Media, Fireship.
- For Core Engineering/Math: prefer NPTEL, Coursera, MIT OpenCourseWare.
- Provide detailed, non-generic descriptions that sound like an expert mentor talking.

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
        topic: "Data Structures & Algorithms",
        goal: "Crack campus placements",
        timeline: "6 months",
        totalWeeks: 24,
        hoursPerWeek: 10,
        level: "Complete beginner"
      },
      summary: "This is a fallback generated roadmap because the Gemini API key was invalid. By the end of this roadmap, you'll be able to solve medium-hard LeetCode problems, understand core CS concepts asked in FAANG/MAANG interviews, and confidently walk into any campus placement test.",
      tips: [
        "Don't rush arrays: Spend 2x more time on Arrays & Strings than you think you need.",
        "NeetCode > random LeetCode: Follow a curated list instead of solving random problems.",
        "Dry run every solution: Always trace through your code by hand before running it.",
        "Revise weekly: Spend the last 30 min of every session re-solving 2 problems from the previous week."
      ],
      phases: [
        {
          phaseNumber: 1,
          title: "Foundation",
          theme: "Time complexity, arrays, strings, and basic problem solving",
          durationWeeks: 5,
          weeklyGoal: "Master Big-O and complete basic Array/String patterns.",
          milestones: [
            {
              id: "p1m1",
              title: "Complexity Analysis & Big-O Notation",
              description: "Understand how to measure algorithm efficiency using Big-O, Big-Ω and Big-Θ notations. Learn to analyze loops, nested loops, and recursive calls.",
              why: "Every single interview question starts with 'what's the time complexity?' — you can't skip this.",
              difficulty: "beginner",
              skills: ["Big-O Notation", "Space Complexity", "Time Analysis"],
              estimatedHours: 8,
              practiceTask: "Given 5 different code snippets, write down the time and space complexity for each. Verify your answers using online resources.",
              completionCriteria: "You can look at any loop structure and state its Big-O complexity within 30 seconds.",
              status: "active",
              resources: [
                { title: "Big-O Notation — Abdul Bari", url: "https://www.youtube.com/watch?v=0IAPZzGSbME", type: "youtube", estimatedMinutes: 62, isPrimary: true },
                { title: "CS50 Week 3 — Algorithms", url: "https://cs50.harvard.edu/x/2024/weeks/3/", type: "docs", estimatedMinutes: 120, isPrimary: false }
              ]
            },
            {
              id: "p1m2",
              title: "Arrays & Sliding Window",
              description: "Master array traversal, in-place operations, two-pointer technique, and sliding window patterns. These appear in 40% of placement tests.",
              why: "Arrays are the single most tested topic in every placement exam and coding round.",
              difficulty: "beginner",
              skills: ["Two Pointers", "Sliding Window", "In-place Ops"],
              estimatedHours: 14,
              practiceTask: "Solve these 5 LeetCode problems without looking at solutions: Best Time to Buy Stock, Maximum Subarray, Two Sum, Contains Duplicate, Product of Array Except Self.",
              completionCriteria: "You can solve Easy-level array problems in under 20 minutes without hints.",
              status: "upcoming",
              resources: [
                { title: "Arrays Playlist — Striver (takeUforward)", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rENwdL0nEH0uHMbZl4Q5f4", type: "youtube", estimatedMinutes: 240, isPrimary: true },
                { title: "LeetCode Array problems — Easy set", url: "https://leetcode.com/tag/array/", type: "practice", estimatedMinutes: 300, isPrimary: false }
              ]
            }
          ]
        },
        {
          phaseNumber: 2,
          title: "Core Structures",
          theme: "Linked lists, stacks, queues, and recursion basics",
          durationWeeks: 6,
          weeklyGoal: "Implement fundamental data structures from scratch.",
          milestones: [
            {
              id: "p2m1",
              title: "Linked Lists — All Patterns",
              description: "Implement singly and doubly linked lists from scratch. Master reversal, cycle detection (Floyd's algorithm), merge, and find middle.",
              why: "Linked list questions test pointer manipulation — a skill that separates students who just use libraries from those who understand memory.",
              difficulty: "beginner",
              skills: ["Pointers", "Floyd's Algorithm", "List Reversal"],
              estimatedHours: 12,
              practiceTask: "Without using built-ins, implement: add node, delete node, reverse list, detect cycle, find middle — all in one clean class.",
              completionCriteria: "You can implement a full linked list with all standard operations from a blank file in under 45 minutes.",
              status: "upcoming",
              resources: [
                { title: "Linked List Full Series — Striver", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0r47RKH7a5-PcpRqaQ3uTmO", type: "youtube", estimatedMinutes: 200, isPrimary: true }
              ]
            }
          ]
        }
      ],
      flatMilestones: []
    };
  }
}
