'use strict';

const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { askAI } = require('../services/ai');
const { saveToHistory } = require('../services/storage');
const display = require('../utils/display');
const logger = require('../utils/logger');

module.exports = async function(opts) {
  display.section('Landing Page Copy Generator');

  let product = opts.product;
  let audience = 'developers and founders';
  let tone = '🔥 Bold & Direct';
  let sections = ['Hero (headline + subheadline + CTA)', 'Features (3-5 key features)', 'Footer CTA'];

  if (!product) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'product',
        message: chalk.cyan('Product name or description:'),
        validate: v => v.trim().length > 2 || 'Please enter a product name',
      },
      {
        type: 'input',
        name: 'audience',
        message: chalk.cyan('Target audience?'),
        default: 'developers and founders',
      },
      {
        type: 'list',
        name: 'tone',
        message: chalk.cyan('Copy tone:'),
        choices: [
          '🔥 Bold & Direct',
          '💼 Professional & Trustworthy',
          '😎 Casual & Friendly',
          '🧪 Technical & Precise',
          '✨ Inspirational & Emotional',
        ],
      },
      {
        type: 'checkbox',
        name: 'sections',
        message: chalk.cyan('Which sections do you need?'),
        choices: [
          { name: 'Hero (headline + subheadline + CTA)', checked: true },
          { name: 'Features (3-5 key features)', checked: true },
          { name: 'Social Proof / Testimonials', checked: false },
          { name: 'Pricing Section Copy', checked: false },
          { name: 'FAQ Section', checked: false },
          { name: 'Footer CTA', checked: true },
          { name: 'Meta Tags (SEO title + description)', checked: false },
        ],
      },
    ]);
    product = ans.product;
    audience = ans.audience;
    tone = ans.tone;
    sections = ans.sections;
  }

  const spinner = ora({ text: chalk.cyan('Writing copy...'), spinner: 'bouncingBar' }).start();

  const systemMsg = `You are a world-class copywriter who has written landing pages for YC startups and top SaaS companies.
You write concise, punchy, conversion-focused copy. You understand psychology, urgency, and clarity.
Avoid clichés like "revolutionize", "game-changer", "paradigm shift". Be specific and direct.`;

  const userMsg = `Write landing page copy for: "${product}"
Target audience: ${audience}
Tone: ${tone}
Sections needed: ${sections.join(', ')}

For each section:
- Provide multiple headline options (A/B variants where applicable)
- Include specific, benefit-focused copy
- Add micro-copy (button text, tooltips, captions) where relevant
- For features: specific, concrete benefit statements - not vague claims

Keep it real. No buzzwords. Make it convert.`;

  try {
    const result = await askAI(systemMsg, userMsg, { maxTokens: 2500, temperature: 0.8 });
    spinner.succeed(chalk.green('Copy generated!'));
    display.showResult(result, `✍️ Landing Page Copy · ${product}`);
    const id = await saveToHistory('copy', `product: ${product}, tone: ${tone}`, result);
    display.savedMsg(id);
    logger.info('copy generated', { product, tone });
  } catch (err) {
    spinner.fail(chalk.red('Failed to generate copy'));
    display.showError(err.message);
    logger.error('copy failed', { error: err.message });
  }
};