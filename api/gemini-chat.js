// File: api/gemini-chat.js
// For a real implementation, consider using the Google AI SDK for Node.js:
// npm install @google/generative-ai
import { GoogleGenerativeAI } from "@google/generative-ai";

// If using the SDK, you would initialize it like this:
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // This line is a comment, actual initialization is in the try block

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { message: userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'No message provided in the request body.' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        console.error('GEMINI_API_KEY is not set.');
        return res.status(500).json({ error: 'API key not configured on the server.' });
    }

    // --- Option 1: Using Google AI SDK (Recommended) ---
    // This is a simplified example. Refer to official SDK documentation for details
    // on model selection, safety settings, streaming, etc.
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey); // Corrected initialization if SDK is used
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Or your desired model
        const chat = model.startChat({
            history: [], // You might want to manage chat history
            generationConfig: {
                maxOutputTokens: 250, // Example configuration
            },
        });
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const aiReply = response.text();

        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error('Error calling Gemini API with SDK:', error);
        let errorMessage = 'Failed to get a response from the AI.';
        if (error.message) {
            errorMessage += ` Details: ${error.message}`;
        }
        return res.status(500).json({ error: errorMessage });
    }

    // --- Option 2: Using direct fetch to Gemini REST API (More complex to manage) ---
    // This is a very simplified example. The actual Gemini REST API is more complex.
    // You'd need to construct the correct endpoint and request payload according to
    // the Gemini API documentation.
    // Example (highly simplified, consult official docs for actual structure):
    /*
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`;

    try {
        const geminiResponse = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userMessage
                    }]
                }]
                // Add generationConfig, safetySettings etc. as needed by the API
            }),
        });

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Gemini API Error:', errorData);
            return res.status(geminiResponse.status).json({ error: `Gemini API error: ${errorData.error?.message || 'Unknown error'}` });
        }

        const data = await geminiResponse.json();
        
        // Extract the reply text. This structure depends heavily on the Gemini API version and model.
        // This is a common structure, but you MUST verify with the documentation.
        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not extract reply.";

        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error('Error calling Gemini REST API:', error);
        return res.status(500).json({ error: 'Failed to communicate with the AI service.' });
    }
    */
}
