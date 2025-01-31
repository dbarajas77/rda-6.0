import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { scenarios, documents } from "@db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mock documents data
const mockDocuments = [
  {
    id: "1",
    name: "HOA Bylaws 2024",
    description: "Updated bylaws for the year 2024",
    category: "bylaws",
    createdAt: "2024-01-15",
    size: "2.4 MB",
    url: "https://www.africau.edu/images/default/sample.pdf"
  },
  {
    id: "2",
    name: "Q4 2023 Meeting Minutes",
    description: "Board meeting minutes from Q4 2023",
    category: "minutes",
    createdAt: "2023-12-20",
    size: "1.1 MB",
    url: "https://www.africau.edu/images/default/sample.pdf"
  },
  {
    id: "3",
    name: "Annual Financial Report",
    description: "Financial report for fiscal year 2023",
    category: "financial",
    createdAt: "2024-01-10",
    size: "3.2 MB",
    url: "https://www.africau.edu/images/default/sample.pdf"
  },
  {
    id: "4",
    name: "Maintenance Request Form",
    description: "Standard form for maintenance requests",
    category: "forms",
    createdAt: "2024-01-20",
    size: "521 KB",
    url: "https://www.africau.edu/images/default/sample.pdf"
  }
];

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // AI Analysis endpoint
  app.post("/api/analysis/financial", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { data } = req.body;

      const prompt = `Analyze this HOA financial data and provide insights:
      ${JSON.stringify(data)}

      Please provide:
      1. Key financial health indicators
      2. Recommendations for reserve fund allocation
      3. Potential risks and mitigation strategies
      4. Long-term financial projections`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert HOA financial analyst assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const analysis = completion.choices[0].message.content;
      res.json({ analysis });
    } catch (error: any) {
      console.error('AI Analysis Error:', error);
      res.status(500).json({ 
        error: "Failed to generate analysis",
        details: error.message 
      });
    }
  });

  // Documents API
  app.get("/api/documents", async (req, res) => {
    // Return mock data for now
    res.json(mockDocuments);
  });

  app.post("/api/documents/upload", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      // Handle file upload logic here
      res.json({ message: "File uploaded successfully" });
    } catch (error: any) {
      console.error('Upload Error:', error);
      res.status(500).json({ 
        error: "Failed to upload file",
        details: error.message 
      });
    }
  });

  app.get("/api/documents/:id/download", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const document = mockDocuments.find(d => d.id === req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // In real implementation, stream the file from storage
    res.json({ downloadUrl: document.url });
  });

  // Report Generation endpoint
  app.post("/api/reports/generate", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      // Get user's scenarios and documents
      const userScenarios = await db.query.scenarios.findMany({
        where: eq(scenarios.userId, req.user.id),
        orderBy: (scenarios, { desc }) => [desc(scenarios.createdAt)]
      });

      // Generate comprehensive report using OpenAI
      const reportPrompt = `Generate a comprehensive HOA Reserve Study Report using this data:

      Scenarios: ${JSON.stringify(userScenarios)}

      Please include:
      1. Executive Summary
      2. Current Reserve Status
      3. Financial Analysis and Recommendations
      4. Maintenance Schedule and Timeline
      5. Risk Assessment
      6. Funding Recommendations`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "You are an expert HOA reserve study analyst. Generate a detailed, professional report." 
          },
          { role: "user", content: reportPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2500
      });

      const reportContent = completion.choices[0].message.content;

      // Store the generated report
      const [report] = await db.insert(documents).values({
        name: `Reserve Study Report - ${new Date().toLocaleDateString()}`,
        type: 'report',
        url: '#', // URL would be generated after storing the document
        userId: req.user.id
      }).returning();

      res.json({ 
        message: "Report generated successfully",
        reportId: report.id
      });
    } catch (error: any) {
      console.error('Report Generation Error:', error);
      res.status(500).json({ 
        error: "Failed to generate report",
        details: error.message 
      });
    }
  });

  // Existing routes...
  app.get("/api/scenarios", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const userScenarios = await db.query.scenarios.findMany({
      where: eq(scenarios.userId, req.user.id),
      orderBy: (scenarios, { desc }) => [desc(scenarios.createdAt)]
    });

    res.json(userScenarios);
  });

  app.post("/api/scenarios", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const scenario = await db.insert(scenarios).values({
      ...req.body,
      userId: req.user.id
    }).returning();

    res.json(scenario[0]);
  });

  // Documents API (Original, kept for completeness)
  app.get("/api/documents", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const userDocuments = await db.query.documents.findMany({
      where: eq(documents.userId, req.user.id),
      orderBy: (documents, { desc }) => [desc(documents.createdAt)]
    });

    res.json(userDocuments);
  });

  app.post("/api/documents", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const document = await db.insert(documents).values({
      ...req.body,
      userId: req.user.id
    }).returning();

    res.json(document[0]);
  });

  const httpServer = createServer(app);
  return httpServer;
}