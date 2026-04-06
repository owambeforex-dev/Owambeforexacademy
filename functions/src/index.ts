import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();
const db = admin.firestore();

// Email transporter configuration
// These should be set using: firebase functions:config:set email.user="your-email@gmail.com" email.pass="your-app-password"
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email?.user,
    pass: functions.config().email?.pass,
  },
});

async function sendEmail(to: string, subject: string, text: string, html: string) {
  const mailOptions = {
    from: `"Owambe Forex Academy" <${functions.config().email?.user}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export const onAccountManagementStatusChange = functions.firestore
  .document('accountManagementApplications/{appId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    if (newData.status !== oldData.status) {
      const userId = newData.userId;
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();

      if (userData && userData.email) {
        const subject = `Account Management Application Status Update`;
        const text = `Hello ${userData.firstName || 'Trader'},\n\nYour account management application status has been updated to: ${newData.status}.\n\nBest regards,\nOwambe Forex Academy Team`;
        const html = `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #ffa200;">Status Update</h2>
            <p>Hello <strong>${userData.firstName || 'Trader'}</strong>,</p>
            <p>Your account management application status has been updated to: <span style="font-weight: bold; color: #ffa200;">${newData.status}</span>.</p>
            <p>Log in to your dashboard to see more details.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #777;">Best regards,<br>Owambe Forex Academy Team</p>
          </div>
        `;

        await sendEmail(userData.email, subject, text, html);
      }
    }
  });

export const onWithdrawalStatusChange = functions.firestore
  .document('withdrawals/{withdrawalId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    if (newData.status === 'Approved' && oldData.status !== 'Approved') {
      const userId = newData.userId;
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();

      if (userData && userData.email) {
        const subject = `Withdrawal Request Approved`;
        const text = `Hello ${userData.firstName || 'Trader'},\n\nYour withdrawal request for $${newData.amount} has been approved and processed.\n\nBest regards,\nOwambe Forex Academy Team`;
        const html = `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #ffa200;">Withdrawal Approved</h2>
            <p>Hello <strong>${userData.firstName || 'Trader'}</strong>,</p>
            <p>Your withdrawal request for <span style="font-weight: bold; color: #ffa200;">$${newData.amount}</span> has been approved and processed.</p>
            <p>The funds should reflect in your wallet shortly.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #777;">Best regards,<br>Owambe Forex Academy Team</p>
          </div>
        `;

        await sendEmail(userData.email, subject, text, html);
      }
    }
  });

export const distributeDailyProfits = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const now = new Date();
  const investmentsRef = db.collection('investments');
  const activeInvestments = await investmentsRef.where('status', '==', 'Active').get();

  const batch = db.batch();

  activeInvestments.forEach((doc) => {
    const investment = doc.data();
    const userId = investment.userId;
    const dailyPercent = investment.dailyPercent;
    const amount = investment.amount;
    
    // Calculate profit
    const dailyProfit = (amount * dailyPercent) / 100;

    // Update Investment Document
    const newTotalProfit = (investment.totalProfit || 0) + dailyProfit;
    batch.update(doc.ref, {
      totalProfit: newTotalProfit,
      lastProfitTime: now.toISOString()
    });

    // Update Wallet Document
    const walletRef = db.collection('wallets').doc(userId);
    batch.update(walletRef, {
      balance: admin.firestore.FieldValue.increment(dailyProfit),
      totalProfit: admin.firestore.FieldValue.increment(dailyProfit)
    });

    // Record Profit Transaction
    const profitRef = db.collection('profits').doc();
    batch.set(profitRef, {
      userId: userId,
      investmentId: doc.id,
      amount: dailyProfit,
      timestamp: now.toISOString()
    });
  });

  await batch.commit();
  console.log(`Distributed profits to ${activeInvestments.size} active investments.`);
});
