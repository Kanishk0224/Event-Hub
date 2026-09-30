require('dotenv').config();
const twilio = require('twilio');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';

async function listTemplates() {
  const client = twilio(TWILIO_SID, TWILIO_TOKEN);
  try {
    const contents = await client.content.v1.contents.list({ limit: 20 });
    console.log(`Found ${contents.length} Twilio Content Templates:`);
    contents.forEach(c => {
      console.log(`- SID: ${c.sid}, Name: ${c.friendlyName}, Language: ${c.language}`);
    });
    return contents;
  } catch (err) {
    console.error('Failed to list content templates:', err.message);
    return [];
  }
}

async function testWithTemplate() {
  const templates = await listTemplates();
  if (templates.length > 0) {
    const client = twilio(TWILIO_SID, TWILIO_TOKEN);
    const templateSid = templates[0].sid;
    console.log(`\nAttempting send with template SID: ${templateSid}...`);
    try {
      const msg = await client.messages.create({
        from: 'whatsapp:+17372508034',
        to: 'whatsapp:+916374760093',
        contentSid: templateSid,
        contentVariables: JSON.stringify({
          '1': 'Kanishk',
          '2': 'Tech Odyssey 2026',
          '3': 'Main Auditorium'
        })
      });
      console.log('✅ WHATSAPP SENT VIA TEMPLATE! SID:', msg.sid, 'Status:', msg.status);
    } catch (err) {
      console.error('❌ Template send failed:', err.message);
    }
  }
}

testWithTemplate();
