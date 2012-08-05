describe( 'DomEvent', function() {
    var el;

    function simulateClick( el ) {
        if( document.createEvent ) {

            // Modern browser
            var e = document.createEvent('MouseEvent');

            e.initMouseEvent('click', true, true, window,
                0, 0, 0, 0, 0,
                false, false, false, false, 0, null);

            return el.dispatchEvent(e);

        } else if( el.fireEvent ) {

            // IE6+
            return el.fireEvent( 'onclick' );
        }
    }

    function simulateScroll( el ) {
        if( document.createEvent ) {

            // FF, Safari,Chrome
            var e = document.createEvent('MouseEvent');
            // either MouseEvent or MouseEvents is fine

            e.initMouseEvent(
                'DOMMouseScroll',
                true,   // in boolean canBubbleArg,
                true,   // in boolean cancelableArg,
                window, // in views::AbstractView viewArg,
                120,    // in long detailArg
                0,      // in long screenXArg,
                0,      // in long screenYArg,
                0,      // in long clientXArg,
                0,      // in long clientYArg,
                0,      // in boolean ctrlKeyArg,
                0,      // in boolean altKeyArg,
                0,      // in boolean shiftKeyArg,
                0,      // in boolean metaKeyArg,
                0,      // in unsigned short buttonArg,
                null    // in EventTarget relatedTargetArg
            );
            return el.dispatchEvent(e);

        } else if( el.fireEvent ) {

            // IE
            return el.fireEvent('onmousewheel');
        }
    }

    function simulateMouseEnter( el ) {
        if( document.createEvent ) {
            // FF, Safari,Chrome
            var e = document.createEvent('MouseEvent');
            // either MouseEvent or MouseEvents is fine

            e.initMouseEvent(
                'mouseover',
                true,   // in boolean canBubbleArg,
                true,   // in boolean cancelableArg,
                window, // in views::AbstractView viewArg,
                0,    // in long detailArg
                0,      // in long screenXArg,
                0,      // in long screenYArg,
                0,      // in long clientXArg,
                0,      // in long clientYArg,
                0,      // in boolean ctrlKeyArg,
                0,      // in boolean altKeyArg,
                0,      // in boolean shiftKeyArg,
                0,      // in boolean metaKeyArg,
                0,      // in unsigned short buttonArg,
                null    // in EventTarget relatedTargetArg
            );
            return el.dispatchEvent(e);

        } else if( el.fireEvent ) {

            return el.fireEvent('onmouseenter')
        }

    }

    beforeEach( function() {
        el = document.createElement( 'div' );
        el.style.position = 'absolute';
        el.style.top = el.style.left = '-10000px';
        document.body.appendChild( el );
    });

    afterEach( function() {
        document.body.removeChild( el );
    });

    describe('#addListener', function() {
        it('should add listener & call it on event', function() {
            var listener1 = jasmine.createSpy('listener1');
            var listener2 = jasmine.createSpy('listener2');

            L.DomEvent.addListener( el, 'click', listener1 );
            L.DomEvent.addListener( el, 'click', listener2 );

            simulateClick( el );

            expect( listener1 ).toHaveBeenCalled();
            expect( listener2 ).toHaveBeenCalled();
        });

        it('should have "this" keyword point to given context', function() {
            var obj = { foo: 'bar' },
                result;

            L.DomEvent.addListener( el, 'click',
                function() { result = this; },
                obj);

            simulateClick(el);

            expect(result).toEqual(obj);
        });

        it('should pass an event object to listener', function() {
            var type;
            L.DomEvent.addListener( el, 'click',
                function(e) { type = e && e.type; }
            );

            simulateClick(el);
            expect(type).toEqual('click');
        });

        it('should add mousewheel event and remove it', function() {
            var listener1 = jasmine.createSpy('listener1');
            var listener2 = jasmine.createSpy('listener2');

            L.DomEvent.addListener( el, 'mousewheel', listener1 );
            L.DomEvent.addListener( el, 'mousewheel', listener2 );

            simulateScroll(el);

            expect( listener1).toHaveBeenCalled();
            expect( listener2).toHaveBeenCalled();

            L.DomEvent.removeListener( el, 'mousewheel', listener1 );
            L.DomEvent.removeListener( el, 'mousewheel', listener2 );

            simulateScroll(el);

            expect(listener1.callCount).toBe(1);
            expect(listener2.callCount).toBe(1);
        });

        it('should add mouseenter event and remove it', function() {

            var listener1 = jasmine.createSpy('listener1');
            var listener2 = jasmine.createSpy('listener2');

            L.DomEvent.addListener( el, 'mouseenter', listener1);
            L.DomEvent.addListener( el, 'mouseenter', listener2);

            simulateMouseEnter(el);

            expect(listener1).toHaveBeenCalled();
            expect(listener2).toHaveBeenCalled();

            L.DomEvent.removeListener(el, 'mouseenter', listener1);
            L.DomEvent.removeListener(el, 'mouseenter', listener2);

            simulateMouseEnter(el);

            expect(listener1.callCount).toBe(1);
            expect(listener2.callCount).toBe(1);

        })

    });

    describe('#removeListener', function() {
        it('should remove previously added listener', function() {
            var listener = jasmine.createSpy('listener');

            L.DomEvent.addListener(el, 'click', listener);
            L.DomEvent.removeListener(el, 'click', listener);

            simulateClick(el);

            expect(listener).not.toHaveBeenCalled();
        });
    });

    describe('#stopPropagation', function() {
        it('should stop propagation of given event', function() {
            var child = document.createElement('div');
            var listener = jasmine.createSpy('listener');

            el.appendChild(child);
            L.DomEvent.addListener(child, 'click', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(el, 'click', listener);

            simulateClick( child );
            expect( listener).not.toHaveBeenCalled();
            el.removeChild( child );
        });
    });

    describe('#preventDefault', function(){
        it('should prevent default action of event', function() {
            L.DomEvent.addListener(el, 'click', L.DomEvent.preventDefault);
            expect(simulateClick(el)).toBe(false);
        })
    });

});