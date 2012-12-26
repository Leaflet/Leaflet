/*
 * L.i18n handles locales registration and string translation.
 */

L.locales = {};
L.locale = null;
L.registerLocale = function registerLocale(code, locale) {
    L.locales[code] = L.Util.extend({}, L.locales[code], locale);
};
L.setLocale = function setLocale(code) {
    L.locale = code;
};
L.i18n = L._ = function translate(string, data) {
    if (L.locale && L.locales[L.locale] && L.locales[L.locale][string]) {
        string = L.locales[L.locale][string];
    }
    try {
        // Do not fail if some data is missing;
        // A bad translation should not break the app
        string = L.Util.template(string, data);
    }
    catch (err) {/*pass*/}

    return string;
};