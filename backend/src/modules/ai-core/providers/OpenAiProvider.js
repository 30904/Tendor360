const axios = require('axios');
const BaseAiProvider = require('./BaseAiProvider');

class OpenAiProvider extends BaseAiProvider {
  constructor() {
    super('openai', 'OpenAI');
  }

  isConfigured() {
    return Boolean(process.env.OPENAI_API_KEY);
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
