'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const gradient = require('gradient-string');
const boxen = require('boxen').default;
const { loadHistory, wipeHistory } = require('../services/storage');
const display = require('../utils/display');

const icons = {
  idea: '💡',
  ui: '🎨',
  copy: '✍️',
  brainstorm: '🧠',
  scaffold: '📁',
  stack: '⚙️',
  roast: '🔥',
};

module.exports = async function(opts) {
  display.section('Generation History');

  if (opts.clear) {
    const { yes } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'yes',
        message: chalk.red('Clear ALL history? This cannot be undone.'),
        default: false,
      },
    ]);
    if (yes) {
      await wipeHistory();
      display.ok('History cleared.');
    } else {
      display.hint('Cancelled.');
    }
    return;
  }

  const limit = parseInt(opts.limit) || 10;
  const history = await loadHistory(limit);

  if (history.length === 0) {
    console.log('\n' + boxen(
      chalk.gray('  No generations yet.\n') +
      chalk.gray('  Try: ') + chalk.cyan('makefast idea') + chalk.gray(' to get started.'),
      { padding: 1, borderStyle: 'round', borderColor: 'gray', margin: { left: 0 } }
    ));
    return;
  }

  console.log(chalk.gray(`\n  Showing last ${history.length} generation${history.length !== 1 ? 's' : ''}\n`));

  const choices = history.map(entry => {
    const icon = icons[entry.type] || '📄';
    const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    return {
      name: `${icon} ${chalk.white(entry.type.padEnd(12))} ${chalk.gray(entry.prompt.substring(0, 45))} ${chalk.dim(date)}`,
      value: entry,
      short: `${entry.type} #${entry.id}`,
    };
  });

  choices.push({ name: chalk.gray('  ← Exit'), value: null, short: 'Exit' });

  const { picked } = await inquirer.prompt([
    {
      type: 'list',
      name: 'picked',
      message: chalk.cyan('Select an entry to view:'),
      choices,
      pageSize: 15,
    },
  ]);

  if (!picked) return;

  const icon = icons[picked.type] || '📄';
  const date = new Date(picked.timestamp).toLocaleString();

  console.log('\n' + gradient.mind(`  ${icon} ${picked.type.toUpperCase()} · ${picked.id} · ${date}`));
  console.log(chalk.gray('  Prompt: ' + picked.prompt));
  console.log('');

  display.showResult(picked.result, `${icon} ${picked.type} · ${picked.id}`);
};