import {locale, setLocale, registerLocale, translate, Map} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('I18n', () => {
	beforeEach(() => {
		const fr = {
			'Simple phrase to translate': 'Une simple phrase à traduire',
			'A phrase with a {variable} to translate': 'Une phrase à traduire avec une {variable}',
			'A phrase with empty translation': ''
		};
		registerLocale('fr', fr);
		setLocale('fr');
	});

	it('expects current locale to be fr', () => {
		expect(locale).to.eql('fr');
	});

	it('should translate simple sentences', () => {
		expect(translate('Simple phrase to translate')).to.eql('Une simple phrase à traduire');
	});

	it('should translate sentences with a variable', () => {
		expect(translate('A phrase with a {variable} to translate', {variable: 'foo'})).to.eql('Une phrase à traduire avec une foo');
	});

	it('should translate empty translations', () => {
		expect(translate('A phrase with empty translation')).to.eql('');
	});

	it('should allow to override some translations', () => {
		registerLocale('fr', {'A phrase with empty translation': 'my custom translation'});
		expect(translate('A phrase with empty translation')).to.eql('my custom translation');
		// Unchanged
		expect(translate('Simple phrase to translate')).to.eql('Une simple phrase à traduire');
	});

	it('should not fail if a variable is missing', () => {
		expect(translate('A phrase with a {variable} to translate')).to.eql('Une phrase à traduire avec une {variable}');
	});

	it('should not fail if the translation is missing', () => {
		expect(translate('A missing translation')).to.eql('A missing translation');
	});

	it('should not fail if the locale is missing', () => {
		setLocale('foo');
		expect(translate('Simple phrase to translate')).to.eql('Simple phrase to translate');
	});

	it('should allow to add many locales', () => {
		const it = {
			'Simple phrase to translate': 'Frase semplice da tradurre',
			'A phrase with a {variable} to translate': 'Una frase da tradurre con {variable}',
			'A phrase with empty translation': ''
		};
		registerLocale('it', it);
		setLocale('it');
		expect(translate('Simple phrase to translate')).to.eql('Frase semplice da tradurre');
		setLocale('fr');
		expect(translate('Simple phrase to translate')).to.eql('Une simple phrase à traduire');
	});

});


describe('Map.I18n', () => {

	it('should be possible to translate Leaflet strings', () => {
		const container = createContainer();
		const fr = {
			'Zoom in': 'Zoomer',
			'Zoom out': 'Dézoomer',
			'A JavaScript library for interactive maps': 'Bibliothèque JavaScript pour cartes interactives',
		};
		registerLocale('fr', fr);
		setLocale('fr');
	    const map = new Map(container);
		map.setView([0, 0], 0);
		expect(document.querySelector('.leaflet-control-zoom-in').title).to.eql('Zoomer');
		expect(document.querySelector('.leaflet-control-zoom-out').title).to.eql('Dézoomer');
		expect(document.querySelector('.leaflet-control-attribution a').title).to.include('Bibliothèque JavaScript pour cartes interactives');
		removeMapContainer(map, container);
	});

});
