'use strict';

const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const gradient = require('gradient-string');
const { askAI } = require('../services/ai');
const { saveToHistory } = require('../services/storage');
const display = require('../utils/display');
const logger = require('../utils/logger');

module.exports = async function(opts) {
  display.section('Launch Tweet Generator');

  console.log(chalk.gray('\n  Generate a viral tweet thread for your launch.\n'));

  let product = opts.product;
  let format = 'thread';
  let goal = 'launch announcement';

  if (!product) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'product',
        message: chalk.cyan('What are you launching?'),
        validate: v => v.trim().length > 3 || 'Tell me what you\'re launching',
      },
      {
        type: 'input',
        name: 'audience',
        message: chalk.cyan('Who is it for?'),
        default: 'developers and founders',
      },
      {
        type: 'input',
        name: 'hook',
        message: chalk.cyan('Any specific hook, stat, or story to include? (or leave blank):'),
        default: '',
      },
      {
        type: 'list',
        name: 'format',
        message: chalk.cyan('Format:'),
        choices: [
          { name: '🧵 Tweet thread (5-8 tweets)', value: 'thread' },
          { name: '🐦 Single launch tweet', value: 'single' },
          { name: '📦 Both - single + thread', value: 'both' },
        ],
      },
      {
        type: 'list',
        name: 'goal',
        message: chalk.cyan('Primary goal:'),
        choices: [
          { name: '🚀 Launch announcement - get first users', value: 'launch announcement, drive signups' },
          { name: '💬 Build in public - share the journey', value: 'build in public, show progress and authenticity' },
          { name: '🔥 Go viral - maximize retweets', value: 'maximum virality, controversial or surprising angle' },
          { name: '🎯 Drive waitlist signups', value: 'waitlist signups, create urgency and FOMO' },
        ],
      },
      {
        type: 'list',
        name: 'tone',
        message: chalk.cyan('Tone:'),
        choices: [
          '😎 Casual & real',
          '🔥 Hype & bold',
          '🧠 Thoughtful & educational',
          '😂 Witty & funny',
        ],
      },
    ]);

    product = ans.product;
    opts._audience = ans.audience;
    opts._hook = ans.hook;
    format = ans.format;
    goal = ans.goal;
    opts._tone = ans.tone;
  }

  const audience = opts._audience || 'developers and founders';
  const hook = opts._hook || '';
  const tone = opts._tone || '😎 Casual & real';

  const spinner = ora({ text: chalk.cyan('Writing your tweets...'), spinner: 'dots2' }).start();

  const systemMsg = `You are a viral Twitter/X growth expert who has helped indie hackers, founders, and devs build audiences from zero.
You know what makes tweets go viral: hooks, specificity, relatability, and a clear CTA.
You write like a real person - not a marketer. No buzzwords. No "excited to announce". Real human voice.
Always lead with the strongest hook. Every tweet must make the reader want to see the next one.`;

  let userMsg = `Generate tweet content for: "${product}"
Target audience: ${audience}
Goal: ${goal}
Tone: ${tone}
${hook ? `Hook/angle to use: ${hook}` : ''}
Format requested: ${format}

`;

  if (format === 'single' || format === 'both') {
    userMsg += `## Single Launch Tweet
Write 3 variations of a single launch tweet (max 280 chars each).
Each should have a different angle. Include the tweet text + a suggested image/media description.

`;
  }

  if (format === 'thread' || format === 'both') {
    userMsg += `## Tweet Thread (5-8 tweets)
Write a complete tweet thread. Number each tweet.
- Tweet 1: The hook - most important, must stop the scroll
- Tweet 2: The problem (relatable pain)
- Tweet 3: The solution / what you built
- Tweet 4: How it works or key features
- Tweet 5: Social proof, traction, or story
- Tweet 6: The results / transformation
- Tweet 7: CTA with link placeholder [YOUR_LINK]
- Optional tweet 8: Behind the scenes or personal note

Format each tweet clearly. Keep them under 280 chars. No hashtag spam (1-2 max if any).`;
  }

  try {
    const result = await askAI(systemMsg, userMsg, { maxTokens: 2000, temperature: 0.88 });
    spinner.succeed(chalk.green('Tweets ready!'));

    console.log('\n' + gradient.passion('  🐦 YOUR LAUNCH TWEETS\n'));
    display.showResult(result, `🐦 Tweet${format === 'thread' ? ' Thread' : ''} · ${product}`);

    const id = await saveToHistory('tweet', `product: ${product}, format: ${format}, goal: ${goal}`, result);
    display.savedMsg(id);

    console.log(chalk.gray('\n  Tip: Post the thread 9-11am or 6-8pm in your audience\'s timezone.\n'));
    logger.info('tweet generated', { product, format, goal });
  } catch (err) {
    spinner.fail(chalk.red('Failed to generate tweets'));
    display.showError(err.message);
    logger.error('tweet failed', { error: err.message });
  }
};