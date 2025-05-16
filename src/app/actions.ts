'use server';

/**
 * Server action to send a message to n8n webhook
 * @param message The message text to send
 * @returns Response details or error information
 */
export async function sendMessageToWebhook(message: string) {
  try {
    const response = await fetch('https://widd.ai/webhook/7afd6285-3ca0-49f6-9308-f8413abbf587/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput : message,
        action: "sendMessage",
        sessionId: "newsessionasdasa",
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    
    // Parse the response format from the webhook
    // The format appears to be a direct array of objects with an 'output' property
    if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].output) {
      return { 
        success: true, 
        responseText: responseData[0].output
      };
    }
    
    return { success: true, responseText: "Message received but no valid response format returned." };
  } catch (error) {
    console.error('Error sending message to webhook:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
