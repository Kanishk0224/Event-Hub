require('dotenv').config();
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const SMTP_USER = process.env.SMTP_USER || 'your-email@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || '';

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER ? `whatsapp:${process.env.TWILIO_PHONE_NUMBER}` : 'whatsapp:+17372508034';
const TWILIO_SANDBOX_FROM = 'whatsapp:+14155238886';

async function testEmail() {
  console.log('--- 1. Testing Live Gmail SMTP Email Delivery ---');
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"EventHub Platform" <${SMTP_USER}>`,
      to: 'kanishkappu4@gmail.com',
      subject: '🎟️ EventHub Live Ticket Pass & Registration Confirmed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🎟️ Registration Confirmed!</h1>
          </div>
          <p style="color: #374151; font-size: 15px;">Hi <strong>Kanishk</strong>,</p>
          <p style="color: #374151;">You have successfully registered for <strong>Tech Odyssey National Hackathon 2026</strong>!</p>
          <div style="background: #f0fdf4; padding: 16px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #15803d;">🎫 Ticket ID: #EH-2026-98231</p>
            <p style="margin: 0 0 4px 0; color: #374151;">📅 Date: Oct 15, 2026</p>
            <p style="margin: 0; color: #374151;">📍 Venue: Main Auditorium, Tech Hub</p>
          </div>
          <p style="color: #6b7280; font-size: 13px;">Show your QR code pass at the venue entrance. See you there! 🚀</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 11px; text-align: center;">EventHub Platform · Live Real Email Notification System</p>
        </div>
      `
    });

    console.log('✅ EMAIL TEST PASSED! Message sent to kanishkappu4@gmail.com, ID:', info.messageId);
    return true;
  } catch (err) {
    console.error('❌ EMAIL TEST FAILED:', err.message);
    return false;
  }
}

async function testWhatsApp(fromNumber) {
  console.log(`\n--- 2. Testing WhatsApp from ${fromNumber} to whatsapp:+916374760093 ---`);
  try {
    const client = twilio(TWILIO_SID, TWILIO_TOKEN);
    const msg = await client.messages.create({
      from: fromNumber,
      to: 'whatsapp:+916374760093',
      body: '🎟️ *EventHub Registration Confirmed!*\n\nHello Kanishk,\nYour pass for *Tech Odyssey 2026* is confirmed!\n\n🎫 *Ticket ID:* #EH-2026-98231\n📍 *Venue:* Main Auditorium\n\n_Powered by EventHub Platform_'
    });
    console.log('✅ WHATSAPP TEST PASSED! SID:', msg.sid, 'Status:', msg.status);
    return true;
  } catch (err) {
    console.error('❌ WHATSAPP FAILED:', err.message, '| Code:', err.code);
    return false;
  }
}

async function run() {
  await testEmail();
  await testWhatsApp(TWILIO_FROM);
  await testWhatsApp(TWILIO_SANDBOX_FROM);
}

run();
