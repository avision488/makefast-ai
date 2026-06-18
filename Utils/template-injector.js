'use strict';

/**
 * Replace {{variableName}} placeholders in template content.
 * @param {string} content  - raw template string
 * @param {Record<string,string>} vars - key/value map
 * @returns {string}
 */
function injectVars(content, vars) {
  return content.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const trimmed = key.trim();
    return vars[trimmed] !== undefined ? vars[trimmed] : `{{${trimmed}}}`;
  });
}

module.exports = { injectVars };