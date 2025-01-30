import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { scenarios, documents } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Scenarios API
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

  // Documents API
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
