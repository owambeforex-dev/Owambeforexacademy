import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config
const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const firestore = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(admin.app(), firebaseConfig.firestoreDatabaseId)
  : getFirestore(admin.app());

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Fetch user by UID
  app.get("/api/user/:uid", async (req, res) => {
    try {
      const dbInstance = firestore;
      const userDoc = await dbInstance.collection("users").doc(req.params.uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      const data = userDoc.data();
      res.json({
        uid: data?.uid,
        email: data?.email,
        firstName: data?.firstName,
        lastName: data?.lastName,
        profileImage: data?.profileImage,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Transfer funds
  app.post("/api/transfer", async (req, res) => {
    const { senderId, receiverId, amount, pin } = req.body;

    if (!senderId || !receiverId || !amount || !pin) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ error: "Cannot transfer to yourself" });
    }

    const transferAmount = Number(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    try {
      const dbInstance = firestore;
      await dbInstance.runTransaction(async (transaction) => {
        const senderDocRef = dbInstance.collection("users").doc(senderId);
        const receiverDocRef = dbInstance.collection("users").doc(receiverId);

        const [senderDoc, receiverDoc] = await Promise.all([
          transaction.get(senderDocRef),
          transaction.get(receiverDocRef),
        ]);

        if (!senderDoc.exists) throw new Error("Sender not found");
        if (!receiverDoc.exists) throw new Error("Receiver not found");

        const senderData = senderDoc.data();
        const receiverData = receiverDoc.data();

        if (senderData?.transferPin !== pin) {
          throw new Error("Incorrect Transfer PIN");
        }

        const availableBalance = senderData?.availableBalance || 0;
        if (transferAmount > availableBalance) {
          throw new Error("Insufficient funds");
        }

        // Deduct from sender
        transaction.update(senderDocRef, {
          availableBalance: availableBalance - transferAmount,
        });

        // Add to receiver
        transaction.update(receiverDocRef, {
          availableBalance: (receiverData?.availableBalance || 0) + transferAmount,
        });

        // Record transaction for sender
        const senderTxRef = dbInstance.collection("transactions").doc();
        transaction.set(senderTxRef, {
          userId: senderId,
          type: "transfer",
          subType: "sent",
          amount: transferAmount,
          recipientId: receiverId,
          recipientEmail: receiverData?.email,
          status: "success",
          createdAt: new Date().toISOString(),
        });

        // Record transaction for receiver
        const receiverTxRef = dbInstance.collection("transactions").doc();
        transaction.set(receiverTxRef, {
          userId: receiverId,
          type: "transfer",
          subType: "received",
          amount: transferAmount,
          senderId: senderId,
          senderEmail: senderData?.email,
          status: "success",
          createdAt: new Date().toISOString(),
        });
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Transfer error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Set Transfer PIN
  app.post("/api/set-pin", async (req, res) => {
    const { userId, pin } = req.body;
    if (!userId || !pin) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const dbInstance = firestore;
      await dbInstance.collection("users").doc(userId).update({
        transferPin: pin,
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Set PIN error:", error);
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

startServer();
