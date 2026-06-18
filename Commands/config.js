'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const { loadConfig, writeConfig, dataDir } = require('../services/storage');
const display = require('../utils/display');
const defaults = require('../config/defaults');

module.exports = async function() {
  display.section('Configuration');

  const cfg = await loadConfig();
  const apiKey = process.env.GROQ_API_KEY || cfg.groqApiKey;
  const currentModel = process.env.GROQ_MODEL || cfg.model || defaults.model;

  console.log(chalk.gray('\n  Current settings:\n'));
  console.log(`  ${chalk.dim('GROQ_API_KEY')}   ${apiKey ? chalk.green('✓ Set') : chalk.red('✗ Not set')}`);
  console.log(`  ${chalk.dim('Model')}         ${chalk.white(currentModel)}`);
  console.log(`  ${chalk.dim('Temperature')}   ${chalk.white(cfg.temperature || defaults.temperature)}`);
  console.log('');

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('What do you want to configure?'),
      choices: [
        { name: '🔑 Set Groq API Key', value: 'apiKey' },
        { name: '🤖 Change AI Model', value: 'model' },
        { name: '🌡️  Adjust Temperature', value: 'temperature' },
        { name: '🧪 Test API Connection', value: 'test' },
        { name: '📂 Show config file location', value: 'location' },
        { name: '↩️  Exit', value: 'exit' },
      ],
    },
  ]);

  if (action === 'exit') return;

  if (action === 'location') {
    console.log(chalk.gray(`\n  Config stored at: ${chalk.white(dataDir)}`));
    display.hint('You can also set GROQ_API_KEY in a .env file in your project root.');
    return;
  }

  if (action === 'apiKey') {
    const { key } = await inquirer.prompt([
      {
        type: 'password',
        name: 'key',
        message: chalk.cyan('Enter your Groq API key (gsk_...):'),
        mask: '*',
        validate: v => v.startsWith('gsk_') || 'Groq API keys start with gsk_',
      },
    ]);

    await writeConfig({ groqApiKey: key });

    // try to save to .env too
    const fs = require('fs-extra');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env');
    try {
      let content = '';
      if (await fs.pathExists(envPath)) {
        content = await fs.readFile(envPath, 'utf8');
      }
      if (content.includes('GROQ_API_KEY=')) {
        content = content.replace(/GROQ_API_KEY=.*/, `GROQ_API_KEY=${key}`);
      } else {
        content += `\nGROQ_API_KEY=${key}\n`;
      }
      await fs.writeFile(envPath, content.trim() + '\n');
      display.ok('API key saved to .env and config');
    } catch (e) {
      display.ok('API key saved to config');
      display.hint('Add GROQ_API_KEY to your .env file to persist it across sessions.');
    }
    return;
  }

  if (action === 'model') {
    const { model } = await inquirer.prompt([
      {
        type: 'list',
        name: 'model',
        message: chalk.cyan('Select AI model:'),
        choices: defaults.models.map(m => ({
          name: m === defaults.model ? `${m} ${chalk.green('(recommended)')}` : m,
          value: m,
        })),
        default: cfg.model || defaults.model,
      },
    ]);
    await writeConfig({ model });
    process.env.GROQ_MODEL = model;
    display.ok(`Model set to ${model}`);
    return;
  }

  if (action === 'temperature') {
    const { temp } = await inquirer.prompt([
      {
        type: 'list',
        name: 'temp',
        message: chalk.cyan('Select creativity level:'),
        choices: [
          { name: '🎯 Focused (0.3) - Precise, consistent', value: 0.3 },
          { name: '⚖️  Balanced (0.7) - Good mix', value: 0.7 },
          { name: '✨ Creative (0.85) - Default', value: 0.85 },
          { name: '🌪️  Wild (1.0) - Unpredictable', value: 1.0 },
        ],
        default: cfg.temperature || 0.85,
      },
    ]);
    await writeConfig({ temperature: temp });
    display.ok(`Temperature set to ${temp}`);
    return;
  }

  if (action === 'test') {
    const ora = require('ora');
    const spinner = ora({ text: chalk.cyan('Testing Groq connection...'), spinner: 'dots' }).start();
    try {
      const { askAI } = require('../services/ai');
      const reply = await askAI(
        'You are a helpful assistant.',
        'Say "MakeFast AI is connected!" and nothing else.',
        { maxTokens: 30 }
      );
      spinner.succeed(chalk.green('Connection successful!'));
      console.log(chalk.gray('\n  API Response: ') + chalk.white(reply));
    } catch (err) {
      spinner.fail(chalk.red('Connection failed'));
      display.showError(err.message);
      display.hint('Make sure GROQ_API_KEY is set. Get your key at https://console.groq.com');
    }
  }
};