describe("I18n", function() {

    beforeEach(function() {
        var fr = {
            "Simple phrase to translate": "Une simple phrase à traduire",
            "A phrase with a {variable} to translate": "Une phrase à traduire avec une {variable}"
        };
        L.registerLocale('fr', fr);
        L.setLocale('fr');
    });

    it("should translate simple sentences", function() {
        expect(L._("Simple phrase to translate")).toEqual("Une simple phrase à traduire");
    });

    it("should translate sentences with a variable", function() {
        expect(L._("A phrase with a {variable} to translate", {variable: "foo"})).toEqual("Une phrase à traduire avec une foo");
    });

    it("should not fail if a variable is missing", function() {
        expect(L._("A phrase with a {variable} to translate")).toEqual("Une phrase à traduire avec une {variable}");
    });

    it("should not fail if the translation is missing", function() {
        expect(L._("A missing translation")).toEqual("A missing translation");
    });

    it("should not fail if the locale is missing", function() {
        L.setLocale('foo');
        expect(L._("Simple phrase to translate")).toEqual("Simple phrase to translate");
    });

});