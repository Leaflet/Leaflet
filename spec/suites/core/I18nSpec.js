import {I18n, Map} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';
import {expect} from 'chai';

describe('I18n', () => {
	beforeEach(() => {
		const fr = {
			'Simple phrase to translate': 'Une simple phrase à traduire',
			'A phrase with a {variable} to translate': 'Une phrase à traduire avec une {variable}',
			'A phrase with empty translation': ''
		};
		I18n.registerLocale('fr', fr);
		I18n.setLocale('fr');
	});

	it('returns the configured locale', () => {
		expect(I18n.getLocale()).to.eql('fr');
	});

	it('translates simple sentences', () => {
		expect(I18n.translate('Simple phrase to translate')).to.eql('Une simple phrase à traduire');
	});

	it('translates sentences with a variable', () => {
		expect(I18n.translate('A phrase with a {variable} to translate', {variable: 'foo'})).to.eql('Une phrase à traduire avec une foo');
	});

	it('preserves the input when the translation is empty', () => {
		expect(I18n.translate('A phrase with empty translation')).to.eql('A phrase with empty translation');
	});

	it('extends existing translations', () => {
		I18n.registerLocale('fr', {'A phrase with empty translation': 'my custom translation'});
		expect(I18n.translate('A phrase with empty translation')).to.eql('my custom translation');
		// Unchanged
		expect(I18n.translate('Simple phrase to translate')).to.eql('Une simple phrase à traduire');
	});

	it('preserves placeholders when omitting variables', () => {
		expect(I18n.translate('A phrase with a {variable} to translate')).to.eql('Une phrase à traduire avec une {variable}');
	});

	it('preserves placeholders when omitting variables when a translation is missing', () => {
		I18n.registerLocale('fr', {'A phrase with a {variable} to translate': ''});
		expect(I18n.translate('A phrase with a {variable} to translate', {variable: 'foo'})).to.eql('A phrase with a foo to translate');
	});

	it('preserves the input when a translation is missing', () => {
		expect(I18n.translate('A missing translation')).to.eql('A missing translation');
	});

	it('preserves the input if the locale is unknown', () => {
		I18n.setLocale('foo');
		expect(I18n.translate('Simple phrase to translate')).to.eql('Simple phrase to translate');
	});

	it('translates from multiple locales', () => {
		const it = {
			'Simple phrase to translate': 'Frase semplice da tradurre',
			'A phrase with a {variable} to translate': 'Una frase da tradurre con {variable}',
			'A phrase with empty translation': ''
		};
		I18n.registerLocale('it', it);
		I18n.setLocale('it');
		expect(I18n.translate('Simple phrase to translate')).to.eql('Frase semplice da tradurre');
		I18n.setLocale('fr');
		expect(I18n.translate('Simple phrase to translate')).to.eql('Une simple phrase à traduire');
	});

});


describe('Map.I18n', () => {

	it('translates built-in Leaflet strings', () => {
		const container = createContainer();
		const fr = {
			'Zoom in': 'Zoomer',
			'Zoom out': 'Dézoomer',
			'A JavaScript library for interactive maps': 'Bibliothèque JavaScript pour cartes interactives',
		};
		I18n.registerLocale('fr', fr);
		I18n.setLocale('fr');
		const map = new Map(container);
		map.setView([0, 0], 0);
		expect(document.querySelector('.leaflet-control-zoom-in').title).to.eql('Zoomer');
		expect(document.querySelector('.leaflet-control-zoom-out').title).to.eql('Dézoomer');
		expect(document.querySelector('.leaflet-control-attribution a').title).to.include('Bibliothèque JavaScript pour cartes interactives');
		removeMapContainer(map, container);
	});

});
