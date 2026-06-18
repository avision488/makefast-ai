'use strict';

const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { askAI } = require('../services/ai');
const { saveToHistory } = require('../services/storage');
const display = require('../utils/display');
const logger = require('../utils/logger');

module.exports = async function(opts) {
  display.section('Startup Idea Generator');

  let niche = opts.niche;
  let count = parseInt(opts.count) || 3;
  let style = 'any type';

  if (!niche) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'niche',
        message: chalk.cyan('What niche or industry? (leave blank for random):'),
        default: 'any industry',
      },
      {
        type: 'list',
        name: 'count',
        message: chalk.cyan('How many ideas?'),
        choices: ['1', '3', '5', '10'],
        default: '3',
      },
      {
        type: 'list',
        name: 'style',
        message: chalk.cyan('Idea style:'),
        choices: [
          { name: '🚀 B2B SaaS', value: 'B2B SaaS' },
          { name: '🛍️ Consumer App', value: 'Consumer App' },
          { name: '🤖 AI-First Product', value: 'AI-First Product' },
          { name: '🛠️ Developer Tool', value: 'Developer Tool' },
          { name: '🌍 Any', value: 'any type' },
        ],
      },
    ]);
    niche = ans.niche;
    count = parseInt(ans.count);
    style = ans.style;
  }

  const spinner = ora({ text: chalk.cyan('Generating startup ideas...'), spinner: 'dots2' }).start();

  const systemMsg = `You are a seasoned startup strategist and product visionary. 
You generate specific, concrete startup ideas with clear value propositions.
Format each idea clearly with: Name, Tagline, Problem, Solution, Target Market, Revenue Model, and Unfair Advantage.
Be creative but practical. Avoid vague concepts.`;

  const userMsg = `Generate ${count} ${style} startup idea${count > 1 ? 's' : ''} in the "${niche}" space.

For each idea, provide:
- 💡 **Name**: Catchy product name
- 🎯 **Tagline**: One punchy sentence  
- 🔥 **Problem**: Specific pain point being solved
- 🛠️ **Solution**: How it solves it (2-3 sentences)
- 👥 **Target Market**: Who exactly is this for
- 💰 **Revenue Model**: How it makes money
- ⚡ **Unfair Advantage**: Why this could win

Make each idea distinct and genuinely interesting. Real-world viable.`;

  try {
    const result = await askAI(systemMsg, userMsg, { maxTokens: 2048 });
    spinner.succeed(chalk.green('Ideas generated!'));
    display.showResult(result, `💡 Startup Ideas · ${niche} · ${style}`);
    const id = await saveToHistory('idea', `niche: ${niche}, style: ${style}`, result);
    display.savedMsg(id);
    logger.info('idea generated', { niche, style, count });
  } catch (err) {
    spinner.fail(chalk.red('Failed to generate ideas'));
    display.showError(err.message);
    logger.error('idea failed', { error: err.message });
  }
};