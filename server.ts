import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf-8'));

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}
const db = admin.firestore(firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/rate", async (req, res) => {
    const { userId, rating } = req.body;

    if (!userId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      const userData = userDoc.data();
      if (userData?.rating) {
        return res.status(400).json({ error: "User has already rated" });
      }

      await userRef.update({
        rating: rating,
        ratedAt: new Date().toISOString()
      });

      res.json({ success: true, rating });
    } catch (error) {
      console.error("Error saving rating:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
