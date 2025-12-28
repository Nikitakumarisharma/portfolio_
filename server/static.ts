import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // ✅ correct & vercel-safe path
  const distPath = path.join(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find frontend build at ${distPath}`
    );
  }

  app.use(
    express.static(distPath, {
      index: false,
      setHeaders(res) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
      },
    })
  );

  // SPA fallback
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
