'use strict';

const { appendLog } = require('../services/storage');

module.exports = {
  info: (msg, data) => appendLog('info', msg, data || {}),
  error: (msg, data) => appendLog('error', msg, data || {}),
  warn: (msg, data) => appendLog('warn', msg, data || {}),
};