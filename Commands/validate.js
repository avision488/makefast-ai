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
  display.section('Market Validation Assistant');

  console.log(chalk.gray('\n  Stress-test your idea before you build it.\n'));

  let idea = opts.idea;

  if (!idea) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'idea',
        message: chalk.cyan('Describe your startup idea:'),
        validate: v => v.trim().length > 10 || 'Give me more detail',
      },
      {
        type: 'input',
        name: 'customer',
        message: chalk.cyan('Who exactly is your target customer? (be specific):'),
        validate: v => v.trim().length > 5 || 'Be more specific',
      },
      {
        type: 'input',
        name: 'problem',
        message: chalk.cyan('What specific problem does it solve?'),
        validate: v => v.trim().length > 10 || 'Describe the problem',
      },
      {
        type: 'input',
        name: 'solution',
        message: chalk.cyan('How does your solution work? (brief):'),
        validate: v => v.trim().length > 5 || 'Describe the solution',
      },
      {
        type: 'input',
        name: 'competitors',
        message: chalk.cyan('Who are the existing alternatives or competitors?'),
        default: 'not sure yet',
      },
      {
        type: 'list',
        name: 'stage',
        message: chalk.cyan('Where are you now?'),
        choices: [
          'Just an idea, haven\'t talked to anyone',
          'Talked to a few potential customers',
          'Built a prototype / MVP',
          'Have some early users',
        ],
      },
      {
        type: 'checkbox',
        name: 'checks',
        message: chalk.cyan('What do you want validated?'),
        choices: [
          { name: '🎯 Problem / Solution fit', checked: true },
          { name: '📊 Market size reality check', checked: true },
          { name: '⚔️  Competitive landscape', checked: true },
          { name: '🤔 Customer assumption risks', checked: true },
          { name: '💰 Business model viability', checked: false },
          { name: '🚀 Go-to-market risks', checked: false },
          { name: '🔮 Timing - is now the right moment?', checked: false },
        ],
      },
    ]);

    idea = `Idea: ${ans.idea}. Customer: ${ans.customer}. Problem: ${ans.problem}. Solution: ${ans.solution}`;
    opts._competitors = ans.competitors;
    opts._stage = ans.stage;
    opts._checks = ans.checks;
  }

  const competitors = opts._competitors || 'unknown';
  const stage = opts._stage || 'Just an idea';
  const checks = opts._checks || ['🎯 Problem / Solution fit', '📊 Market size reality check', '⚔️  Competitive landscape', '🤔 Customer assumption risks'];

  const spinner = ora({ text: chalk.cyan('Validating your idea...'), spinner: 'dots12' }).start();

  const systemMsg = `You are a brutally honest but constructive startup validator - like a YC partner doing an office hours session.
You ask the hard questions founders avoid. You spot assumption gaps, weak moats, and crowded markets.
You don't crush ideas for fun - you help founders find the truth quickly so they don't waste months.
Use a structured validation framework. Give concrete, actionable feedback.
Use a scoring system where it makes sense.`;

  const userMsg = `Validate this startup idea:
${idea}
Competitors/alternatives: ${competitors}
Current stage: ${stage}
Validate these areas: ${checks.join(', ')}

For each area, provide:

## 🎯 Problem / Solution Fit
- Is this a real, painful problem people will pay to solve?
- How do you know? What's the evidence?
- Strength score: X/10 with explanation

## 📊 Market Size Reality Check
- Estimated TAM, SAM, SOM
- Is this a vitamin or a painkiller market?
- Growth trend
- Score: X/10

## ⚔️ Competitive Landscape
- Who else is doing this (named competitors)
- What's the real moat here?
- Risk of "why not just use [X]?" objection
- Score: X/10

## 🤔 Top 5 Assumption Risks
List the 5 biggest unvalidated assumptions (most dangerous first)
For each: assumption + how to validate it in under 1 week

## 💡 3 Experiments to Run Right Now
Concrete 1-week validation experiments before building anything
Each should cost < $100 and give clear signal

## 📋 Validation Scorecard
Overall viability score: X/10
Biggest risk: [single sentence]
Best case scenario: [single sentence]
Recommended next step: [one action]`;

  try {
    const result = await askAI(systemMsg, userMsg, { maxTokens: 2500, temperature: 0.75 });
    spinner.succeed(chalk.green('Validation complete!'));

    console.log('\n' + gradient.teen('  🔬 VALIDATION REPORT\n'));
    display.showResult(result, `🔬 Idea Validation · ${new Date().toLocaleDateString()}`);

    const id = await saveToHistory('validate', idea.substring(0, 80), result);
    display.savedMsg(id);

    console.log(chalk.gray('\n  Tip: Run the 3 experiments before writing a single line of code.\n'));
    logger.info('validate ran', { stage });
  } catch (err) {
    spinner.fail(chalk.red('Validation failed'));
    display.showError(err.message);
    logger.error('validate failed', { error: err.message });
  }
};