'use strict';

const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const gradient = require('gradient-string');
const boxen = require('boxen').default;
const { askAI } = require('../services/ai');
const { saveToHistory } = require('../services/storage');
const display = require('../utils/display');
const logger = require('../utils/logger');

module.exports = async function(opts) {
  display.section('Startup Roast Generator 🔥');

  let idea = opts.idea;
  let intensity = 'medium';

  if (!idea) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'idea',
        message: chalk.cyan('What\'s your startup idea? (be brave):'),
        validate: v => v.trim().length > 3 || 'Give me something to roast',
      },
      {
        type: 'list',
        name: 'intensity',
        message: chalk.cyan('Roast intensity:'),
        choices: [
          { name: '🌶️  Mild - Gentle ribbing', value: 'mild' },
          { name: '🌶️🌶️  Medium - Actually roasted', value: 'medium' },
          { name: '🌶️🌶️🌶️  Hot - Full savage mode', value: 'savage' },
        ],
        default: 'medium',
      },
    ]);
    idea = ans.idea;
    intensity = ans.intensity;
  }

  const intensityDesc = {
    mild: 'Be playfully sarcastic and mildly critical. Friendly roast, like a best friend ribbing you.',
    medium: 'Be genuinely savage with your criticism. Don\'t hold back but keep it funny and insightful.',
    savage: 'Go full Gordon Ramsay. Absolutely destroy this idea. Be brutal, hilarious, and merciless. No feelings were spared in the making of this roast.',
  };

  const spinner = ora({
    text: chalk.red('Warming up the roaster... 🔥'),
    spinner: 'dots',
    color: 'red',
  }).start();

  const systemMsg = `You are a brutally honest, hilarious startup critic - like a combination of a seasoned VC who has seen 10,000 pitch decks and a comedian doing a roast.
You find the genuine flaws, overused ideas, and delusions in startup pitches and mock them mercilessly but with insight.
Your roasts are funny, sharp, and actually useful - the founder should leave laughing but also a bit humbled and wiser.`;

  const userMsg = `Roast this startup idea: "${idea}"

Intensity: ${intensityDesc[intensity]}

Structure your roast as:
🔥 **The Roast** (3-4 paragraphs of pure, hilarious criticism)
💀 **The Top 5 Fatal Flaws** (bullet points, numbered)
🪦 **Startup Obituary** (a 2-sentence mock obituary for when this inevitably fails)
💡 **The Silver Lining** (1-2 sentences - the only kernel of something real in the idea, if any)
🎤 **Mic Drop Line** (one perfect, devastating final zinger)

Go. No mercy.`;

  try {
    const result = await askAI(systemMsg, userMsg, { maxTokens: 1500, temperature: 0.95 });
    spinner.stop();

    console.log('\n' + boxen(gradient.passion('  🎤 THE ROAST IS SERVED  '), {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      borderStyle: 'double',
      borderColor: 'red',
      margin: { top: 0, bottom: 0 },
    }));

    display.showResult(result, `🔥 Startup Roast · "${idea}"`);

    const id = await saveToHistory('roast', `idea: ${idea}, intensity: ${intensity}`, result);
    display.savedMsg(id);
    console.log(chalk.gray('\n  No startups were harmed in the making of this roast.\n'));
    logger.info('roast generated', { idea, intensity });
  } catch (err) {
    spinner.fail(chalk.red('The roaster broke down'));
    display.showError(err.message);
    logger.error('roast failed', { error: err.message });
  }
};