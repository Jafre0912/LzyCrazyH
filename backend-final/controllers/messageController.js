const twilio = require('twilio');
const ChatHistory = require('../models/ChatHistory'); // Import the Mongoose model

// Get credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const twilioSmsNumber = process.env.TWILIO_SMS_NUMBER;

// The old file system functions (readChatHistory, writeChatHistory) are removed.

exports.sendMessage = async (req, res) => {
  try {
    const { message, numbers } = req.body;
    const parsedNumbers = JSON.parse(numbers);
    const imageFile = req.file;

    const sendPromises = parsedNumbers.map(async (number) => {
      try {
        await client.messages.create({
          body: message,
          from: twilioWhatsAppNumber,
          to: `whatsapp:${number}`,
          mediaUrl: imageFile ? [imageFile.path] : [] 
        });
        return { type: 'WhatsApp', status: 'success', number };
      } catch (error) {
        if (error.code === 63016) { // Fallback to SMS if number is not on WhatsApp
          try {
            await client.messages.create({
              body: message,
              from: twilioSmsNumber,
              to: number
            });
            return { type: 'SMS', status: 'success', number };
          } catch (smsError) {
            return { type: 'SMS', status: 'failed', number, reason: smsError.message };
          }
        } else {
          return { type: 'WhatsApp', status: 'failed', number, reason: error.message };
        }
      }
    });

    const results = await Promise.all(sendPromises);

    let whatsappSent = 0;
    let smsSent = 0;
    let failed = 0;
    results.forEach(r => {
      if (r.status === 'success' && r.type === 'WhatsApp') whatsappSent++;
      if (r.status === 'success' && r.type === 'SMS') smsSent++;
      if (r.status === 'failed') failed++;
    });

    const summaryMessage = `Processing complete. Sent ${whatsappSent} WhatsApp and ${smsSent} SMS messages. ${failed} messages failed.`;

    // This block now saves the record directly to your MongoDB database
    if (whatsappSent > 0 || smsSent > 0) {
      const newRecord = new ChatHistory({
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase(),
        totalMessage: whatsappSent + smsSent,
        messageType: 'Campaign'
      });
      await newRecord.save(); // Save the new record
    }

    res.status(200).json({ success: true, message: summaryMessage, results });
  } catch (error) {
    console.error('Error in sendMessage controller:', error);
    res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  }
};