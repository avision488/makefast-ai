'use strict';

const ora       = require('ora');
const inquirer  = require('inquirer');
const chalk     = require('chalk');
const gradient  = require('gradient-string');
const fs        = require('fs-extra');
const path      = require('path');
const { askAI }         = require('../services/ai');
const { saveToHistory } = require('../services/storage');
const templates         = require('../templates/scaffold-templates');
const display           = require('../utils/display');
const logger            = require('../utils/logger');
const { injectVars }    = require('../utils/template-injector');

const fileContents = {
  nextjs:  require('../Templates/nextjs'),
  saas:    require('../Templates/saas'),
  api:     require('../Templates/api'),
  mobile:  require('../Templates/mobile'),
  cli:     require('../Templates/cli'),
  landing: require('../Templates/landing'),
};

// ─── Placeholder 1×1 transparent PNG ─────────────────────────────────────────
const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// ─── Next-steps hints per template ────────────────────────────────────────────
function _printNextSteps(projectType, projectName) {
  const steps = {
    nextjs: [
      `cd ${projectName}`,
      'npm install',
      'cp .env.example .env.local   # fill in your keys',
      'npx prisma db push',
      'npm run dev',
    ],
    saas: [
      `cd ${projectName}`,
      'npm install',
      'cp .env.example .env         # fill in your keys',
      'npx prisma db push',
      'npm run dev',
    ],
    api: [
      `cd ${projectName}`,
      'npm install',
      'cp .env.example .env',
      'npm run dev',
    ],
    mobile: [
      `cd ${projectName}`,
      'npm install',
      'npx expo start',
    ],
    cli: [
      `cd ${projectName}`,
      'npm install',
      'npm run build',
      'npm link',
      `${projectName} run`,
    ],
    landing: [
      `cd ${projectName}`,
      'npm install',
      'npm run dev',
    ],
  };

  const cmds = steps[projectType] || [`cd ${projectName}`, 'npm install'];

  console.log('\n' + chalk.bold.white('  🚀 Next steps:'));
  cmds.forEach((cmd, i) => {
    console.log(chalk.gray(`  ${i + 1}.`) + ' ' + chalk.cyan(cmd));
  });
  console.log('');
}

