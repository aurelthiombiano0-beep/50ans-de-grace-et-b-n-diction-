/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "rsvps.json");

app.use(express.json());

// Helper to read RSVPs
function readRSVPs(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading RSVPs file:", err);
  }
  return [];
}

// Helper to write RSVPs
function writeRSVPs(rsvps: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(rsvps, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing RSVPs file:", err);
  }
}

// Ensure the data file exists and is initialized
if (!fs.existsSync(DATA_FILE)) {
  writeRSVPs([]);
}

// API Routes
app.get("/api/rsvps", (req, res) => {
  res.json(readRSVPs());
});

app.post("/api/rsvps", (req, res) => {
  const newRsvp = req.body;
  if (!newRsvp || !newRsvp.id || !newRsvp.name) {
    res.status(400).json({ error: "Invalid RSVP entry" });
    return;
  }
  const current = readRSVPs();
  // Avoid duplicate IDs
  const filtered = current.filter((r) => r.id !== newRsvp.id);
  const updated = [newRsvp, ...filtered];
  writeRSVPs(updated);
  res.json({ success: true, entry: newRsvp });
});

app.post("/api/rsvps/sync", (req, res) => {
  const syncList = req.body;
  if (!Array.isArray(syncList)) {
    res.status(400).json({ error: "Invalid synchronization payload" });
    return;
  }

  const current = readRSVPs();
  const currentMap = new Map(current.map((item) => [item.id, item]));

  let addedCount = 0;
  syncList.forEach((item) => {
    if (item && item.id && !currentMap.has(item.id)) {
      currentMap.set(item.id, item);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    // Write back the merged list, keeping latest entries first
    const mergedList = Array.from(currentMap.values());
    writeRSVPs(mergedList);
  }

  res.json({ success: true, addedCount, total: currentMap.size });
});

app.delete("/api/rsvps/:id", (req, res) => {
  const { id } = req.params;
  const current = readRSVPs();
  const filtered = current.filter((r) => r.id !== id);
  writeRSVPs(filtered);
  res.json({ success: true });
});

// Vite middleware for development
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
