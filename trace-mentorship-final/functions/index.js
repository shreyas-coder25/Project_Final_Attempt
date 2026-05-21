import { GoogleGenAI, Type } from "@google/genai";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";

initializeApp();

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new HttpsError("failed-precondition", "GEMINI_API_KEY is not configured for Cloud Functions.");
  }
  return new GoogleGenAI({ apiKey });
}

function requireAuth(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in before using AI features.");
  }
}

export const generateRoadmap = onCall(async (request) => {
  requireAuth(request);
  const { domain = "Engineering", skills = [], goals = "Become industry ready", availability = "3-5 hours/week" } = request.data || {};
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Create a practical 6-step roadmap for an Indian engineering student.
Domain: ${domain}
Current skills: ${skills.join(", ") || "beginner"}
Goal: ${goals}
Availability: ${availability}

Each step needs a short title, status, and 2 useful resource suggestions. Keep it realistic for a college student.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                status: { type: Type.STRING },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title", "status", "resources"],
            },
          },
        },
        required: ["roadmap"],
      },
    },
  });
  return JSON.parse(response.text || "{\"roadmap\":[]}");
});

export const generateLearningInsights = onCall(async (request) => {
  requireAuth(request);
  const { domain = "Engineering", skills = [], goals = "Become industry ready" } = request.data || {};
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Give 3 concise, specific learning insights for a student in ${domain}.
Current skills: ${skills.join(", ") || "beginner"}
Goal: ${goals}
Focus on industry readiness, projects, and avoiding confusion.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insights: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["insights"],
      },
    },
  });
  return JSON.parse(response.text || "{\"insights\":[]}");
});

export const assistantReply = onCall(async (request) => {
  requireAuth(request);
  const { domain = "Engineering", skills = [], goals = "Become industry ready", message = "" } = request.data || {};
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are Trace's AI learning companion. Be concise, practical, encouraging, and grounded in industry readiness.
Student domain: ${domain}
Current skills: ${skills.join(", ") || "beginner"}
Goal: ${goals}
Student question: ${message}`,
  });
  return { reply: response.text || "I could not generate a response right now." };
});
