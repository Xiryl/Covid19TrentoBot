const Markup = require('telegraf/markup');
const emoji = require('node-emoji');

/**
 * ============================================================================
 *                            DEFAULT KEYBOARD
 * ============================================================================
 */
const defKeyboard = Markup.keyboard([
  [`${emoji.get(':white_check_mark:')} Ultimi Dati`],
  [`${emoji.get(':warning:')} Ordinanze`, `${emoji.get(':information_source:')} Info`]
])
.oneTime()
.resize()
.extra();

module.exports = {defKeyboard};