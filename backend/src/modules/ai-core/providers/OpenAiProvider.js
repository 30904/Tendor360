const axios = require('axios');
const BaseAiProvider = require('./BaseAiProvider');

class OpenAiProvider extends BaseAiProvider {
  constructor() {
    super('openai', 'OpenAI');
  }

  isConfigured() {
    const key = process.env.OPENAI_API_KEY || '';
    // Require the standard OpenAI key prefix so placeholder values like
    // "your-key-here" or an empty string don't falsely report as configured.
    return key.startsWith('sk-') && key.length > 10;
  }

  async summarize(payload) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Summarize the tender opportunity and estimate relevancy from 0 to 100. Return JSON with keys summary and relevancy.'
          },
          {
            role: 'user',
            content: JSON.stringify(payload)
          }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const content = response.data?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return {
      summary: parsed.summary || '',
      classification: { relevancy: Number(parsed.relevancy) || 0 }
    };
  }
}

module.exports = OpenAiProvider;
