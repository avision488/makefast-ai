'use strict';

const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { askAI } = require('../services/ai');
const { saveToHistory } = require('../services/storage');
const display = require('../utils/display');
const logger = require('../utils/logger');

module.exports = async function(opts) {
  display.section('UI/UX Prompt Generator');

  let appType = opts.type;
  let framework = 'React + Tailwind';
  let vibe = 'Clean & Minimal';

  if (!appType) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'appType',
        message: chalk.cyan('What type of app or screen?'),
      },
      {
        type: 'list',
        name: 'framework',
        message: chalk.cyan('Framework:'),
        choices: [
          'React + Tailwind',
          'Next.js',
          'React Native / Expo',
          'Vue.js',
          'Svelte',
          'Plain HTML/CSS',
          'Figma design',
        ],
      },
      {
        type: 'list',
        name: 'vibe',
        message: chalk.cyan('Design vibe:'),
        choices: [
          '✨ Clean & Minimal',
          '🌑 Dark Mode Premium',
          '⚡ Cyberpunk / Neon',
          '🌿 Warm & Friendly',
          '💼 Corporate & Professional',
          '🎨 Bold & Colorful',
        ],
      },
    ]);
    appType = ans.appType;
    framework = ans.framework;
    vibe = ans.vibe;
  }

  const spinner = ora({ text: chalk.cyan('Crafting UI prompts...'), spinner: 'aesthetic' }).start();

  const systemMsg = `You are a world-class UI/UX designer and prompt engineer specializing in creating detailed, actionable design prompts.
You produce rich, specific prompts that frontend developers and AI tools can immediately act on.
Your prompts cover: layout, color palette, typography, spacing, component hierarchy, interactions, and feel.`;

  const userMsg = `Generate premium UI/UX design prompts for: "${appType}"
Framework: ${framework}
Design vibe: ${vibe}

Provide 3 distinct design directions with:
1. **Direction Name** + emoji
2. **Color Palette**: Exact colors (hex or Tailwind classes)
3. **Typography**: Font pairings and sizes
4. **Layout Structure**: Grid/flex description
5. **Key Components**: List of main UI components with brief descriptions
6. **Micro-interactions**: Hover states, transitions, animations
7. **AI Image/Icon Prompt**: A Midjourney/DALL-E prompt for hero imagery if applicable
8. **Implementation Snippet**: A 10-15 line code snippet or pseudocode showing the core structure

Make each direction genuinely different and production-quality.`;

  try {
    const result = await askAI(systemMsg, userMsg, { maxTokens: 2500 });
    spinner.succeed(chalk.green('UI prompts ready!'));
    display.showResult(result, `🎨 UI Prompts · ${appType}`);
    const id = await saveToHistory('ui', `type: ${appType}, framework: ${framework}`, result);
    display.savedMsg(id);
    logger.info('ui prompt generated', { appType, framework });
  } catch (err) {
    spinner.fail(chalk.red('Failed to generate UI prompts'));
    display.showError(err.message);
    logger.error('ui failed', { error: err.message });
  }
};