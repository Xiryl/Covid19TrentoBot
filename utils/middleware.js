const csvParser = require('csv-string');
const API = require('./../lib/API');
const emoji = require('node-emoji');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const COD_PROV = "04";
const NAME_PROV = "P.A. Trento";
const baseurl = "http://avvisi.protezionecivile.tn.it/PDFViewer.aspx?enc=";

/**
 * ============================================================================
 *                              PARSE DATA
 * ============================================================================
 */
getTrentoData = () => new Promise((resolve, reject) => {
    API.GET_latest_data_tn().then( (payload) => {
        const data = csvParser.parse(payload);
        const trentoData = data.filter( (el) => el[2] === COD_PROV && el[3] == NAME_PROV);

        if(trentoData) {
            const reply = buildMessage(trentoData[0]);
            resolve(reply);
        } else {
            const err = `${emoji.get(':thinking_face:')} Oops, qualcosa è andato storto. Riprova.`;
            resolve(err);
        }
    });
});

/**
 * ============================================================================
 *                              helper func
 * ============================================================================
 */
buildMessage = (payload) => {
    /** 
     * CSV line format
     * [0] data
     * [1] stato
     * [2] codice_regione
     * [3] denominazione_regione
     * [4] lat
     * [5] long
     * [6] ricoverati_con_sintomi
     * [7] terapia_intensiva
     * [8] totale_ospedalizzati
     * [9] isolamento_domiciliare
     * [10] totale_positivi
     * [11] variazione_totale_positivi
     * [12] nuovi_positivi
     * [13] dimessi_guariti
     * [14] deceduti
     * [15] totale_casi
     * [16] tamponi
     * [17] note_it
     * [18] note_en
     */

    // console.log(payload);
    const date = payload[0].split('T')[0];
    const time = payload[0].split('T')[1];
    const ricoverati_con_sintomi = payload[6];
    const terapia_intensiva = payload[7];
    const totale_ospedalizzati = payload[8];
    const isolamento_domiciliare = payload[9];
    const totale_positivi = payload[10];
    const variazione_totale_positivi = payload[11];
    const nuovi_positivi = payload[12];
    const dimessi_guariti = payload[13];
    const deceduti = payload[14];
    const totale_casi = payload[15];
    const tamponi = payload[16];
    const message = `${emoji.get(':information_source:')} Dati relativi alla P.A. Trento:\n\n• Ricoverati con sintomi: *${ricoverati_con_sintomi}*\n• Terapia intensiva: *${terapia_intensiva}*\n• Isolamento domiciliare: *${isolamento_domiciliare}*\n• Nuovi positivi: *${nuovi_positivi}*\n• Dimessi guariti: *${dimessi_guariti}*\n• Deceduti: *${deceduti}*\n• Tamponi: *${tamponi}*\n\n• Totale positivi: *${totale_positivi}*\n• Variazione totale positivi: *${variazione_totale_positivi}*\n• Totale ospedalizzati: *${totale_ospedalizzati}*\n• Totale casi: *${totale_casi}*\n\n${emoji.get(':calendar:')} ${date}, ore ${time}\n\n/info\n@covid19trentobot`;
    return message;
}

/**
 * ============================================================================
 *                              DOCUMENT LIST
 * ============================================================================
 */
let getDocuments = () => new Promise((resolve, reject) => {
    API.GET_AlertsList().then( (body) => { 
        const dom = new JSDOM(body, {resources:'usable', runScripts: 'dangerously'});
        let avvisi = "Ultimi avvisi dalla protezione civile:\n*In allegato l'ultimo avviso*:\n\n[Clicca qui](http://avvisi.protezionecivile.tn.it/elencoavvisi.aspx) _per vedere tutti gli avvisi._\n\n";
        let global = 0;
        dom.window.document.querySelector("ul").querySelectorAll("li").forEach(element => {
            let counter = 0;
            let link = "";
            element.querySelectorAll("span").forEach(spanEl => {
                if(counter === 0) {
                    counter ++;
                    try {
                        link = element.querySelector("span").querySelector("a").getAttribute('onclick').split("/PDFViewer.aspx?enc=")[1].split('\'')[0];
                        avvisi += "\n⚠️ *" +spanEl.textContent.trim().toUpperCase() + "*" ;
                    } catch(ex) {

                    }
                } else if(counter === 1) {
                    counter ++;
                    
                    avvisi += "\n       🌐 ["+spanEl.textContent.trim() +"]("+baseurl+link + ")";
                } else {
                    counter = 0;
                }

                global++;

                if (global === 12 ) {
                    resolve(avvisi);
                }
            });
        });
    });
});

module.exports = {
    getTrentoData,
    getDocuments
};