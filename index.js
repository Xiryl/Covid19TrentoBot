const Telegraf = require('telegraf');
const config = require('./lib/config/config.json');
const middleware = require('./utils/middleware');
const logger = require('./utils/slackLogger');
const keyboard = require('./utils/keyboards');
const emoji = require('node-emoji');

/**
 * ============================================================================
 *                              REGEX
 * ============================================================================
 */
const RE_DATA = new RegExp(/✅ Ultimi Dati/i);
const RE_DOC = new RegExp(/⚠️ Ordinanze/i);
const RE_INFO = new RegExp(/ℹ️ Info/i);

/**
 * ============================================================================
 *                              INIT BOT
 * ============================================================================
 */
const bot = new Telegraf(config["TOKEN"]);

// set ctx
bot.use((ctx, next) => {
    const start = new Date();
    return next(ctx).then(() => {
        const ms = new Date() - start;
        console.log('Response time %sms', ms);
    })
});

/**
 * ============================================================================
 *                              INIT COMMAND
 * ============================================================================
 */
bot.start((ctx) => {
    const user = JSON.stringify(ctx.chat);
    const date = new Date().toISOString();
    logger.send({
        text: `${date} - command: /start, user:${user}`
    });

    const message = `Ciao ${ctx.chat.first_name} ${emoji.get(':wave:')}!\n\n@covid19trentobot è un bot informativo ed è stato creato per fornire dati e aggiornamenti riguardanti l'evolversi dell'epidemia di Covid-19 nella Provincia Autonoma di Trento. Questo bot non è stato creato dalla Provincia, ma da uno sviluppatore interessato a diffondere informazioni utili a tutti.\n\n*ATTENZIONE: tutti i dati utilizzati sono ufficiali e i link alle fonti sono forniti.*\n\n/ultimidati\n/info\n\nSviluppatore: @Xiryl`;
    ctx.replyWithMarkdown(message, keyboard.defKeyboard);
});

/**
 * ============================================================================
 *                         INFO COMMAND
 * ============================================================================
 */
bot.hears(RE_INFO, (ctx) => {
    const user = JSON.stringify(ctx.chat);
    const date = new Date().toISOString();
    logger.send({
        text: `${date} - command: /info, user:${user}`
    });

    const message = `@covid19trentobot è un bot informativo ed è stato creato per fornire dati e aggiornamenti riguardanti l'evolversi dell'epidemia di Covid-19 nella Provincia Autonoma di Trento. Questo bot non è stato creato dalla Provincia, ma da uno sviluppatore interessato a diffondere informazioni utili a tutti.\n\n**Sviluppatore**: @Xiryl\nSito Web:[chiarani.it](www.chiarani.it)\n\n*Fonti utilizzate*:\n• [Protezione Civile](http://www.protezionecivile.it/attivita-rischi/rischio-sanitario/emergenze/coronavirus)\n• [PCM-DPC COVID-19 PROT.CIV. ITALIA](https://github.com/pcm-dpc/COVID-19)\n• [Protezione Civile Trento](http://www.protezionecivile.tn.it)\n\n*Comandi disponibili:*\n/ultimidati (ottieni gli ultimi dati)\n/ripartizione (tabelle ripartizioni)\n/comunicati (documenti e/o comunicati)\n/info (info sull bot)\n\n`;
    ctx.replyWithMarkdown(message, keyboard.defKeyboard);
});

/**
 * ============================================================================
 *                         INFO COMMAND
 * ============================================================================
 */
bot.command('info', (ctx) => {
    const user = JSON.stringify(ctx.chat);
    const date = new Date().toISOString();
    logger.send({
        text: `${date} - command: /info, user:${user}`
    });

    const message = `@covid19trentobot è un bot informativo ed è stato creato per fornire dati e aggiornamenti riguardanti l'evolversi dell'epidemia di Covid-19 nella Provincia Autonoma di Trento. Questo bot non è stato creato dalla Provincia, ma da uno sviluppatore interessato a diffondere informazioni utili a tutti.\n\n**Sviluppatore**: @Xiryl\nSito Web:[chiarani.it](www.chiarani.it)\n\n*Fonti utilizzate*:\n• [Protezione Civile](http://www.protezionecivile.it/attivita-rischi/rischio-sanitario/emergenze/coronavirus)\n• [PCM-DPC COVID-19 PROT.CIV. ITALIA](https://github.com/pcm-dpc/COVID-19)\n• [Protezione Civile Trento](http://www.protezionecivile.tn.it)\n\n*Comandi disponibili:*\n/ultimidati (ottieni gli ultimi dati)\n/ripartizione (tabelle ripartizioni)\n/comunicati (documenti e/o comunicati)\n/info (info sull bot)\n\n`;
    ctx.replyWithMarkdown(message, keyboard.defKeyboard);
});

