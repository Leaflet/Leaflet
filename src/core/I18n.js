import * as Util from './Util.js';

/*
 * @namespace I18n
 *
 * Utility functions to deal with translations.
 */

export class I18n {
	// @property messages: Object
	// All localized strings.
	static #messages = {};

	// @property locale: String
	// The current locale code, that will be used when translating strings.
	static #locale = null;

	// @function registerLocale(locale: String, messages?: Object): undefined
	// Define localized strings for a given locale, defined by `locale`.
	static registerLocale(locale, messages) {
		this.#messages[locale] = {...this.#messages[locale], ...messages};
	}

	// @function setLocale(locale: String): undefined
	// Define or change the locale code to be used when translating strings.
	// Note that changing the locale does not affect already instantiated objects.
	static setLocale(locale) {
		this.#locale = locale;
	}

	// @method getLocale(): String
	// Returns the current locale code, that will be used when translating strings.
	static getLocale() {
		return this.#locale;
	}

	// @function translate(string: String, data?: Object): String
	// Actually try to translate the `string`, with optional variable passed in `data`.
	static translate(string, data = {}) {
		// If the locale is not set, localization is not enabled.
		if (this.#locale === null) {
			return Util.template(string, data);
		}

		const translation = this.#messages[this.#locale]?.[string];

		if (!translation) {
			console.warn(`No translation found for "${string}", falling back to the original string.`);
			return Util.template(string, data);
		}

		try {
			// Do not fail if some data is missing
			// a bad translation should not break the app
			return Util.template(translation, data);
		} catch (err) {
			console.error(`Error while translating "${translation}".`, err);
			return translation;
		}
	}

}
