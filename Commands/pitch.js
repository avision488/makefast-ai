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
  display.section('Investor Pitch Deck Generator');

  console.log(chalk.gray('\n  Generate a full pitch deck outline ready for slides or a doc.\n'));

  let startup = opts.startup;
  let stage = 'Pre-seed';
  let raising = '$500k';
  let traction = 'none yet';

  if (!startup) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'startup',
        message: chalk.cyan('What is your startup? (name + one sentence):'),
        validate: v => v.trim().length > 5 || 'Give me a bit more to work with',
      },
      {
        type: 'input',
        name: 'problem',
        message: chalk.cyan('What problem does it solve?'),
        validate: v => v.trim().length > 5 || 'Describe the problem',
      },
      {
        type: 'input',
        name: 'audience',
        message: chalk.cyan('Who are your target customers?'),
        default: 'SMBs and startups',
      },
      {
        type: 'list',
        name: 'stage',
        message: chalk.cyan('Funding stage:'),
        choices: ['Pre-seed', 'Seed', 'Series A', 'Series B+'],
        default: 'Pre-seed',
      },
      {
        type: 'input',
        name: 'raising',
        message: chalk.cyan('How much are you raising?'),
        default: '$500k',
      },
      {
        type: 'input',
        name: 'traction',
        message: chalk.cyan('Any traction? (users, revenue, waitlist, etc - or "none yet"):'),
        default: 'none yet',
      },
      {
        type: 'list',
        name: 'style',
        message: chalk.cyan('Pitch style:'),
        choices: [
          { name: '🎯 YC-style - short, direct, no fluff', value: 'YC-style: short, direct, data-driven, no buzzwords' },
          { name: '📊 Traditional VC - detailed with market data', value: 'traditional VC: detailed sections, market sizing, competitive landscape' },
          { name: '🚀 Founder storytelling - narrative-driven', value: 'narrative storytelling: start with the founder story, emotional journey' },
        ],
      },
    ]);

    startup = `${ans.startup}. Problem: ${ans.problem}. Customers: ${ans.audience}`;
    stage = ans.stage;
    raising = ans.raising;
    traction = ans.traction;
    opts._style = ans.style;
    opts._raising = ans.raising;
  }

  const style = opts._style || 'YC-style: short, direct, data-driven, no buzzwords';
  const spinner = ora({ text: chalk.cyan('Building your pitch deck...'), spinner: 'dots2' }).start();

  const systemMsg = `You are a top-tier startup advisor who has helped founders raise from YC, a16z, Sequoia, and top angels.
You write compelling, specific, investor-ready pitch deck content.
You know what VCs want to see: clarity, big market, traction signals, and a credible team narrative.
Avoid generic startup language. Be specific and make bold claims that are defensible.`;

  const userMsg = `Generate a complete investor pitch deck outline for:
"${startup}"
Funding stage: ${stage}
Raising: ${raising}
Traction: ${traction}
Style: ${style}

Generate content for ALL of the following slides:

## Slide 1: Cover
- Company name, tagline, and one-liner
- What you do in 10 words or less

## Slide 2: Problem
- The specific pain point (with a relatable hook)
- Who feels this pain and how badly
- Current bad solutions and why they fail

## Slide 3: Solution
- What you built (clear, simple)
- Key differentiator in one sentence
- How it actually works (brief)

## Slide 4: Market Size
- TAM / SAM / SOM with realistic numbers
- Market growth rate
- Why now? What's changed in the market

## Slide 5: Product
- 3-5 key features with one-line descriptions each
- The "aha moment" users experience
- What's on the roadmap

## Slide 6: Business Model
- How you make money (specific pricing if possible)
- Unit economics: CAC, LTV, margin estimates
- Revenue model type

## Slide 7: Traction
- Current metrics (users, revenue, growth, NPS)
- Key milestones hit
- Social proof (customers, pilots, letters of intent)

## Slide 8: Go-to-Market
- First 90-day plan to acquire customers
- Key channels
- Distribution strategy

## Slide 9: Competition
- Competitive landscape (2x2 or table description)
- Why you win
- Moat / defensibility

## Slide 10: Team
- Founder backgrounds (fill in with [FOUNDER NAME] placeholders)
- Why this team for this problem
- Key advisors to add

## Slide 11: The Ask
- Amount raising: ${raising}
- Use of funds breakdown (%)
- What milestones this gets you to
- Projected timeline

## Slide 12: Vision / Why Now
- The big picture 5-year vision
- Why this moment in history is the right time
- Closing statement

For each slide, write the ACTUAL content - not just bullet point labels.
Write what should appear on the slide itself.`;

  try {
    const result = await askAI(systemMsg, userMsg, { maxTokens: 3000, temperature: 0.8 });
    spinner.succeed(chalk.green('Pitch deck ready!'));

    console.log('\n' + boxen(
      gradient.cristal('  💼 YOUR PITCH DECK  '),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'double',
        borderColor: 'cyan',
        margin: { top: 0, bottom: 0 },
      }
    ));

    display.showResult(result, `💼 Pitch Deck · ${stage} · ${raising}`);

    const id = await saveToHistory('pitch', `startup: ${startup}, stage: ${stage}, raising: ${raising}`, result);
    display.savedMsg(id);

    console.log(chalk.gray('\n  Tip: Use this as your slide content outline. Customize numbers and names.\n'));
    logger.info('pitch generated', { stage, raising });
  } catch (err) {
    spinner.fail(chalk.red('Failed to generate pitch deck'));
    display.showError(err.message);
    logger.error('pitch failed', { error: err.message });
  }
};