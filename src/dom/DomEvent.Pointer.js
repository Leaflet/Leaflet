/*
 * Extends L.DomEvent to provide touch support for Pointer event based devices.
 */

L.extend(L.DomEvent, {

    _pointerTouches: [],
    _DocumentListener: false,

    // Provides a touch events wrapper for msPointer events.
    // Based on changes by veproza https://github.com/CloudMade/Leaflet/pull/1019

    addPointerListener: function (obj, type, handler, id) {

        switch (type) {
            case 'touchstart':
                return this.addPointerListenerStart(obj, type, handler, id);
            case 'touchend':
                return this.addPointerListenerEnd(obj, type, handler, id);
            case 'touchmove':
                return this.addPointerListenerMove(obj, type, handler, id);
            default:
                throw 'Unknown touch event type';
        }
    },

    addPointerListenerStart: function (obj, type, handler, id) {
        var pre = '_leaflet_',
		    touches = this._pointerTouches;

        var cb = function (e) {

            var alreadyInArray = false;
            for (var i = 0; i < touches.length; i++) {
                if (touches[i].pointerId === e.pointerId) {
                    alreadyInArray = true;
                    break;
                }
            }
            if (!alreadyInArray) {
                touches.push(e);
            }

            e.touches = touches.slice();
            e.changedTouches = [e];

            handler(e);
        };

        obj[pre + 'touchstart' + id] = cb;
        obj.addEventListener('pointerdown', cb, false);

        // need to also listen for end events to keep the _msTouches list accurate
        // this needs to be on the body and never go away
        if (!this._DocumentListener) {
            var internalCb = function (e) {
                for (var i = 0; i < touches.length; i++) {
                    if (touches[i].pointerId === e.pointerId) {
                        touches.splice(i, 1);
                        break;
                    }
                }
            };
            //We listen on the documentElement as any drags that end by moving the touch off the screen get fired there
            document.documentElement.addEventListener('pointerup', internalCb, false);
            document.documentElement.addEventListener('pointercancel', internalCb, false);

            this._DocumentListener = true;
        }

        return this;
    },

    addPointerListenerMove: function (obj, type, handler, id) {
        var pre = '_leaflet_',
		    touches = this._pointerTouches;

        function cb(e) {

            // don't fire touch moves when mouse isn't down
            if (e.pointerType === e.MSPOINTER_TYPE_MOUSE && e.buttons === 0) { return; }

            for (var i = 0; i < touches.length; i++) {
                if (touches[i].pointerId === e.pointerId) {
                    touches[i] = e;
                    break;
                }
            }

            e.touches = touches.slice();
            e.changedTouches = [e];

            handler(e);
        }

        obj[pre + 'touchmove' + id] = cb;
        obj.addEventListener('pointermove', cb, false);

        return this;
    },

    addPointerListenerEnd: function (obj, type, handler, id) {
        var pre = '_leaflet_',
		    touches = this._pointerTouches;

        var cb = function (e) {
            for (var i = 0; i < touches.length; i++) {
                if (touches[i].pointerId === e.pointerId) {
                    touches.splice(i, 1);
                    break;
                }
            }

            e.touches = touches.slice();
            e.changedTouches = [e];

            handler(e);
        };

        obj[pre + 'touchend' + id] = cb;
        obj.addEventListener('pointerup', cb, false);
        obj.addEventListener('pointercancel', cb, false);

        return this;
    },

    removePointerListener: function (obj, type, id) {
        var pre = '_leaflet_',
		    cb = obj[pre + type + id];

        switch (type) {
            case 'touchstart':
                obj.removeEventListener('pointerdown', cb, false);
                break;
            case 'touchmove':
                obj.removeEventListener('pointermove', cb, false);
                break;
            case 'touchend':
                obj.removeEventListener('pointerup', cb, false);
                obj.removeEventListener('pointercancel', cb, false);
                break;
        }

        return this;
    }
});