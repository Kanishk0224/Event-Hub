require('dotenv').config();
const twilio = require('twilio');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const client = twilio(TWILIO_SID, TWILIO_TOKEN);

const recipient = 'whatsapp:+916374760093';

async function testAlone() {
  console.log('====================================================');
  console.log('       TESTING WHATSAPP MESSAGE ALONE               ');
  console.log('====================================================\n');
  console.log('Recipient Phone:', recipient);

  // Attempt 1: Direct WhatsApp send from +17372508034
  console.log('\n[Attempt 1] Sending from +17372508034 (Your Twilio Virtual Number)...');
  try {
    const msg1 = await client.messages.create({
      from: 'whatsapp:+17372508034',
      to: recipient,
      body: '🎟️ *EventHub WhatsApp Test Pass*\n\nHello Kanishk!\nThis is a standalone test message from EventHub.\n\n🎫 *Ticket:* #EH-STANDALONE-TEST\n📍 *Status:* Active & Connected 🚀'
    });
    console.log('✅ ATTEMPT 1 SUCCESS!');
    console.log('Message SID:', msg1.sid);
    console.log('Status:     ', msg1.status);
    console.log('Date Created:', msg1.dateCreated);
    return;
  } catch (err1) {
    console.log('❌ Attempt 1 Error:', err1.message, '| Code:', err1.code);
  }

  // Attempt 2: Standard Twilio Sandbox +14155238886
  console.log('\n[Attempt 2] Sending from +14155238886 (Twilio Default Sandbox)...');
  try {
    const msg2 = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: recipient,
      body: '🎟️ *EventHub WhatsApp Test Pass*\n\nHello Kanishk!\nThis is a standalone test message from EventHub.\n\n🎫 *Ticket:* #EH-STANDALONE-TEST\n📍 *Status:* Active & Connected 🚀'
    });
    console.log('✅ ATTEMPT 2 SUCCESS!');
    console.log('Message SID:', msg2.sid);
    console.log('Status:     ', msg2.status);
    return;
  } catch (err2) {
    console.log('❌ Attempt 2 Error:', err2.message, '| Code:', err2.code);
  }

  // Attempt 3: Check Twilio Sandbox configuration
  console.log('\n--- Twilio Sandbox & Account Status Check ---');
  try {
    const account = await client.api.v2010.accounts(TWILIO_SID).fetch();
    console.log('Account Name:', account.friendlyName);
    console.log('Account Status:', account.status);
    console.log('Account Type:', account.type);
  } catch (e) {
    console.log('Account fetch error:', e.message);
  }
}

testAlone();
