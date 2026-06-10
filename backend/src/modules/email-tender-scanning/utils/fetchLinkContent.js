const axios = require('axios');
const { convert } = require('html-to-text');

async function fetchLinkContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    // We only process if it's text/html or similar to avoid downloading huge binaries
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return `[Non-HTML content type: ${contentType}]`;
    }

    const textContent = convert(response.data, {
      wordwrap: 130,
      selectors: [
        { selector: 'img', format: 'skip' },
        { selector: 'a', options: { ignoreHref: true } }
      ]
    });

    return textContent;
  } catch (error) {
    console.error(`Failed to fetch link content for ${url}:`, error.message);
    return `[Failed to fetch content: ${error.message}]`;
  }
}

module.exports = { fetchLinkContent };
