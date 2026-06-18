'use strict';

const chalk = require('chalk');
const boxen = require('boxen').default;
const gradient = require('gradient-string');
const Table = require('cli-table3');

function section(title) {
  console.log('\n' + gradient.passion('  ▸ ' + title));
  console.log(chalk.gray('  ' + '─'.repeat(50)));
}

function showResult(content, label) {
  label = label || 'Result';
  console.log('\n' + boxen(content, {
    title: chalk.cyan.bold(label),
    titleAlignment: 'left',
    padding: 1,
    margin: { top: 0, bottom: 1, left: 0, right: 0 },
    borderStyle: 'round',
    borderColor: 'cyan',
  }));
}

function showError(msg) {
  console.log('\n' + boxen(chalk.red('✗  ' + msg), {
    padding: { top: 0, bottom: 0, left: 1, right: 1 },
    borderStyle: 'round',
    borderColor: 'red',
  }));
}

function ok(msg) {
  console.log(chalk.green('\n  ✓ ' + msg));
}

function hint(msg) {
  console.log(chalk.gray('\n  ℹ ' + msg));
}

function savedMsg(id) {
  console.log(chalk.gray(`\n  Saved to history · ID: ${chalk.white(id)}`));
}

function makeTable(headers, rows) {
  const t = new Table({
    head: headers.map(h => chalk.cyan.bold(h)),
    style: { border: ['gray'], head: [] },
    chars: {
      top: '─', 'top-mid': '┬', 'top-left': '╭', 'top-right': '╮',
      bottom: '─', 'bottom-mid': '┴', 'bottom-left': '╰', 'bottom-right': '╯',
      left: '│', 'left-mid': '├', mid: '─', 'mid-mid': '┼',
      right: '│', 'right-mid': '┤', middle: '│',
    },
  });
  rows.forEach(r => t.push(r));
  return t.toString();
}

module.exports = { section, showResult, showError, ok, hint, savedMsg, makeTable };