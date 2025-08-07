interface TelegramMessage {
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
  companyType: string;
  aum: string;
  primaryMarkets: string[];
  currentTools: string;
  teamSize: string;
  location: string;
  biggestChallenge: string;
  interestLevel: string;
  budgetRange: string;
  timestamp: string;
}

export async function sendTelegramNotification(submission: TelegramMessage): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured:', {
      hasBotToken: !!botToken,
      hasChatId: !!chatId,
      nodeEnv: process.env.NODE_ENV
    });
    return false;
  }

  console.log('Attempting to send Telegram notification for:', submission.email);

  try {
    // Format the message
    const message = `🚀 *New Waitlist Lead!*

👤 *Contact Information:*
• Name: ${submission.fullName}
• Email: ${submission.email}
• Company: ${submission.company}
• Job Title: ${submission.jobTitle}

🏢 *Company Details:*
• Type: ${submission.companyType}
• AUM: ${submission.aum}
• Team Size: ${submission.teamSize}
• Location: ${submission.location}

📊 *Trading Information:*
• Primary Markets: ${submission.primaryMarkets.join(', ')}
• Current Tools: ${submission.currentTools || 'Not specified'}

💰 *Business Details:*
• Interest Level: ${submission.interestLevel}
• Budget Range: ${submission.budgetRange}

🎯 *Biggest Challenge:*
${submission.biggestChallenge || 'Not provided'}

⏰ *Submitted:* ${new Date(submission.timestamp).toLocaleString()}

---
Check the admin panel for full details!`;

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        botToken: botToken ? `${botToken.substring(0, 10)}...` : 'missing',
        chatId: chatId
      });
      return false;
    }

    const responseData = await response.json();
    console.log('Telegram notification sent successfully:', {
      messageId: responseData.result?.message_id,
      chatId: chatId
    });
    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      botToken: botToken ? `${botToken.substring(0, 10)}...` : 'missing',
      chatId: chatId
    });
    return false;
  }
}