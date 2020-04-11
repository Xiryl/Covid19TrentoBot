const { IncomingWebhook } = require('@slack/webhook');
const config = require('./../lib/config/config.json');
const webhook = new IncomingWebhook(config.SLACK_TOKEN);

module.exports = webhook;