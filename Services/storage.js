'use strict';

const fs = require('fs-extra');
const path = require('path');
const { nanoid } = require('nanoid');
const os = require('os');

const dataDir = path.join(os.homedir(), '.makefast');
const historyFile = path.join(dataDir, 'history.json');
const configFile = path.join(dataDir, 'config.json');
const logsDir = path.join(dataDir, 'logs');

async function setup() {
  await fs.ensureDir(dataDir);
  await fs.ensureDir(logsDir);
}

async function saveToHistory(type, prompt, output) {
  await setup();

  let list = [];
  if (await fs.pathExists(historyFile)) {
    try {
      list = await fs.readJson(historyFile);
    } catch (e) {
      list = [];
    }
  }

  const entry = {
    id: nanoid(8),
    type,
    prompt,
    result: output,
    timestamp: new Date().toISOString(),
  };

  list.unshift(entry);
  if (list.length > 100) list = list.slice(0, 100);

  await fs.writeJson(historyFile, list, { spaces: 2 });
  return entry.id;
}

async function loadHistory(limit) {
  limit = limit || 10;
  if (!await fs.pathExists(historyFile)) return [];
  try {
    const list = await fs.readJson(historyFile);
    return list.slice(0, limit);
  } catch (e) {
    return [];
  }
}

async function wipeHistory() {
  if (await fs.pathExists(historyFile)) {
    await fs.remove(historyFile);
  }
}

async function loadConfig() {
  if (!await fs.pathExists(configFile)) return {};
  try {
    return await fs.readJson(configFile);
  } catch (e) {
    return {};
  }
}

async function writeConfig(data) {
  await setup();
  let existing = {};
  try {
    if (await fs.pathExists(configFile)) {
      existing = await fs.readJson(configFile);
    }
  } catch (e) {}

  const merged = Object.assign({}, existing, data);
  await fs.writeJson(configFile, merged, { spaces: 2 });
  return merged;
}

async function appendLog(level, msg, extra) {
  try {
    await setup();
    const day = new Date().toISOString().split('T')[0];
    const file = path.join(logsDir, day + '.log');
    const line = JSON.stringify({ level, msg, ...extra, t: new Date().toISOString() }) + '\n';
    await fs.appendFile(file, line);
  } catch (e) {
    // logging shouldn't crash anything
  }
}

module.exports = {
  saveToHistory,
  loadHistory,
  wipeHistory,
  loadConfig,
  writeConfig,
  appendLog,
  dataDir,
};