var key = '_leaflet_events';

L.Mixin = {};

L.Mixin.Events = {

    /**--------------------------------------------------
     * addEventListener
     * @param {String|Object} types
     * @param {!Function} fn
     * @param {Object} context
     * @return {*}
     * --------------------------------------------------
     */
    addEventListener : function( types, fn, context ) {

        // if this['_leaflet_event'] doesn't exist, return {}
        var events = this[key] = this[key] || {},
            type, i, len;

        // types can be map of types/handlers.
        // return, once listener(s) has been added
        if( typeof types === 'object' ) {

            for( type in types ) {

                // only add direct property, not 'inherited' one from prototype chain
                if( types.hasOwnProperty(type) ) {
                    this.addEventListener(type, types[type], fn);
                }
            }
            return this;
        }

        //---------------------------------------------------------
        // types can be string,
        // which has 1 or more events name separated by whitespace
        // ie 'mapclick maprefresh mapdoublclick'
        //---------------------------------------------------------
        types = L.Util.splitWords( types );

        for( i=0, len = types.length; i<len; i++ ) {

            // add listener name, i.e. 'mapclick'
            events[ types[i] ] = events[ types[i] ] // mapclick added before, retrieve it,
                || [];             // or init new entry in events

            // bind 'mapclick' string to function 'fn'
            events[ types[i] ].push( {
                action: fn,
                context: context || this
            });
        }

        return this;
    },


    /**-----------------------------------
     * Check if event listener exists
     * @param {String} type
     * @return {Boolean}
     * -----------------------------------
     */
    hasEventListeners : function( type ) {
        return (key in this)                     // '_leaflet_events' defined ?
            && (type in this[key])            // this['_leaflet_events']['mapclick'] defined ?
            && (this[key][type].length > 0);  // mapclick handler > 0
    },

    /**-----------------------------------
     * removeEventListener
     * @param {String|Object} types
     * @param {Function} fn
     * @param {Object} context
     * @return {*}
     */
    removeEventListener: function( types, fn, context ) {

        var events = this[key],
            type, i, len, listeners, j;

        if( typeof types === 'object' ) {
            for( type in types ) {
                if( types.hasOwnProperty(type) ) {
                    this.removeEventListener( type, types[type], fn );
                }
            }
            return this;
        }

        types = L.Util.splitWords(types);

        for(i=0, len=types.length; i<len; i++ ) {

            if( this.hasEventListeners( types[i] )) {
                listeners = events[ types[i] ];

                for(j = listeners.length - 1; j >= 0; j-- ) {

                    if( (!fn // function to remove not specified
                        || listeners[j].action === fn )

                        && (!context // context not specified, assume 'this' context
                        || (listeners[j].context === context))
                        ) {
                        // remove function listener
                        listeners.splice(j, 1);
                    }
                }
            }
        }

        return this;
    },

    /**----------------------------------------------
     * fireEvent
     * @param {String} type
     * @param {Object} data
     * @return {*}
     * ----------------------------------------------
     */
    fireEvent: function( type, data ) {
        if( !this.hasEventListeners(type) ) {
            return this;
        }

        // add event type and target into event parameter
        var event = L.Util.extend({
            type: type,
            target: this
        }, data);

        // is slice() needed ? chrome,safari,FF dont need it, IE ?
        var listeners = this[key][type].slice();

        for( var i= 0, len = listeners.length; i<len; i++ ) {
            listeners[i].action.call( listeners[i].context  // context specified
                || this
                , event);
        }

        return this;
    }
};

L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin.Events.fire = L.Mixin.Events.fireEvent;