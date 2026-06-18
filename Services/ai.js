'use strict';

const OpenAI = require('openai');
const { loadConfig } = require('./storage');
const defaults = require('../config/defaults');

let groqClient = null;

// ✅ Async - config se API key bhi read karta hai
async function getGroq() {
  if (!groqClient) {
    const config = await loadConfig();
    const apiKey = process.env.GROQ_API_KEY || config.groqApiKey;

    if (!apiKey) {
      throw new Error('GROQ_API_KEY not set. Run `makefast config` to set it up.');
    }

    groqClient = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return groqClient;
}

async function askAI(systemMsg, userMsg, options) {
  const opts = options || {};

  const config = await loadConfig();
  const model = process.env.GROQ_MODEL || config.model || defaults.model;
  const temp = opts.temperature !== undefined ? opts.temperature : 0.85;
  const tokens = opts.maxTokens || 1024;

  let tries = 0;
  let lastError;

  while (tries <= 2) {
    try {
      const groq = await getGroq(); 
      const res = await groq.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user', content: userMsg },
        ],
        temperature: temp,
        max_tokens: tokens,
      });

      const text = res.choices && res.choices[0] && res.choices[0].message.content;
      if (!text || text.trim() === '') {
        throw new Error('Got an empty response from AI, try again.');
      }
      return text.trim();
    } catch (err) {
      lastError = err;
      tries++;
      if (tries <= 2) {
        await new Promise(r => setTimeout(r, 700 * tries));
      }
    }
  }

  throw lastError;
}

async function chatWithHistory(messages, options) {
  const opts = options || {};

  const config = await loadConfig();
  const model = process.env.GROQ_MODEL || config.model || defaults.model;

  const groq = await getGroq(); 

  const res = await groq.chat.completions.create({
    model: model,
    messages: messages,
    temperature: opts.temperature || 0.85,
    max_tokens: opts.maxTokens || 800,
  });

  const text = res.choices && res.choices[0] && res.choices[0].message.content;
  if (!text || !text.trim()) {
    throw new Error('AI returned nothing. Try again.');
  }
  return text.trim();
}

module.exports = { askAI, chatWithHistory, getGroq };