// ─── Beautiful Expo install guide ─────────────────────────────────────────────
function _printExpoGuide(projectName) {
  const box = (lines, color = chalk.cyan) => {
    const width = Math.max(...lines.map(l => l.length)) + 4;
    const top    = '  ╭' + '─'.repeat(width) + '╮';
    const bottom = '  ╰' + '─'.repeat(width) + '╯';
    console.log(color(top));
    lines.forEach(l => {
      const pad = width - l.length - 2;
      console.log(color('  │ ') + l + ' '.repeat(pad) + color(' │'));
    });
    console.log(color(bottom));
  };

  console.log('\n' + gradient.cristal('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(gradient.passion('  📱  Run Your Expo App'));
  console.log(gradient.cristal('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  // ── Step 1: Install Expo Go ──────────────────────────────────────────────
  console.log(chalk.bold.white('  STEP 1 ') + chalk.gray('- Install Expo Go on your phone'));
  console.log('');
  box([
    chalk.yellow('  Android') + chalk.gray('  →  Play Store → search "Expo Go"'),
    chalk.blue('  iOS    ') + chalk.gray('  →  App Store  → search "Expo Go"'),
  ], chalk.gray);
  console.log('');

  // ── Step 2: Start dev server ─────────────────────────────────────────────
  console.log(chalk.bold.white('  STEP 2 ') + chalk.gray('- Start the development server'));
  console.log('');
  console.log(
    chalk.gray('  $ ') + chalk.cyan(`cd ${projectName}`) + '\n' +
    chalk.gray('  $ ') + chalk.cyan('npx expo start')
  );
  console.log('');

  // ── Step 3: Connect ──────────────────────────────────────────────────────
  console.log(chalk.bold.white('  STEP 3 ') + chalk.gray('- Open on your device'));
  console.log('');

  const methods = [
    { icon: '📷', label: 'Scan QR code',   detail: 'with Expo Go app (Android) or Camera (iOS)' },
    { icon: '🤖', label: 'Press  a ',       detail: 'to open Android emulator'                  },
    { icon: '🍎', label: 'Press  i ',       detail: 'to open iOS Simulator (macOS only)'         },
    { icon: '🌐', label: 'Press  w ',       detail: 'to open in browser'                         },
  ];
  methods.forEach(m => {
    console.log(
      '  ' + m.icon + '  ' +
      chalk.bold.white(m.label.padEnd(16)) +
      chalk.gray(m.detail)
    );
  });
  console.log('');

  // ── Bonus: useful keys ───────────────────────────────────────────────────
  console.log(chalk.bold.white('  HOTKEYS ') + chalk.gray('- while dev server is running'));
  console.log('');
  const hotkeys = [
    ['r', 'Reload app'],
    ['m', 'Toggle menu'],
    ['j', 'Open debugger'],
    ['?', 'Show all commands'],
  ];
  hotkeys.forEach(([key, desc]) => {
    console.log(
      '  ' + chalk.bgCyan.black(` ${key} `) + '  ' + chalk.gray(desc)
    );
  });

  console.log('\n' + chalk.gray('  ─'.repeat(26)));
  console.log(
    chalk.gray('  Docs: ') +
    chalk.underline.cyan('https://docs.expo.dev') +
    chalk.gray('   •   Discord: ') +
    chalk.underline.cyan('https://chat.expo.dev')
  );
  console.log('');
}

// ─── Main export ──────────────────────────────────────────────────────────────
module.exports = async function(opts) {
  display.section('Project Scaffolder');

  const templateChoices = Object.keys(templates).map(key => ({
    name: `${templates[key].name} - ${chalk.gray(templates[key].description)}`,
    value: key,
  }));
  templateChoices.push({ name: '🤖 AI-generated custom structure', value: 'custom' });

  let projectType = opts.type;

  const questions = [];
  if (!projectType) {
    questions.push({
      type:    'list',
      name:    'type',
      message: chalk.cyan('What kind of project?'),
      choices: templateChoices,
    });
  }
  questions.push({
    type:     'input',
    name:     'projectName',
    message:  chalk.cyan('Project name:'),
    default:  'my-project',
    validate: v => /^[a-z0-9-_]+$/i.test(v) || 'Use alphanumeric chars and hyphens only',
  });
  questions.push({
    type:    'confirm',
    name:    'createFiles',
    message: chalk.cyan('Create actual folders/files on disk?'),
    default: false,
  });

  const ans = await inquirer.prompt(questions);
  if (!projectType) projectType = ans.type;
  const projectName = ans.projectName;
  const createFiles = ans.createFiles;

  let structure;

  // ── AI custom template ───────────────────────────────────────────────────
  if (projectType === 'custom') {
    const { description } = await inquirer.prompt([
      {
        type:     'input',
        name:     'description',
        message:  chalk.cyan('Describe your project:'),
        validate: v => v.trim().length > 5 || 'Need more detail',
      },
    ]);

    const spinner = ora({ text: chalk.cyan('Generating structure with AI...'), spinner: 'dots2' }).start();
    try {
      const result = await askAI(
        'You are a senior developer. Generate clean, practical project folder structures. Output ONLY the file/folder tree as a plain list, one path per line, with folders ending in /.',
        `Generate a project structure for: "${description}"\nProject name: ${projectName}\n\nOutput only the file paths, one per line.`,
        { maxTokens: 800, temperature: 0.6 }
      );
      spinner.succeed(chalk.green('Custom structure ready!'));
      structure = result.split('\n').map(l => l.trim()).filter(Boolean);
      await saveToHistory('scaffold', `custom: ${description}`, result);
    } catch (err) {
      spinner.fail(chalk.red('AI failed, falling back to API template'));
      structure  = templates.api.structure;
      projectType = 'api';
    }
  } else {
    structure = templates[projectType]
      ? templates[projectType].structure
      : templates.api.structure;
  }

  // ── Pretty-print structure tree ──────────────────────────────────────────
  const tpl = templates[projectType];
  console.log('\n' + gradient.cristal(`  📁 ${tpl ? tpl.name : 'Custom Project'} - ${projectName}`));
  console.log(chalk.gray('  ' + '─'.repeat(50)));

  structure.forEach(item => {
    const depth  = (item.match(/\//g) || []).length;
    const indent = '  ' + '  '.repeat(Math.max(0, depth - 1));
    const isDir  = item.endsWith('/');
    const name   = item.split('/').filter(Boolean).pop() + (isDir ? '/' : '');
    console.log(indent + (isDir ? chalk.cyan('📂 ' + name) : chalk.gray('📄 ' + name)));
  });

  // ── Create files on disk ─────────────────────────────────────────────────
  if (createFiles) {
    const targetDir = path.resolve(process.cwd(), projectName);

    const templateFiles = fileContents[projectType]
      ? fileContents[projectType](projectName)
      : {};

    const spinner = ora({ text: chalk.cyan(`Creating ${projectName}/...`), spinner: 'dots' }).start();
    try {
      // Write all template files
      for (const item of structure) {
        const fullPath = path.join(targetDir, item);
        if (item.endsWith('/')) {
          await fs.ensureDir(fullPath);
        } else {
          await fs.ensureDir(path.dirname(fullPath));
          if (!await fs.pathExists(fullPath)) {
            const relPath    = item.replace(/^\//, '');
            const rawContent = templateFiles[relPath];
            if (rawContent !== undefined) {
              await fs.writeFile(fullPath, injectVars(rawContent, { projectName }));
            } else {
              await fs.writeFile(fullPath, `// ${path.basename(fullPath)}\n`);
            }
          }
        }
      }

      // ── Expo: generate placeholder asset PNGs ────────────────────────────
      if (projectType === 'mobile') {
        const imagesDir = path.join(targetDir, 'assets', 'images');
        const fontsDir  = path.join(targetDir, 'assets', 'fonts');
        await fs.ensureDir(imagesDir);
        await fs.ensureDir(fontsDir);

        const assetFiles = [
          'icon.png',
          'splash-icon.png',
          'adaptive-icon.png',
          'favicon.png',
        ];
        for (const asset of assetFiles) {
          const assetPath = path.join(imagesDir, asset);
          if (!await fs.pathExists(assetPath)) {
            await fs.writeFile(assetPath, PNG_1x1);
          }
        }
      }

      spinner.succeed(chalk.green(`Created ${projectName}/ in current directory`));
      display.ok(`Project scaffolded at ./${projectName}`);

      console.log(chalk.gray('\n  ' + '─'.repeat(50)));

      // Print install guide (mobile gets the full Expo guide)
      if (projectType === 'mobile') {
        _printExpoGuide(projectName);
      } else {
        _printNextSteps(projectType, projectName);
      }

    } catch (err) {
      spinner.fail(chalk.red('Failed to create files'));
      display.showError(err.message);
    }
  } else {
    display.hint('Run again and select "yes" to create actual files on disk.');
  }

  logger.info('scaffold', { projectType, projectName });
};