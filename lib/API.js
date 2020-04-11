const p = require('phin').unpromisified;

/**
 * ============================================================================
 *                  		  LATEST DATA
 * ============================================================================
 */
let GET_latest_data_tn = () => new Promise((resolve, reject) => {
	let options = {
		method: 'GET',
		url: `https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni-latest.csv`,
	};

    p(options, (error, response) => {
		if (error) {
			reject(error);
        }
		else if (response.statusCode == 200) {
			resolve(response.body.toString());
		}
		else {
			reject(error);
		}
	});
});

/**
 * ============================================================================
 *                  			  ALERT LIST
 * ============================================================================
 */
let GET_AlertsList = () => new Promise((resolve, reject) => {
	let options = {
		method: 'GET',
		url: `http://avvisi.protezionecivile.tn.it/elencoavvisi.aspx`
	};

    p(options, (error, response) => {
		if (error) {
			reject(error);
        }
        
		else if (response.statusCode == 200) {
			resolve(response.body);
		}
		else {
			reject(error);
		}
	});
});


module.exports = {
	GET_latest_data_tn,
	GET_AlertsList
};