/**
 * ============================================================================
 *                         LATEST DATA COMMAND
 * ============================================================================
 */
bot.hears(RE_DATA, (ctx) => {
    middleware.getTrentoData().then( (message) => {
        const user = JSON.stringify(ctx.chat);
        const date = new Date().toISOString();
        logger.send({
            text: `${date} - command: /ultimidati, user:${user}`
        });
        return ctx.replyWithMarkdown(message, keyboard.defKeyboard);
    });
});

/**
 * ============================================================================
 *                         LATEST DATA COMMAND
 * ============================================================================
 */
bot.command('ultimidati', (ctx) => {
    middleware.getTrentoData().then( (message) => {
        const user = JSON.stringify(ctx.chat);
        const date = new Date().toISOString();
        logger.send({
            text: `${date} - command: /ultimiDati, user:${user}`
        });
        return ctx.replyWithMarkdown(message, keyboard.defKeyboard);
    });
});

/**
 * ============================================================================
 *                         LATEST DATA COMMAND
 * ============================================================================
 */
bot.command('ripartizione', (ctx) => {

    const date = new Date().toISOString();
    const today = `${date.split('-')[0]}${date.split('-')[1]}${date.split('-')[2].substr(0, 2)}`;
    console.log(today);
    const linkRegioni = `https://github.com/pcm-dpc/COVID-19/raw/master/schede-riepilogative/regioni/dpc-covid19-ita-scheda-regioni-${today}.pdf`;
    const linkProvincia = `https://github.com/pcm-dpc/COVID-19/raw/master/schede-riepilogative/province/dpc-covid19-ita-scheda-province-${today}.pdf`;
    const message = `Ripartizione per regione e provincia:\n${emoji.get(':arrow_right:')} [Premi qui per la regione](${linkRegioni})\n${emoji.get(':arrow_right:')} [Premi qui per la provincia](${linkProvincia})`;

    const user = JSON.stringify(ctx.chat);
        const tmpDate = new Date().toISOString();
        logger.send({
            text: `${tmpDate} - command: /ripartizione, user:${user}`
        });
    return  ctx.replyWithMarkdown(message, keyboard.defKeyboard);
});

/**
 * ============================================================================
 *                         OFFICIAL DOC COMMAND
 * ============================================================================
 */
bot.command('comunicati', (ctx) => {
    middleware.getDocuments().then( (message) => {
        const user = JSON.stringify(ctx.chat);
        const date = new Date().toISOString();
        logger.send({
            text: `${date} - command: /comunicati, user:${user}`
        });
        return ctx.replyWithMarkdown(message, keyboard.defKeyboard);
    });
});

/**
 * ============================================================================
 *                         OFFICIAL DOC COMMAND
 * ============================================================================
 */
bot.hears(RE_DOC, (ctx) => {
    middleware.getDocuments().then( (message) => {
        const user = JSON.stringify(ctx.chat);
        const date = new Date().toISOString();
        logger.send({
            text: `${date} - command: /comunicati, user:${user}`
        });
        return ctx.replyWithMarkdown(message, keyboard.defKeyboard);
    });
});

bot.on('text', (ctx) => {
    const user = JSON.stringify(ctx.chat);
    const date = new Date().toISOString();
    logger.send({
        text: `${date} - no command, user:${user}`
    });
    const err = `Non conosco il comando.\nProva /info.`;
    return ctx.replyWithMarkdown(err);
});
  
/**
 * ============================================================================
 *                              ERROR HANDLER
 * ============================================================================
 */
bot.catch((err) => {
    console.log('ERROR', err)
})

/**
 * ============================================================================
 *                              START BOT
 * ============================================================================
 */
bot.launch();