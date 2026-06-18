'use strict';

const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const gradient = require('gradient-string');
const fs = require('fs-extra');
const path = require('path');
const { askAI } = require('../services/ai');
const { saveToHistory } = require('../services/storage');
const display = require('../utils/display');
const logger = require('../utils/logger');

module.exports = async function(opts) {
  display.section('README Generator');

  console.log(chalk.gray('\n  Generate a production-quality README for your project.\n'));

  let project = opts.project;

  if (!project) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: chalk.cyan('Project name:'),
        validate: v => v.trim().length > 1 || 'Enter a project name',
      },
      {
        type: 'input',
        name: 'description',
        message: chalk.cyan('What does it do? (one sentence):'),
        validate: v => v.trim().length > 5 || 'Describe it briefly',
      },
      {
        type: 'input',
        name: 'stack',
        message: chalk.cyan('Tech stack (e.g., Next.js, Postgres, Stripe):'),
        default: 'Node.js',
      },
      {
        type: 'input',
        name: 'commands',
        message: chalk.cyan('Key commands to include (e.g., npm run dev, npm run build):'),
        default: 'npm install, npm run dev',
      },
      {
        type: 'input',
        name: 'features',
        message: chalk.cyan('List the main features (comma separated):'),
        default: '',
      },
      {
        type: 'input',
        name: 'envVars',
        message: chalk.cyan('Required environment variables (comma separated, or leave blank):'),
        default: '',
      },
      {
        type: 'list',
        name: 'type',
        message: chalk.cyan('Project type:'),
        choices: [
          { name: '🌐 Web App / SaaS', value: 'web app' },
          { name: '🛠️ Developer Tool / CLI', value: 'developer tool or CLI' },
          { name: '📦 npm Package / Library', value: 'npm package or library' },
          { name: '📱 Mobile App', value: 'mobile app' },
          { name: '🤖 AI / ML Project', value: 'AI or ML project' },
          { name: '🔧 API / Backend Service', value: 'API or backend service' },
        ],
      },
      {
        type: 'checkbox',
        name: 'sections',
        message: chalk.cyan('Which sections to include?'),
        choices: [
          { name: '✨ Features list', checked: true },
          { name: '🚀 Quick start / Installation', checked: true },
          { name: '⚙️ Configuration / Environment variables', checked: true },
          { name: '📖 Usage examples', checked: true },
          { name: '🗂️ Project structure', checked: false },
          { name: '🤝 Contributing guide', checked: true },
          { name: '🗺️ Roadmap', checked: false },
          { name: '📄 License section', checked: true },
          { name: '🙏 Credits / acknowledgements', checked: false },
          { name: '🔖 Badges (build, license, version)', checked: true },
        ],
      },
      {
        type: 'list',
        name: 'style',
        message: chalk.cyan('README style:'),
        choices: [
          { name: '⭐ GitHub showcase - polished, badges, screenshots', value: 'polished GitHub showcase with badges and screenshot placeholders' },
          { name: '📝 Practical - clean and minimal', value: 'clean and minimal, practical developer focus' },
          { name: '🚀 Open source - full contributor docs', value: 'full open source with contribution guide and community section' },
        ],
      },
      {
        type: 'confirm',
        name: 'saveFile',
        message: chalk.cyan('Save as README.md in current directory?'),
        default: false,
      },
    ]);

    project = `${ans.name} - ${ans.description}`;
    opts._name = ans.name;
    opts._stack = ans.stack;
    opts._commands = ans.commands;
    opts._features = ans.features;
    opts._envVars = ans.envVars;
    opts._type = ans.type;
    opts._sections = ans.sections;
    opts._style = ans.style;
    opts._saveFile = ans.saveFile;
  }

  const name = opts._name || project;
  const stack = opts._stack || 'Node.js';
  const commands = opts._commands || 'npm install, npm run dev';
  const features = opts._features || '';
  const envVars = opts._envVars || '';
  const type = opts._type || 'web app';
  const sections = opts._sections || ['✨ Features list', '🚀 Quick start / Installation', '📖 Usage examples', '📄 License section'];
  const style = opts._style || 'clean and minimal, practical developer focus';
  const saveFile = opts._saveFile || false;

  const spinner = ora({ text: chalk.cyan('Writing README...'), spinner: 'dots2' }).start();

  const systemMsg = `You are an expert technical writer who has written READMEs for top open-source projects on GitHub.
You write documentation that is clear, complete, and actually useful - not bloated or generic.
You use markdown correctly: proper headings, code blocks, tables, badges.
Your READMEs make developers want to use the project immediately.
Write ONLY the markdown content. No preamble, no explanation. Just the README.`;

  const userMsg = `Generate a complete README.md for: "${project}"
Project type: ${type}
Tech stack: ${stack}
Key commands: ${commands}
${features ? `Main features: ${features}` : ''}
${envVars ? `Environment variables: ${envVars}` : ''}
Sections to include: ${sections.join(', ')}
Style: ${style}

Requirements:
- Start with a centered project name heading and a one-line description
- ${sections.includes('🔖 Badges (build, license, version)') ? 'Include shield.io badges for license, version, and stars' : 'No badges'}
- Use real markdown - code blocks with language hints, tables where appropriate
- Installation section must have actual shell commands in code blocks
- ${envVars ? `Include a .env.example table for: ${envVars}` : ''}
- Usage section should have realistic, copy-pasteable examples
- ${sections.includes('🗂️ Project structure') ? 'Include a directory tree using ASCII art' : ''}
- ${sections.includes('🗺️ Roadmap') ? 'Include a roadmap with checkboxes (a few done, a few upcoming)' : ''}
- End with a license badge or short license section if included
- Make it feel like a real, maintained project - not a template

Write the full README content now:`;

  try {
    const result = await askAI(systemMsg, userMsg, { maxTokens: 3000, temperature: 0.7 });
    spinner.succeed(chalk.green('README generated!'));

    console.log('\n' + gradient.cristal('  📄 YOUR README\n'));
    display.showResult(result, `📄 README.md · ${name}`);

    if (saveFile) {
      const outPath = path.join(process.cwd(), 'README.md');
      let overwrite = true;
      if (await fs.pathExists(outPath)) {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: chalk.yellow('README.md already exists. Overwrite?'),
            default: false,
          },
        ]);
        overwrite = confirm;
      }
      if (overwrite) {
        await fs.writeFile(outPath, result);
        display.ok(`Saved to ${outPath}`);
      } else {
        display.hint('Skipped saving - copy from above.');
      }
    } else {
      display.hint('Run again and select "yes" to save directly to README.md');
    }

    const id = await saveToHistory('readme', `project: ${project}, stack: ${stack}`, result);
    display.savedMsg(id);
    logger.info('readme generated', { name, stack });
  } catch (err) {
    spinner.fail(chalk.red('Failed to generate README'));
    display.showError(err.message);
    logger.error('readme failed', { error: err.message });
  }
};