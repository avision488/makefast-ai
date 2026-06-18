#!/usr/bin/env node
'use strict';

require('dotenv').config();

const { loadConfig } = require('./services/storage');
(async () => {
  try {
    const config = await loadConfig();
    if (config.groqApiKey && !process.env.GROQ_API_KEY) {
      process.env.GROQ_API_KEY = config.groqApiKey;
    }
    if (config.model && !process.env.GROQ_MODEL) {
      process.env.GROQ_MODEL = config.model;
    }
  } catch (e) {
  }
})();

const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const boxen = require('boxen').default;

const program = new Command();

function banner() {
  const art = figlet.textSync('MakeFast AI', { font: 'ANSI Shadow' });
  console.log('\n' + gradient.cristal(art));
  console.log(boxen(
    chalk.bold.white('⚡ AI-powered terminal toolkit for founders & devs') +
    '\n' + chalk.gray('   Developed By Avision488 · Built for speed · Made for builders'),
    {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      margin: { top: 0, bottom: 1 },
      borderStyle: 'round',
      borderColor: 'cyan',
    }
  ));
}

program
  .name('makefast')
  .description('AI-powered terminal toolkit for developers and founders')
  .version('1.0.0')
  .hook('preAction', () => banner());

program
  .command('idea')
  .description('Generate startup ideas using AI')
  .option('-n, --niche <niche>', 'Specify a niche or industry')
  .option('-c, --count <count>', 'Number of ideas to generate', '3')
  .action(require('./commands/idea'));

program
  .command('ui')
  .description('Generate premium UI/UX prompts for your project')
  .option('-t, --type <type>', 'App type (e.g., dashboard, landing, mobile)')
  .action(require('./commands/ui'));

program
  .command('copy')
  .description('Generate landing page copy')
  .option('-p, --product <product>', 'Product name or description')
  .action(require('./commands/copy'));

program
  .command('brainstorm')
  .description('Interactive AI brainstorming assistant')
  .action(require('./commands/brainstorm'));

program
  .command('scaffold')
  .description('Generate starter project folder structures')
  .option('-t, --type <type>', 'Project type (nextjs, saas, api, mobile, cli, landing)')
  .action(require('./commands/scaffold'));

program
  .command('stack')
  .description('Get AI-recommended tech stacks for your project')
  .option('-p, --project <project>', 'Describe your project briefly')
  .action(require('./commands/stack'));

program
  .command('roast')
  .description('Get a funny AI roast of your startup idea')
  .option('-i, --idea <idea>', 'Your startup idea to roast')
  .action(require('./commands/roast'));

program
  .command('tweet')
  .description('Generate a viral launch tweet thread')
  .option('-p, --product <product>', 'Product name and description')
  .action(require('./commands/tweet'));

program
  .command('validate')
  .description('Stress-test and validate your startup idea')
  .option('-i, --idea <idea>', 'Startup idea to validate')
  .action(require('./commands/validate'));

program
  .command('name')
  .description('Generate brandable startup name ideas')
  .option('-d, --description <description>', 'Describe what your product does')
  .action(require('./commands/name'));

program
  .command('readme')
  .description('Generate a production-quality README.md for your project')
  .option('-p, --project <project>', 'Project name and description')
  .action(require('./commands/readme'));

program
  .command('pitch')
  .description('Generate a full investor pitch deck outline')
  .option('-s, --startup <startup>', 'Startup name and description')
  .action(require('./commands/pitch'));

program
  .command('history')
  .description('View saved AI generations')
  .option('-l, --limit <limit>', 'Number of entries to show', '10')
  .option('-c, --clear', 'Clear all history')
  .action(require('./commands/history'));

program
  .command('config')
  .description('Configure MakeFast AI settings')
  .action(require('./commands/config'));

program.addHelpText('after', `
${chalk.cyan('Examples:')}
  ${chalk.gray('$')} makefast idea --niche "fintech"
  ${chalk.gray('$')} makefast ui --type "saas dashboard"
  ${chalk.gray('$')} makefast copy --product "AI writing assistant"
  ${chalk.gray('$')} makefast stack --project "real-time chat app"
  ${chalk.gray('$')} makefast scaffold --type nextjs
  ${chalk.gray('$')} makefast roast --idea "Uber for dogs"
  ${chalk.gray('$')} makefast tweet --product "AI code reviewer"
  ${chalk.gray('$')} makefast validate --idea "Notion for lawyers"
  ${chalk.gray('$')} makefast name --description "AI meeting notes tool"
  ${chalk.gray('$')} makefast readme --project "my open source CLI tool"
  ${chalk.gray('$')} makefast pitch --startup "AI email tool for sales teams"
  ${chalk.gray('$')} makefast brainstorm 
  ${chalk.gray('$')} makefast history 
  ${chalk.gray('$')} makefast Config -- to set your Groq API key and preferences
`);

if (process.argv.length < 3) {
  banner();
  program.help();
}

program.parseAsync(process.argv).catch(err => {
  console.error(chalk.red('\n✗ Error:'), err.message);
  process.exit(1);
});