import {Browser} from 'leaflet';

describe('Browser', () => {
	it('exports expected properties', () => {
		expect(Browser).to.be.an('object');
		expect(Browser).to.have.property('chrome');
		expect(Browser).to.have.property('safari');
		expect(Browser).to.have.property('mobile');
		expect(Browser).to.have.property('pointer');
		expect(Browser).to.have.property('touch');
		expect(Browser).to.have.property('touchNative');
		expect(Browser).to.have.property('retina');
		expect(Browser).to.have.property('mac');
		expect(Browser).to.have.property('linux');
	});

	it('all properties are booleans', () => {
		for (const [key, value] of Object.entries(Browser)) {
			expect(value, `Browser.${key}`).to.be.a('boolean');
		}
	});

	it('touch is true when pointer or touchNative is true', () => {
		if (Browser.pointer || Browser.touchNative) {
			expect(Browser.touch).to.be.true;
		}
	});

	it('chrome and safari are mutually exclusive', () => {
		if (Browser.chrome) {
			expect(Browser.safari).to.be.false;
		}
	});
});
