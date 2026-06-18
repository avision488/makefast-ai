'use strict';

const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const gradient = require('gradient-string');
const { chatWithHistory } = require('../services/ai');
const { saveToHistory } = require('../services/storage');
const display = require('../utils/display');
const logger = require('../utils/logger');

module.exports = async function() {
  display.section('Interactive Brainstorming Assistant');

  console.log(chalk.gray('\n  Chat with your AI co-founder. Type "save" to save, "exit" to quit.\n'));

  const { topic } = await inquirer.prompt([
    {
      type: 'input',
      name: 'topic',
      message: chalk.cyan('What do you want to brainstorm about?'),
      validate: v => v.trim().length > 2 || 'Give me something to work with',
    },
  ]);

  const messages = [
    {
      role: 'system',
      content: `You are a brilliant startup co-founder and product strategist. 
You're sharp, direct, and creative. You ask clarifying questions, challenge assumptions, and push for specificity.
You help the user think through startup ideas, product strategy, positioning, growth, and execution.
Keep responses focused and actionable. Use bullet points for lists. Be conversational but insightful.
Current brainstorm topic: "${topic}"`,
    },
    {
      role: 'user',
      content: `Let's brainstorm: ${topic}`,
    },
  ];

  // save the conversation text for history
  let sessionText = `Topic: ${topic}\n\n`;

  console.log(chalk.gray('\n  ─────────────────────────────────────────────────\n'));

  const initSpinner = ora({ text: chalk.cyan('Thinking...'), spinner: 'dots' }).start();
  try {
    const firstReply = await chatWithHistory(messages, { maxTokens: 800 });
    initSpinner.stop();
    messages.push({ role: 'assistant', content: firstReply });
    sessionText += `AI: ${firstReply}\n\n`;
    console.log('\n' + gradient.mind('  🤖 AI Co-founder:\n'));
    console.log(chalk.white('  ' + firstReply.replace(/\n/g, '\n  ')));
    console.log('');
  } catch (err) {
    initSpinner.fail(chalk.red('Failed to start session'));
    display.showError(err.message);
    return;
  }

  while (true) {
    const { input } = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: chalk.cyan('  You:'),
        validate: v => v.trim().length > 0 || 'Say something',
      },
    ]);

    const msg = input.trim();

    if (msg.toLowerCase() === 'exit') {
      display.hint('Session ended without saving.');
      break;
    }

    if (msg.toLowerCase() === 'save') {
      const id = await saveToHistory('brainstorm', topic, sessionText);
      display.ok('Session saved!');
      display.savedMsg(id);
      break;
    }

    messages.push({ role: 'user', content: msg });
    sessionText += `You: ${msg}\n\n`;

    const spinner = ora({ text: chalk.cyan('  Thinking...'), spinner: 'dots' }).start();
    try {
      const reply = await chatWithHistory(messages, { maxTokens: 800 });
      spinner.stop();
      messages.push({ role: 'assistant', content: reply });
      sessionText += `AI: ${reply}\n\n`;
      console.log('\n' + gradient.mind('  🤖 AI Co-founder:\n'));
      console.log(chalk.white('  ' + reply.replace(/\n/g, '\n  ')));
      console.log('');
      logger.info('brainstorm turn', { topic });
    } catch (err) {
      spinner.fail(chalk.red('  AI hiccuped'));
      display.showError(err.message);
    }
  }
};