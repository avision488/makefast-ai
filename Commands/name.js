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
  display.section('Startup Name Generator');

  console.log(chalk.gray('\n  Generate brandable names for your startup.\n'));

  let description = opts.description;

  if (!description) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: chalk.cyan('Describe what your product does:'),
        validate: v => v.trim().length > 5 || 'Give me something to work with',
      },
      {
        type: 'input',
        name: 'keywords',
        message: chalk.cyan('Any keywords, concepts, or vibes to include? (optional):'),
        default: '',
      },
      {
        type: 'checkbox',
        name: 'styles',
        message: chalk.cyan('Name styles you like:'),
        choices: [
          { name: '⚡ Short & punchy (Stripe, Slack, Loom)', checked: true },
          { name: '🔤 Made-up word (Figma, Canva, Vercel)', checked: true },
          { name: '📝 Descriptive (SendGrid, HubSpot)', checked: false },
          { name: '🎭 Metaphor-based (Buffer, Notion, Linear)', checked: true },
          { name: '🌍 .com available style (harder but ideal)', checked: false },
          { name: '🤖 AI/tech vibe (add -AI, -ly, -ify suffix)', checked: false },
        ],
      },
      {
        type: 'list',
        name: 'count',
        message: chalk.cyan('How many names to generate?'),
        choices: ['5', '10', '20'],
        default: '10',
      },
      {
        type: 'checkbox',
        name: 'avoid',
        message: chalk.cyan('What to avoid:'),
        choices: [
          { name: 'Overused tech names (-ly, -io, -ify)', checked: false },
          { name: 'Hard to spell or pronounce', checked: true },
          { name: 'Names longer than 8 characters', checked: false },
          { name: 'Names that already exist as known brands', checked: true },
        ],
      },
    ]);

    description = ans.description;
    opts._keywords = ans.keywords;
    opts._styles = ans.styles;
    opts._count = ans.count;
    opts._avoid = ans.avoid;
  }

  const keywords = opts._keywords || '';
  const styles = opts._styles || ['⚡ Short & punchy', '🔤 Made-up word', '🎭 Metaphor-based'];
  const count = parseInt(opts._count) || 10;
  const avoid = opts._avoid || [];

  const spinner = ora({ text: chalk.cyan('Generating name ideas...'), spinner: 'aesthetic' }).start();

  const systemMsg = `You are a brand naming expert who has named hundreds of startups, apps, and products.
You understand phonetics, memorability, domain availability patterns, and brand psychology.
Great names are: short, memorable, easy to spell, unique, and evoke the right feeling.
You generate names that feel premium, modern, and fundable.`;

  const userMsg = `Generate ${count} startup names for: "${description}"
${keywords ? `Keywords/vibes: ${keywords}` : ''}
Style preferences: ${styles.join(', ')}
${avoid.length > 0 ? `Avoid: ${avoid.join(', ')}` : ''}

For each name, provide:

**[Name]**
- Type: (made-up word / real word / compound / metaphor / etc)
- Why it works: one sentence
- Domain: [name].com (likely available / taken / check), also suggest [name].io or [name].ai if relevant
- Tagline suggestion: a quick 5-word tagline that could pair with it

After the list, add:
## 🏆 Top 3 Picks
Pick the 3 strongest with a sentence on why each one stands out.

## 🔤 Name Variants to Explore
For the top pick, suggest 5 spelling variants or domain alternatives.`;

  try {
    const result = await askAI(systemMsg, userMsg, { maxTokens: 2000, temperature: 0.92 });
    spinner.succeed(chalk.green(`${count} names generated!`));

    console.log('\n' + gradient.cristal('  ✨ STARTUP NAMES\n'));
    display.showResult(result, `✨ Name Ideas · ${description.substring(0, 40)}`);

    const id = await saveToHistory('name', `description: ${description}, styles: ${styles.join(', ')}`, result);
    display.savedMsg(id);

    console.log(chalk.gray('\n  Tip: Check domain availability at namecheap.com or porkbun.com\n'));
    logger.info('names generated', { count, styles: styles.length });
  } catch (err) {
    spinner.fail(chalk.red('Failed to generate names'));
    display.showError(err.message);
    logger.error('name failed', { error: err.message });
  }
};