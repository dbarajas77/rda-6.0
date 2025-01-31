
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { scenarios, documents, annotations, annotationReplies } from "@db/schema";
import { eq, and } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mock documents data with permissions
const mockDocuments = [
  {
    id: "1",
    name: "HOA Bylaws 2024",
    description: "Updated bylaws for the year 2024",
    category: "bylaws",
    createdAt: "2024-01-15",
    size: "2.4 MB",
    url: "https://www.africau.edu/images/default/sample.pdf",
    ownerId: "1",
    permissions: [
      { userId: "2", email: "board@example.com", access: "edit" },
      { userId: "3", email: "member@example.com", access: "view" }
    ]
  },
  {
    id: "2",
    name: "Q4 2023 Meeting Minutes",
    description: "Board meeting minutes from Q4 2023",
    category: "minutes",
    createdAt: "2023-12-20",
    size: "1.1 MB",
    url: "https://www.africau.edu/images/default/sample.pdf",
    ownerId: "1",
    permissions: [
      { userId: "4", email: "secretary@example.com", access: "edit" }
    ]
  },
  {
    id: "3",
    name: "Annual Financial Report",
    description: "Financial report for fiscal year 2023",
    category: "financial",
    createdAt: "2024-01-10",
    size: "3.2 MB",
    url: "https://www.africau.edu/images/default/sample.pdf",
    ownerId: "1",
    permissions: [
      { userId: "5", email: "treasurer@example.com", access: "admin" },
      { userId: "6", email: "accountant@example.com", access: "view" }
    ]
  },
  {
    id: "4",
    name: "Maintenance Request Form",
    description: "Standard form for maintenance requests",
    category: "forms",
    createdAt: "2024-01-20",
    size: "521 KB",
    url: "https://www.africau.edu/images/default/sample.pdf",
    ownerId: "1",
    permissions: []
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

  // Components API endpoints
  app.get("/api/components", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const components = await db.query.components.findMany({
        where: eq(components.userId, req.user.id),
        orderBy: (components, { desc }) => [desc(components.createdAt)]
      });
      res.json(components);
    } catch (error: any) {
      console.error('Fetch Components Error:', error);
      res.status(500).json({ 
        error: "Failed to fetch components",
        details: error.message 
      });
    }
  });

  app.post("/api/components", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const [component] = await db.insert(components).values({
        ...req.body,
        userId: req.user.id
      }).returning();
      res.json(component);
    } catch (error: any) {
      console.error('Create Component Error:', error);
      res.status(500).json({ 
        error: "Failed to create component",
        details: error.message 
      });
    }
  });

  // Database Components API
  app.get("/api/database/components", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { data, error } = await supabase
        .from('database_components')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Failed to fetch database components",
        details: error.message 
      });
    }
  });

  app.post("/api/database/components", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { data, error } = await supabase
        .from('database_components')
        .insert([{
          name: req.body.name,
          category: req.body.category,
          useful_life: req.body.usefulLife,
          current_cost: req.body.currentCost,
          description: req.body.description,
          image_url: req.body.imageUrl
        }])
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Failed to create database component",
        details: error.message 
      });
    }
  });

  app.put("/api/database/components/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { data, error } = await supabase
        .from('database_components')
        .update({
          name: req.body.name,
          category: req.body.category,
          useful_life: req.body.usefulLife,
          current_cost: req.body.currentCost,
          description: req.body.description,
          image_url: req.body.imageUrl
        })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Failed to update database component",
        details: error.message 
      });
    }
  });

  app.delete("/api/database/components/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { error } = await supabase
        .from('database_components')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ 
        error: "Failed to delete database component",
        details: error.message 
      });
    }
  });

  app.delete("/api/components/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      await db.delete(components)
        .where(and(
          eq(components.id, parseInt(req.params.id)),
          eq(components.userId, req.user.id)
        ));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete Component Error:', error);
      res.status(500).json({ 
        error: "Failed to delete component",
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

  // Documents API (Original)
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

  // Annotation Routes
  app.post("/api/documents/:documentId/annotations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const [annotation] = await db.insert(annotations).values({
        documentId: parseInt(req.params.documentId),
        userId: req.user.id,
        content: req.body.content,
        position: req.body.position,
        type: req.body.type,
        metadata: req.body.metadata
      }).returning();

      res.json(annotation);
    } catch (error: any) {
      console.error('Annotation Creation Error:', error);
      res.status(500).json({ 
        error: "Failed to create annotation",
        details: error.message 
      });
    }
  });

  app.get("/api/documents/:documentId/annotations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const documentAnnotations = await db.query.annotations.findMany({
        where: eq(annotations.documentId, parseInt(req.params.documentId)),
        with: {
          user: true,
          replies: {
            with: {
              user: true
            },
            orderBy: (replies, { asc }) => [asc(replies.createdAt)]
          }
        },
        orderBy: (annotations, { desc }) => [desc(annotations.createdAt)]
      });

      res.json(documentAnnotations);
    } catch (error: any) {
      console.error('Fetch Annotations Error:', error);
      res.status(500).json({ 
        error: "Failed to fetch annotations",
        details: error.message 
      });
    }
  });

  app.post("/api/annotations/:annotationId/replies", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const [reply] = await db.insert(annotationReplies).values({
        annotationId: parseInt(req.params.annotationId),
        userId: req.user.id,
        content: req.body.content
      }).returning();

      res.json(reply);
    } catch (error: any) {
      console.error('Reply Creation Error:', error);
      res.status(500).json({ 
        error: "Failed to create reply",
        details: error.message 
      });
    }
  });

  app.delete("/api/annotations/:annotationId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      // First delete all replies
      await db.delete(annotationReplies)
        .where(eq(annotationReplies.annotationId, parseInt(req.params.annotationId)));

      // Then delete the annotation
      await db.delete(annotations)
        .where(and(
          eq(annotations.id, parseInt(req.params.annotationId)),
          eq(annotations.userId, req.user.id)
        ));

      res.json({ success: true });
    } catch (error: any) {
      console.error('Annotation Deletion Error:', error);
      res.status(500).json({ 
        error: "Failed to delete annotation",
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
