import * as Util from './Util.js';

/*
 * @namespace I18n
 *
 * Utility functions to deal with translations.
 */

export class I18n {
	// @property messages: Object
	// All localized strings.
	static messages = {};

	// @property locale: String
	// The current locale code, that will be used when translating strings.
	static locale = null;

	// @function registerLocale(locale: String, messages?: Object): String
	// Define localized strings for a given locale, defined by `locale`.
	static registerLocale(locale, messages) {
		this.messages[locale] = {...this.messages[locale], ...messages};
	}

	// @function setLocale(locale: String): undefined
	// Define or change the locale code to be used when translating strings.
	static setLocale(locale) {
		this.locale = locale;
	}

	// @function translate(string: String, data?: Object): String
	// Actually try to translate the `string`, with optional variable passed in `data`.
	static translate(string, data = {}) {
		const s = this.messages[this.locale ?? '?']?.[string];
		if (typeof s === 'string') {
			string = s;
		}
		try {
			// Do not fail if some data is missing
			// a bad translation should not break the app
			string = Util.template(string, data);
		} catch (err) {
			console.error('Leaflet translate', err);
		}

		return string;
	}

}
