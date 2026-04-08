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
const firebaseConfig = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || process.env.FIREBASE_DATABASE_ID
};

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

  // Auto-bootstrap settings
  const bootstrapSettings = async () => {
    try {
      const settingsRef = firestore.collection("settings").doc("global");
      const settingsDoc = await settingsRef.get();
      if (!settingsDoc.exists) {
        await settingsRef.set({
          roi: { bronze: 23, silver: 27, gold: 30 },
          features: {
            withdrawalsEnabled: true,
            depositsEnabled: true,
            transfersEnabled: true,
            investmentsEnabled: true,
            mentorshipEnabled: true,
            signalsEnabled: true
          },
          prices: {
            mentorship: 500,
            signals: 100
          },
          updatedAt: new Date().toISOString()
        });
        console.log("System settings initialized.");
      }
      
      // Ensure default admin roles
      const admins = [
        { email: "info.realcipher@gmail.com", password: "Iwyy$$^%&2946Caf$$" },
        { email: "owambeforex@gmail.com", password: "Iwyy$$^%&2946Caf$$" } // Also ensure user's email is admin
      ];
      
      for (const adminData of admins) {
        try {
          let adminUser;
          try {
            adminUser = await admin.auth().getUserByEmail(adminData.email);
            // Update password to ensure it matches the bootstrap password
            await admin.auth().updateUser(adminUser.uid, {
              password: adminData.password,
              emailVerified: true
            });
          } catch (e: any) {
            if (e.code === 'auth/user-not-found') {
              adminUser = await admin.auth().createUser({
                email: adminData.email,
                password: adminData.password,
                emailVerified: true,
                displayName: adminData.email === "owambeforex@gmail.com" ? "Owambe Admin" : "Super Admin"
              });
              console.log(`Admin account created: ${adminData.email}`);
            } else {
              throw e;
            }
          }

          const userRef = firestore.collection("users").doc(adminUser.uid);
          const userDoc = await userRef.get();
          
          if (!userDoc.exists) {
            await userRef.set({
              uid: adminUser.uid,
              email: adminData.email,
              role: "super_admin",
              firstName: adminData.email === "owambeforex@gmail.com" ? "Owambe" : "Super",
              lastName: "Admin",
              availableBalance: 0,
              totalProfit: 0,
              totalDeposit: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            console.log(`Admin Firestore document created for ${adminData.email}`);
          } else {
            await userRef.update({ 
              role: "super_admin",
              updatedAt: new Date().toISOString()
            });
            console.log(`Admin role ensured for ${adminData.email}`);
          }
        } catch (error) {
          console.error(`Admin bootstrap error for ${adminData.email}:`, error);
        }
      }
    } catch (error) {
      console.error("Auto-bootstrap failed:", error);
    }
  };
  bootstrapSettings();

  // Admin Middleware
  const verifyAdmin = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userDoc = await firestore.collection("users").doc(decodedToken.uid).get();
      const userData = userDoc.data();
      const isSuperAdmin = userData?.role === "super_admin";
      
      if (!isSuperAdmin) {
        return res.status(403).json({ error: "Forbidden: Super Admin access required" });
      }
      
      req.admin = { ...decodedToken, role: userData?.role };
      next();
    } catch (error) {
      console.error("Admin verification error:", error);
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Admin: Get Analytics
  app.get("/api/admin/analytics", verifyAdmin, async (req, res) => {
    try {
      const usersSnap = await firestore.collection("users").get();
      const txSnap = await firestore.collection("transactions").get();
      const subSnap = await firestore.collection("subscriptions").get();

      const totalUsers = usersSnap.size;
      let totalDeposits = 0;
      let totalWithdrawals = 0;
      
      txSnap.forEach(doc => {
        const data = doc.data();
        if (data.type === "deposit" && data.status === "completed") totalDeposits += data.amount;
        if (data.type === "withdrawal" && data.status === "completed") totalWithdrawals += data.amount;
      });

      const activeServices = subSnap.docs.filter(doc => doc.data().status === "active").length;

      res.json({
        totalUsers,
        totalDeposits,
        totalWithdrawals,
        activeServices,
        newUsersToday: 0, // Simplified
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Admin: Manage User (Ban/Unban/Balance)
  app.post("/api/admin/user/:uid/action", verifyAdmin, async (req, res) => {
    const { action, value } = req.body;
    const { uid } = req.params;

    try {
      const userRef = firestore.collection("users").doc(uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

      const adminLogRef = firestore.collection("adminLogs").doc();
      const logData = {
        adminId: (req as any).admin.uid,
        adminEmail: (req as any).admin.email,
        action,
        targetUserId: uid,
        details: { value },
        timestamp: new Date().toISOString()
      };

      if (action === "ban") {
        await userRef.update({ isBanned: true });
      } else if (action === "unban") {
        await userRef.update({ isBanned: false });
      } else if (action === "adjust_balance") {
        await userRef.update({ availableBalance: admin.firestore.FieldValue.increment(value) });
        // Record as transaction
        await firestore.collection("transactions").add({
          userId: uid,
          type: value > 0 ? "deposit" : "withdrawal",
          amount: Math.abs(value),
          status: "completed",
          details: { note: "Admin adjustment" },
          createdAt: new Date().toISOString()
        });
      }

      await adminLogRef.set(logData);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Action failed" });
    }
  });

  // Admin: Approve/Reject Transaction
  app.post("/api/admin/transaction/:txId/:action", verifyAdmin, async (req, res) => {
    const { txId, action } = req.params;
    try {
      const txRef = firestore.collection("transactions").doc(txId);
      const txDoc = await txRef.get();
      if (!txDoc.exists) return res.status(404).json({ error: "Transaction not found" });

      const txData = txDoc.data();
      if (txData?.status !== "pending") return res.status(400).json({ error: "Transaction already processed" });

      if (action === "approve") {
        await firestore.runTransaction(async (t) => {
          t.update(txRef, { status: "completed", updatedAt: new Date().toISOString() });
          
          if (txData?.type === "deposit") {
            const userRef = firestore.collection("users").doc(txData.userId);
            t.update(userRef, { 
              availableBalance: admin.firestore.FieldValue.increment(txData.amount),
              totalDeposit: admin.firestore.FieldValue.increment(txData.amount)
            });
          }
        });
      } else {
        await txRef.update({ status: "rejected", updatedAt: new Date().toISOString() });
      }

      // Log action
      await firestore.collection("adminLogs").add({
        adminId: (req as any).admin.uid,
        action: `transaction_${action}`,
        targetUserId: txData?.userId,
        details: { txId },
        timestamp: new Date().toISOString()
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Action failed" });
    }
  });

  // Background Task: Daily Profit & Expiry (Simulated Cron)
  const runDailyTasks = async () => {
    console.log("Running daily tasks: Profit distribution & Expiry checks...");
    try {
      const settingsDoc = await firestore.collection("settings").doc("global").get();
      const settings = settingsDoc.data() || { roi: { bronze: 23, silver: 27, gold: 30 } };

      const subSnap = await firestore.collection("subscriptions")
        .where("serviceType", "==", "investment")
        .where("status", "==", "active")
        .get();

      const batch = firestore.batch();
      const now = new Date();

      for (const doc of subSnap.docs) {
        const sub = doc.data();
        const plan = sub.planId?.toLowerCase() || "bronze";
        const annualROI = settings.roi[plan] || 23;
        const dailyProfit = (sub.amount * (annualROI / 100)) / 365;

        // Add profit to user
        const userRef = firestore.collection("users").doc(sub.userId);
        batch.update(userRef, { 
          availableBalance: admin.firestore.FieldValue.increment(dailyProfit),
          totalProfit: admin.firestore.FieldValue.increment(dailyProfit)
        });

        // Record profit transaction
        const txRef = firestore.collection("transactions").doc();
        batch.set(txRef, {
          userId: sub.userId,
          type: "profit",
          amount: dailyProfit,
          status: "completed",
          details: { subId: doc.id, planName: sub.planName },
          createdAt: now.toISOString()
        });

        // Check expiry
        if (sub.endDate && new Date(sub.endDate) <= now) {
          batch.update(doc.ref, { status: "completed" });
        }
      }

      // Handle other service expiries
      const otherSubSnap = await firestore.collection("subscriptions")
        .where("status", "==", "active")
        .get();
      
      otherSubSnap.forEach(doc => {
        const sub = doc.data();
        if (sub.serviceType !== "investment" && sub.endDate && new Date(sub.endDate) <= now) {
          batch.update(doc.ref, { status: "expired" });
        }
      });

      await batch.commit();
      console.log("Daily tasks completed successfully.");
    } catch (error) {
      console.error("Daily tasks error:", error);
    }
  };

  // Run every 24 hours (86400000 ms)
  // For testing, we could run it more frequently or trigger via endpoint
  setInterval(runDailyTasks, 24 * 60 * 60 * 1000);

  // Trigger tasks manually (for testing)
  app.post("/api/admin/trigger-tasks", verifyAdmin, async (req, res) => {
    await runDailyTasks();
    res.json({ success: true });
  });

  // Bootstrap: Initialize Admin & Settings (One-time use)
  app.post("/api/bootstrap", async (req, res) => {
    const { secret } = req.body;
    const masterKey = process.env.VITE_BOOTSTRAP_SECRET || "owambe_master_key";
    if (secret !== masterKey) return res.status(403).json({ error: "Invalid secret" });

    try {
      const adminEmail = "owambeforex@gmail.com";
      const userSnap = await firestore.collection("users").where("email", "==", adminEmail).get();
      
      if (!userSnap.empty) {
        const adminUid = userSnap.docs[0].id;
        await firestore.collection("users").doc(adminUid).update({ role: "super_admin" });
      }

      // Initialize Settings
      const settingsRef = firestore.collection("settings").doc("global");
      const settingsDoc = await settingsRef.get();
      if (!settingsDoc.exists) {
        await settingsRef.set({
          roi: { bronze: 23, silver: 27, gold: 30 },
          features: {
            withdrawalsEnabled: true,
            depositsEnabled: true,
            transfersEnabled: true,
            investmentsEnabled: true,
            mentorshipEnabled: true,
            signalsEnabled: true
          },
          prices: {
            mentorship: 500,
            signals: 100
          },
          updatedAt: new Date().toISOString()
        });
      }

      res.json({ success: true, message: "System bootstrapped successfully" });
    } catch (error) {
      res.status(500).json({ error: "Bootstrap failed" });
    }
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
