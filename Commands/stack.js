'use strict';

const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { askAI } = require('../services/ai');
const { saveToHistory } = require('../services/storage');
const display = require('../utils/display');
const logger = require('../utils/logger');

module.exports = async function(opts) {
  display.section('Tech Stack Recommender');

  let project = opts.project;
  let scale = '🚀 Early Stage (0→1k users)';
  let team = 'Solo developer';
  let priorities = ['⚡ Speed to market', '🛠️ Developer experience'];

  if (!project) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'project',
        message: chalk.cyan('Describe your project:'),
        validate: v => v.trim().length > 5 || 'Give me a bit more detail',
      },
      {
        type: 'list',
        name: 'scale',
        message: chalk.cyan('Expected scale:'),
        choices: [
          '🧪 MVP / Prototype (just ship it)',
          '🚀 Early Stage (0→1k users)',
          '📈 Growth Stage (1k→100k users)',
          '🏢 Scale (100k+ users)',
        ],
      },
      {
        type: 'list',
        name: 'team',
        message: chalk.cyan('Team size:'),
        choices: ['Solo developer', '2-3 engineers', '4-10 engineers', '10+ engineers'],
      },
      {
        type: 'checkbox',
        name: 'priorities',
        message: chalk.cyan('What matters most?'),
        choices: [
          { name: '⚡ Speed to market', checked: true },
          { name: '💰 Cost efficiency', checked: false },
          { name: '🔒 Security', checked: false },
          { name: '📊 Real-time features', checked: false },
          { name: '🤖 AI/ML integration', checked: false },
          { name: '📱 Mobile support', checked: false },
          { name: '🌍 Global scale', checked: false },
          { name: '🛠️ Developer experience', checked: true },
        ],
      },
    ]);
    project = ans.project;
    scale = ans.scale;
    team = ans.team;
    priorities = ans.priorities;
  }

  const spinner = ora({ text: chalk.cyan('Analyzing your project...'), spinner: 'dots12' }).start();

  const systemMsg = `You are a principal engineer who has built and scaled dozens of products.
You give concrete, opinionated tech stack recommendations based on specific project needs.
You're pragmatic - you recommend what actually works, not what's trendy.
You know when to use boring tech and when cutting-edge is warranted.`;

  const userMsg = `Recommend a tech stack for: "${project}"
Scale: ${scale}
Team: ${team}
Priorities: ${priorities.join(', ')}

Provide a structured recommendation covering:

## 🎯 Recommended Stack (Primary Option)
List each layer: Frontend, Backend, Database, Auth, Hosting/Infra, Monitoring, CI/CD
For each: name + why this specific choice fits this project

## 🔄 Alternative Stack (Leaner Option)
A simpler/cheaper alternative with trade-offs explained

## ⚠️ Things to Avoid
2-3 specific technologies NOT to use for this project and exactly why

## 🗺️ Architecture Notes
2-3 key architectural decisions specific to this project's needs

## 💸 Estimated Monthly Cost
Rough cost breakdown for the primary stack at early scale

Be specific and direct. No vague answers.`;

  try {
    const result = await askAI(systemMsg, userMsg, { maxTokens: 2000, temperature: 0.7 });
    spinner.succeed(chalk.green('Stack recommendation ready!'));
    display.showResult(result, `⚙️ Tech Stack · ${project.substring(0, 40)}`);
    const id = await saveToHistory('stack', `project: ${project}, scale: ${scale}`, result);
    display.savedMsg(id);
    logger.info('stack recommended', { project, scale, team });
  } catch (err) {
    spinner.fail(chalk.red('Failed to generate recommendation'));
    display.showError(err.message);
    logger.error('stack failed', { error: err.message });
  }
};