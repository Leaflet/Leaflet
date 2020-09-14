module.exports = function (wallaby) {
	return {
    //files: ['src/**/*.js'],
    files: ['dist/**/leaflet-src.js'],

        tests: ['spec/**/*Spec.js'],
        
        setup: wallaby => {

          // var jsdom = require('jsdom');
          // global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
          // global.window = document.defaultView;
          // global.navigator = global.window.navigator;

            const mocha = wallaby.testFramework;
            //const chai = require('chai');
            const sinon = require('sinon');
            console.log('sinon',sinon);
      
//            chai.use(require('sinon-chai'));
      
            // setup sinon hooks
            mocha.suite.beforeEach('sinon before', function() {
              if (null == this.sinon) {
                this.sinon = sinon.createSandbox();
              }
            });
            mocha.suite.afterEach('sinon after', function() {
              if (this.sinon && 'function' === typeof this.sinon.restore) {
                this.sinon.restore();
              }
            });
      
            //global.expect = require('chai').expect;
          },
		
        testFramework: 'mocha',

        env: {
            type: 'browser'
        }
	};
};
