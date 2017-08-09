// Type definitions for Leaflet.js 1.0-rc1
// Project: https://github.com/Leaflet/Leaflet
// Definitions by: Nathan Cahill <https://github.com/nathancahill>
// Based on definitions by: Vladimir Zotov <https://github.com/rgripper>

declare namespace L {
    /**
      * Instantiates a map object given a div element and optionally an
      * object literal with map options described below.
      */
    function map(id: HTMLElement | string, options?: MapOptions): Map;

    export interface MapStatic extends ClassStatic {
        /**
          * Instantiates a map object given a div element and optionally an
          * object literal with map options described below.
          */
        new(id: HTMLElement | string, options?: MapOptions): Map;
    }

    export var Map: MapStatic;

    export interface Map extends Evented {
        options: MapOptions;

        /**
         * Returns the instance of Renderer that should be used to render the given Path.
         * It will ensure that the renderer options of the map and paths are respected,
         * and that the renderers do exist on the map.
         */
        getRenderer(layer: Path): Renderer;

        // Methods for Layers and Controls

        /**
          * Adds the given layer to the map
          */
        addLayer(layer: Layer): this;

        /**
          * Removes the given layer from the map.
          */
        removeLayer(layer: Layer): this;

        /**
          * Returns true if the given layer is currently added to the map.
          */
        hasLayer(layer: Layer): boolean;

        /**
          * Iterates over the layers of the map, optionally specifying context
          * of the iterator function.
          */
        eachLayer(fn: (layer: Layer) => void, context?: any): this;

        /**
          * Opens the specified popup while closing the previously opened (to make sure
          * only one is opened at one time for usability).
          */
        openPopup(popup: Popup): this;

        /**
          * Creates a popup with the specified options and opens it in the given point
          * on a map.
          */
        openPopup(html: string, latlng: LatLngExpression, options?: PopupOptions): this;

        /**
          * Creates a popup with the specified options and opens it in the given point
          * on a map.
          */
        openPopup(el: HTMLElement, latlng: LatLngExpression, options?: PopupOptions): this;

        /**
          * Closes the popup previously opened with openPopup (or the given one).
          */
        closePopup(popup?: Popup): this;

        /**
         * Adds the given control to the map.
         */
        addControl(control: Control): this;

        /**
         * Removes the given control from the map.
         */
        removeControl(control: Control): this;

        // Methods for Modifying Map State

        /**
          * Sets the view of the map (geographical center and zoom) with the given
          * animation options.
          */
        setView(center: LatLngExpression, zoom?: number, options?: ZoomPanOptions): this;

        /**
          * Sets the zoom of the map.
          */
        setZoom(zoom: number, options?: ZoomPanOptions): this;

        /**
          * Increases the zoom of the map by delta (1 by default).
          */
        zoomIn(delta?: number, options?: ZoomOptions): this;

        /**
          * Decreases the zoom of the map by delta (1 by default).
          */
        zoomOut(delta?: number, options?: ZoomOptions): this;

        /**
          * Zooms the map while keeping a specified point on the map stationary
          * (e.g. used internally for scroll zoom and double-click zoom).
          */
        setZoomAround(latlng: LatLngExpression, zoom: number, options?: ZoomOptions): this;

        /**
          * Sets a map view that contains the given geographical bounds with the maximum
          * zoom level possible.
          */
        fitBounds(bounds: LatLngBoundsExpression, options?: FitBoundsOptions): this;

        /**
          * Sets a map view that mostly contains the whole world with the maximum zoom
          * level possible.
          */
        fitWorld(options?: FitBoundsOptions): this;

        /**
          * Pans the map to a given center. Makes an animated pan if new center is not more
          * than one screen away from the current one.
          */
        panTo(latlng: LatLngExpression, options?: PanOptions): this;

        /**
          * Pans the map by a given number of pixels (animated).
          */
        panBy(point: PointExpression, options?: PanOptions): this;

        /**
          * Restricts the map view to the given bounds (see map maxBounds option),
          * passing the given animation options through to `setView`, if required.
          */
        setMaxBounds(bounds: LatLngBoundsExpression, options?: ZoomPanOptions): this;

        /**
         * Sets the lower limit for the available zoom levels (see the minZoom option).
         */
        setMinZoom(zoom: number): this;

        /**
         * Sets the upper limit for the available zoom levels (see the maxZoom option).
         */
        setMaxZoom(zoom: number): this;

        /**
          * Pans the map to the closest view that would lie inside the given bounds (if
          * it's not already).
          */
        panInsideBounds(bounds: LatLngBoundsExpression): this;

        /**
          * Checks if the map container size changed and updates the map if so — call it
          * after you've changed the map size dynamically, also animating pan by default.
          * If options.pan is false, panning will not occur.
          */
        invalidateSize(options: ZoomPanOptions): this;

        /**
          * Checks if the map container size changed and updates the map if so — call it
          * after you've changed the map size dynamically, also animating pan by default.
          */
        invalidateSize(animate: boolean): this;

        /**
         * Stops the currently running panTo or flyTo animation, if any.
         */
        stop(): this;

        /**
         * Sets the view of the map (geographical center and zoom) performing a smooth pan-zoom animation.
         */
        flyTo(latlng: LatLngExpression, zoom?: number, options?: ZoomPanOptions): this;

        /**
         * Sets the view of the map with a smooth animation like flyTo, but takes a bounds parameter like fitBounds.
         */
        flyToBounds(bounds: LatLngBoundsExpression, options?: FitBoundsOptions): this;

        // Other methods

        addHandler(name: string, handler: Handler): this;

        /**
          * Destroys the map and clears all related event listeners.
          */
        remove(): this;

        /**
         * Creates a new map pane with the given name if it doesn't exist already, then returns it.
         * The pane is created as a children of container, or as a children of the main map pane if not set.
         */
        createPane(name: string, container?: HTMLElement): HTMLElement;

        /**
         * Returns a map pane, given its name or its HTML element (its identity).
         */
        getPane(pane: string | HTMLElement): HTMLElement;

        /**
          * Returns an object with different map panes (to render overlays in).
          */
        getPanes(): MapPanes;

        /**
          * Returns the container element of the map.
          */
        getContainer(): HTMLElement;

        // REVIEW: Should we make it more flexible declaring parameter 'fn' as Function?
        /**
          * Runs the given callback when the map gets initialized with a place and zoom,
          * or immediately if it happened already, optionally passing a function context.
          */
        whenReady(fn: (map: Map) => void, context?: any): this;

        // Methods for Getting Map State

        /**
          * Returns the geographical center of the map view.
          */
        getCenter(): LatLng;

        /**
          * Returns the current zoom of the map view.
          */
        getZoom(): number;

        /**
          * Returns the LatLngBounds of the current map view.
          */
        getBounds(): LatLngBounds;

        /**
          * Returns the minimum zoom level of the map.
          */
        getMinZoom(): number;

        /**
          * Returns the maximum zoom level of the map.
          */
        getMaxZoom(): number;

        /**
          * Returns the maximum zoom level on which the given bounds fit to the map view
          * in its entirety. If inside (optional) is set to true, the method instead returns
          * the minimum zoom level on which the map view fits into the given bounds in its
          * entirety.
          */
        getBoundsZoom(bounds: LatLngBoundsExpression, inside?: boolean): number;

        /**
          * Returns the current size of the map container.
          */
        getSize(): Point;

        /**
          * Returns the bounds of the current map view in projected pixel coordinates
          * (sometimes useful in layer and overlay implementations).
          */
        getPixelBounds(): Bounds;

        /**
          * Returns the projected pixel coordinates of the top left point of the map layer
          * (useful in custom layer and overlay implementations).
          */
        getPixelOrigin(): Point;

        /**
         * Returns the world's bounds in pixel coordinates for zoom level zoom.
         * If zoom is omitted, the map's current zoom level is used.
         */
        getPixelWorldBounds(zoom?: number): Bounds;

        // Conversion methods

        /**
         * Returns the scale factor to be applied to a map transition from
         * zoom level fromZoom to toZoom. Used internally to help with zoom animations.
         */
        getZoomScale(toZoom: number, fromZoom: number): number;

        /**
         * Returns the zoom level that the map would end up at, if it is at
         * fromZoom level and everything is scaled by a factor of scale. Inverse of getZoomScale.
         */
        getScaleZoom(scale: number, fromZoom: number): number;

        /**
          * Projects the given geographical coordinates to absolute pixel coordinates
          * for the given zoom level (current zoom level by default).
          */
        project(latlng: LatLngExpression, zoom?: number): Point;

        /**
          * Projects the given absolute pixel coordinates to geographical coordinates
          * for the given zoom level (current zoom level by default).
          */
        unproject(point: PointExpression, zoom?: number): LatLng;

        /**
          * Returns the geographical coordinates of a given map layer point.
          */
        layerPointToLatLng(point: PointExpression): LatLng;

        /**
          * Returns the map layer point that corresponds to the given geographical coordinates
          * (useful for placing overlays on the map).
          */
        latLngToLayerPoint(latlng: LatLngExpression): Point;

        /**
         * Returns a LatLng where lat and lng has been wrapped according to the map's CRS's wrapLat and wrapLng properties,
         * if they are outside the CRS's bounds. By default this means longitude is wrapped
         * around the dateline so its value is between -180 and +180 degrees.
         */
        wrapLatLng(latlng: LatLngExpression): LatLng;

        /**
         * Returns the distance between two geographical coordinates according to the map's CRS.
         * By default this measures distance in meters.
         */
        distance(latlng1: LatLngExpression, latlng2: LatLngExpression): number;

        /**
          * Converts the point relative to the map container to a point relative to the
          * map layer.
          */
        containerPointToLayerPoint(point: PointExpression): Point;

        /**
          * Converts the point relative to the map layer to a point relative to the map
          * container.
          */
        layerPointToContainerPoint(point: PointExpression): Point;

        /**
          * Returns the geographical coordinates of a given map container point.
          */
        containerPointToLatLng(point: PointExpression): LatLng;

        /**
          * Returns the map container point that corresponds to the given geographical
          * coordinates.
          */
        latLngToContainerPoint(latlng: LatLngExpression): Point;

        /**
          * Returns the pixel coordinates of a mouse click (relative to the top left corner
          * of the map) given its event object.
          */
        mouseEventToContainerPoint(event: MouseEvent): Point;

        /**
          * Returns the pixel coordinates of a mouse click relative to the map layer given
          * its event object.
          */
        mouseEventToLayerPoint(event: MouseEvent): Point;

        /**
          * Returns the geographical coordinates of the point the mouse clicked on given
          * the click's event object.
          */
        mouseEventToLatLng(event: MouseEvent): LatLng;

        // Geolocation methods

        /**
          * Tries to locate the user using Geolocation API, firing locationfound event
          * with location data on success or locationerror event on failure, and optionally
          * sets the map view to the user location with respect to detection accuracy
          * (or to the world view if geolocation failed). See Locate options for more
          * details.
          */
        locate(options?: LocateOptions): this;

        /**
          * Stops watching location previously initiated by map.locate({watch: true})
          * and aborts resetting the map view if map.locate was called with {setView: true}.
          */
        stopLocate(): this;

        // Properties

        /**
          * Box (shift-drag with mouse) zoom handler.
          */
        boxZoom: Handler;

        /**
          * Double click zoom handler.
          */
        doubleClickZoom: Handler;

        /**
          * Map dragging handler (by both mouse and touch).
          */
        dragging: Handler;

        /**
          * Keyboard navigation handler.
          */
        keyboard: Handler;

        /**
          * Scroll wheel zoom handler.
          */
        scrollWheelZoom: Handler;

        /**
          * Mobile touch hacks (quick tap and touch hold) handler.
          */
        tap: Handler;

        /**
          * Touch zoom handler.
          */
        touchZoom: Handler;
    }
}

declare namespace L {
    export interface MapOptions {
        /**
         * Whether Paths should be rendered on a Canvas renderer.
         * By default, all Paths are rendered in a SVG renderer.
         */
        preferCanvas?: boolean;

        // Control options

        /**
          * Whether the attribution control is added to the map by default.
          *
          * Default value: true.
          */
        attributionControl?: boolean;

        /**
          * Whether the zoom control is added to the map by default.
          *
          * Default value: true.
          */
        zoomControl?: boolean;

        // Interaction Options

        /**
         * Set it to false if you don't want popups to close when user clicks the map.
         *
         * Default value: true.
         */
        closePopupOnClick?: boolean;

        /**
         * Forces the map's zoom level to always be a multiple of this, particularly
         * right after a fitBounds() or a pinch-zoom. By default, the zoom level snaps to the
         * nearest integer; lower values (e.g. 0.5 or 0.1) allow for greater granularity.
         * A value of 0 means the zoom level will not be snapped after fitBounds or a pinch-zoom.
         *
         * Default value: 1.
         */
        zoomSnap?: number;

        /**
         * Controls how much the map's zoom level will change after a zoomIn(), zoomOut(),
         * pressing + or - on the keyboard, or using the zoom controls.
         * Values smaller than 1 (e.g. 0.5) allow for greater granularity.
         *
         * Default value: 1.
         */
        zoomDelta?: number;

        /**
          * Whether the map automatically handles browser window resize to update itself.
          *
          * Default value: true.
          */
        trackResize?: boolean;

        /**
          * Whether the map can be zoomed to a rectangular area specified by dragging
          * the mouse while pressing shift.
          *
          * Default value: true.
          */
        boxZoom?: boolean;

        /**
          * Whether the map can be zoomed in by double clicking on it and zoomed out
          * by double clicking while holding shift.
          * If passed 'center', double-click zoom will zoom to the center of the view
          * regardless of where the mouse was.
          *
          * Default value: true.
          */
        doubleClickZoom?: boolean | string;

        /**
          * Whether the map be draggable with mouse/touch or not.
          *
          * Default value: true.
          */
        dragging?: boolean;

        // Map State Options

        /**
          * Coordinate Reference System to use. Don't change this if you're not sure
          * what it means.
          *
          * Default value: L.CRS.EPSG3857.
          */
        crs?: CRS;

        /**
          * Initial geographical center of the map.
          */
        center?: LatLngExpression;

        /**
          * Initial map zoom.
          */
        zoom?: number;

        /**
          * Minimum zoom level of the map. Overrides any minZoom set on map layers.
          */
        minZoom?: number;

        /**
          * Maximum zoom level of the map. This overrides any maxZoom set on map layers.
          */
        maxZoom?: number;

        /**
          * Layers that will be added to the map initially.
          */
        layers?: Layer[];

        /**
          * When this option is set, the map restricts the view to the given geographical
          * bounds, bouncing the user back when he tries to pan outside the view, and also
          * not allowing to zoom out to a view that's larger than the given bounds (depending
          * on the map size). To set the restriction dynamically, use setMaxBounds method
          */
        maxBounds?: LatLngBoundsExpression;

        /**
         * The default method for drawing vector layers on the map.
         * L.SVG or L.Canvas by default depending on browser support.
         */
        renderer?: Renderer;

        // Animation options

        /**
          * Whether the tile fade animation is enabled. By default it's enabled in all
          * browsers that support CSS3 Transitions except Android.
          */
        fadeAnimation?: boolean;

        /**
          * Whether markers animate their zoom with the zoom animation, if disabled
          * they will disappear for the length of the animation. By default it's enabled
          * in all browsers that support CSS3 Transitions except Android.
          */
        markerZoomAnimation?: boolean;

        /**
         * Defines the maximum size of a CSS translation transform.
         * The default value should not be changed unless a web browser positions layers in the wrong place after doing a large panBy.
         *
         * Default value: 2^23.
         */
        transform3DLimit?: number;

        /**
          * Whether the tile zoom animation is enabled. By default it's enabled in all
          * browsers that support CSS3 Transitions except Android.
          */
        zoomAnimation?: boolean;

        /**
          * Won't animate zoom if the zoom difference exceeds this value.
          *
          * Default value: 4.
          */
        zoomAnimationThreshold?: number;

        // Panning Inertia Options

        /**
          * If enabled, panning of the map will have an inertia effect where the map builds
          * momentum while dragging and continues moving in the same direction for some
          * time. Feels especially nice on touch devices.
          *
          * Default value: true.
          */
        inertia?: boolean;

        /**
          * The rate with which the inertial movement slows down, in pixels/second2.
          *
          * Default value: 3000.
          */
        inertiaDeceleration?: number;

        /**
          * Max speed of the inertial movement, in pixels/second.
          *
          * Default value: Infinity.
          */
        inertiaMaxSpeed?: number;

        easeLinearity?: number;

        /**
          * With this option enabled, the map tracks when you pan to another "copy" of
          * the world and seamlessly jumps to the original one so that all overlays like
          * markers and vector layers are still visible.
          *
          * Default value: false.
          */
        worldCopyJump?: boolean;

        /**
         * If maxBounds is set, this options will control how solid the bounds are when dragging the map around.
         * The default value of 0.0 allows the user to drag outside the bounds at normal speed,
         * higher values will slow down map dragging outside bounds,
         * and 1.0 makes the bounds fully solid, preventing the user from dragging outside the bounds.
         *
         * Default value: 0.0.
         */
        maxBoundsViscosity?: number;

        // Keyboard Navigation Options

        /**
          * Makes the map focusable and allows users to navigate the map with keyboard
          * arrows and +/- keys.
          *
          * Default value: true.
          */
        keyboard?: boolean;

        /**
          * Amount of pixels to pan when pressing an arrow key.
          *
          * Default value: 80.
          */
        keyboardPanDelta?: number;

        // Mousewheel options

        /**
          * Whether the map can be zoomed by using the mouse wheel.
          * If passed 'center', it will zoom to the center of the view regardless of
          * where the mouse was.
          *
          * Default value: true.
          */
        scrollWheelZoom?: boolean | string;

        /**
         * Limits the rate at which a wheel can fire (in milliseconds).
         * By default user can't zoom via wheel more often than once per 40 ms.
         *
         * Default value: 40.
         */
        wheelDebounceTime?: number;

        /**
         * How many scroll pixels (as reported by L.DomEvent.getWheelDelta)
         * mean a change of one full zoom level. Smaller values will make wheel-zooming faster (and vice versa).
         */
        wheelPxPerZoomLevel?: number;

        // Touch interaction options

        /**
          * Enables mobile hacks for supporting instant taps (fixing 200ms click delay
          * on iOS/Android) and touch holds (fired as contextmenu events).
          *
          * Default value: true.
          */
        tap?: boolean;

        /**
          * The max number of pixels a user can shift his finger during touch for it
          * to be considered a valid tap.
          *
          * Default value: 15.
          */
        tapTolerance?: number;

        /**
          * Whether the map can be zoomed by touch-dragging with two fingers.
          * If passed 'center', it will zoom to the center of the view regardless
          * of where the touch events (fingers) were.
          * 
          * Enabled for touch-capable web browsers except for old Androids.
          * 
          * Default value: true.
          */
        touchZoom?: boolean | string;

        /**
         * Set it to false if you don't want the map to zoom beyond
         * min/max zoom and then bounce back when pinch-zooming.
         */
        bounceAtZoomLimits?: boolean;
    }
}

declare namespace L {
    export interface MapPanes {
        /**
          * Pane that contains all other map panes.
          */
        mapPane: HTMLElement;

        /**
          * Pane for tile layers.
          */
        tilePane: HTMLElement;

        /**
          * Pane for overlays like polylines and polygons.
          */
        overlayPane: HTMLElement;

        /**
          * Pane for overlay shadows (e.g. marker shadows).
          */
        shadowPane: HTMLElement;

        /**
          * Pane for marker icons.
          */
        markerPane: HTMLElement;

        /**
          * Pane for popups.
          */
        popupPane: HTMLElement;
    }
}

declare namespace L {
    export interface LocateOptions {
        /**
          * If true, starts continous watching of location changes (instead of detecting
          * it once) using W3C watchPosition method. You can later stop watching using
          * map.stopLocate() method.
          *
          * Default value: false.
          */
        watch?: boolean;

        /**
          * If true, automatically sets the map view to the user location with respect
          * to detection accuracy, or to world view if geolocation failed.
          *
          * Default value: false.
          */
        setView?: boolean;

        /**
          * The maximum zoom for automatic view setting when using `setView` option.
          *
          * Default value: Infinity.
          */
        maxZoom?: number;

        /**
          * Number of millisecond to wait for a response from geolocation before firing
          * a locationerror event.
          *
          * Default value: 10000.
          */
        timeout?: number;

        /**
          * Maximum age of detected location. If less than this amount of milliseconds
          * passed since last geolocation response, locate will return a cached location.
          *
          * Default value: 0.
          */
        maximumAge?: number;

        /**
          * Enables high accuracy, see description in the W3C spec.
          *
          * Default value: false.
          */
        enableHighAccuracy?: boolean;
    }

    export interface ZoomOptions {
        /**
          * If not specified, zoom animation will happen if the zoom origin is inside the current view.
          * If true, the map will attempt animating zoom disregarding where zoom origin is.
          * Setting false will make it always reset the view completely without animation.
          */
        animate?: boolean;
    }

    export interface PanOptions {

        /**
          * If true, panning will always be animated if possible. If false, it will not
          * animate panning, either resetting the map view if panning more than a screen
          * away, or just setting a new offset for the map pane (except for `panBy`
          * which always does the latter).
          */
        animate?: boolean;

        /**
          * Duration of animated panning.
          *
          * Default value: 0.25.
          */
        duration?: number;

        /**
          * The curvature factor of panning animation easing (third parameter of the Cubic
          * Bezier curve). 1.0 means linear animation, the less the more bowed the curve.
          *
          * Default value: 0.25.
          */
        easeLinearity?: number;

        /**
          * If true, panning won't fire movestart event on start (used internally for panning inertia).
          *
          * Default value: false.
          */
        noMoveStart?: boolean;
    }

    export interface ZoomPanOptions extends ZoomOptions, PanOptions {}

    export interface FitBoundsOptions extends ZoomPanOptions {

        /**
          * Sets the amount of padding in the top left corner of a map container that
          * shouldn't be accounted for when setting the view to fit bounds. Useful if
          * you have some control overlays on the map like a sidebar and you don't
          * want them to obscure objects you're zooming to.
          *
          * Default value: [0, 0].
          */
        paddingTopLeft?: Point;

        /**
          * The same for bottom right corner of the map.
          *
          * Default value: [0, 0].
          */
        paddingBottomRight?: Point;

        /**
          * Equivalent of setting both top left and bottom right padding to the same value.
          *
          * Default value: [0, 0].
          */
        padding?: Point;

        /**
          * The maximum possible zoom to use.
          *
          * Default value: null
          */
        maxZoom?: number;
    }
}

declare namespace L {
    export interface MarkerOptions {

        /**
          * Icon class to use for rendering the marker. See Icon documentation for details
          * on how to customize the marker icon.
          *
          * Default value: new L.Icon.Default().
          */
        icon?: Icon;

        /**
          * If false, the marker will not emit mouse events and will act as a part of the
          * underlying map.
          *
          * Default value: true.
          */
        interactive?: boolean;

        /**
          * Whether the marker is draggable with mouse/touch or not.
          *
          * Default value: false.
          */
        draggable?: boolean;

        /**
          * Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
          *
          * Default value: true.
          */
        keyboard?: boolean;

        /**
          * Text for the browser tooltip that appear on marker hover (no tooltip by default).
          *
          * Default value: ''.
          */
        title?: string;

        /**
          * Text for the alt attribute of the icon image (useful for accessibility).
          *
          * Default value: ''.
          */
        alt?: string;

        /**
          * By default, marker images zIndex is set automatically based on its latitude.
          * You this option if you want to put the marker on top of all others (or below),
          * specifying a high value like 1000 (or high negative value, respectively).
          *
          * Default value: 0.
          */
        zIndexOffset?: number;

        /**
          * The opacity of the marker.
          *
          * Default value: 1.0.
          */
        opacity?: number;

        /**
          * If true, the marker will get on top of others when you hover the mouse over it.
          *
          * Default value: false.
          */
        riseOnHover?: boolean;

        /**
          * The z-index offset used for the riseOnHover feature.
          *
          * Default value: 250.
          */
        riseOffset?: number;

        /**
         * Map pane where the markers icon will be added.
         *
         * Default value: 'markerPane'.
         */
        pane?: string;
    }

    /**
      * Instantiates a Marker object given a geographical point and optionally
      * an options object.
      */
    function marker(latlng: LatLngExpression, options?: MarkerOptions): Marker;

    export interface MarkerStatic extends ClassStatic {
        /**
          * Instantiates a Marker object given a geographical point and optionally
          * an options object.
          */
        new(latlng: LatLngExpression, options?: MarkerOptions): Marker;
    }

    export interface Marker extends Layer {
        options: MarkerOptions;

        /**
          * Returns the current geographical position of the marker.
          */
        getLatLng(): LatLng;

        /**
          * Changes the marker position to the given point.
          */
        setLatLng(latlng: LatLngExpression): this;

        /**
          * Changes the zIndex offset of the marker.
          */
        setZIndexOffset(offset: number): this;

        /**
          * Changes the marker icon.
          */
        setIcon(icon: Icon): this;

        /**
          * Changes the opacity of the marker.
          */
        setOpacity(opacity: number): this;

        /**
          * Marker dragging handler (by both mouse and touch).
          */
        dragging: Handler;
    }

    export var Marker: MarkerStatic;
}

declare namespace L {
    export interface PopupOptions {
        /**
          * Max width of the popup.
          *
          * Default value: 300.
          */
        maxWidth?: number;

        /**
          * Min width of the popup.
          *
          * Default value: 50.
          */
        minWidth?: number;

        /**
          * If set, creates a scrollable container of the given height inside a popup
          * if its content exceeds it.
          */
        maxHeight?: number;

        /**
          * Set it to false if you don't want the map to do panning animation to fit the opened
          * popup.
          *
          * Default value: true.
          */
        autoPan?: boolean;

        /**
          * The margin between the popup and the top left corner of the map view after
          * autopanning was performed.
          *
          * Default value: null.
          */
        autoPanPaddingTopLeft?: PointExpression;

        /**
          * The margin between the popup and the bottom right corner of the map view after
          * autopanning was performed.
          *
          * Default value: null.
          */
        autoPanPaddingBottomRight?: PointExpression;

        /**
          * The margin between the popup and the edges of the map view after autopanning
          * was performed.
          *
          * Default value: new Point(5, 5).
          */
        autoPanPadding?: PointExpression;

        /**
          * Set it to true if you want to prevent users from panning the popup off of the screen while it is open.
          */
        keepInView?: boolean;

        /**
          * Controls the presense of a close button in the popup.
          *
          * Default value: true.
          */
        closeButton?: boolean;

        /**
          * The offset of the popup position. Useful to control the anchor of the popup
          * when opening it on some overlays.
          *
          * Default value: new Point(0, 7).
          */
        offset?: PointExpression;

        /**
          * Set it to false if you want to override the default behavior of the popup
          * closing when user clicks the map (set globally by the Map closePopupOnClick
          * option).
          */
        autoClose?: boolean;

        /**
          * Whether to animate the popup on zoom. Disable it if you have problems with
          * Flash content inside popups.
          *
          * Default value: true.
          */
        zoomAnimation?: boolean;

        /**
          * A custom class name to assign to the popup.
          */
        className?: string;

        /**
         * Map pane where the popup will be added.
         */
        pane?: 'popupPan'
    }

    /**
      * Instantiates a Popup object given an optional options object that describes
      * its appearance and location and an optional object that is used to tag the
      * popup with a reference to the source object to which it refers.
      */
    function popup(options?: PopupOptions, source?: any): Popup;

    export interface PopupStatic {
        /**
          * Instantiates a Popup object given an optional options object that describes
          * its appearance and location and an optional object that is used to tag the
          * popup with a reference to the source object to which it refers.
          */
        new(options?: PopupOptions, source?: any): Popup;
    }

    export interface Popup extends Layer {
        options: PopupOptions;

        /**
          * Adds the popup to the map and closes the previous one. The same as map.openPopup(popup).
          */
        openOn(map: Map): this;

        /**
          * Returns the geographical point of popup.
          */
        getLatLng(): LatLng;

        /**
          * Sets the geographical point where the popup will open.
          */
        setLatLng(latlng: LatLngExpression): this;

        /**
          * Sets the HTML content of the popup.
          */
        setContent(htmlContent: string): this;

        /**
          * Sets the HTML content of the popup.
          */
        setContent(htmlContent: HTMLElement): this;

        /**
          * Sets the HTML content of the popup.
          */
        setContent(htmlContent: (layer: Popup | Layer) => string | HTMLElement): this;

        /**
          * Returns the content of the popup.
          */
        getElement(): HTMLElement;

        /**
          * Updates the popup content, layout and position. Useful for updating the popup after
          * something inside changed, e.g. image loaded.
          */
        update(): void;

        /**
         * Returns true when the popup is visible on the map.
         */
        isOpen(): boolean;

        /**
         * Brings this popup in front of other popups (in the same map pane).
         */
        bringToFront(): this;

        /**
         * Brings this popup to the back of other popups (in the same map pane).
         */
        bringToBack(): this;
    }

    export var Popup: PopupStatic;
}

declare namespace L {
    export interface TileLayerOptions extends GridLayerOptions {
        /**
         * Minimum zoom number.
         *
         * Default value: 0.
         */
        minZoom?: number;

        /**
         * Maximum zoom number.
         *
         * Default value: 18.
         */
        maxZoom?: number;

        /**
         * Maximum zoom number the tile source has available. If it is specified,
         * the tiles on all zoom levels higher than maxNativeZoom will be loaded
         * from maxNativeZoom level and auto-scaled.
         *
         * Default value: null.
         */
        maxNativeZoom?: number;

        /**
         * Subdomains of the tile service. Can be passed in the form of one string
         * (where each letter is a subdomain name) or an array of strings.
         *
         * Default value: 'abc'.
         */
        subdomains?: string | string[];

        /**
         * URL to the tile image to show in place of the tile that failed to load.
         *
         * Default value: ''.
         */
        errorTileUrl?: string;

        /**
         * The zoom number used in tile URLs will be offset with this value.
         *
         * Default value: 0.
         */
        zoomOffset?: number;

        /**
         * If true, inverses Y axis numbering for tiles (turn this on for TMS services).
         *
         * Default value: false.
         */
        tms?: boolean;

        /**
         * If set to true, the zoom number used in tile URLs will be
         * reversed (maxZoom - zoom instead of zoom)
         *
         * Default value: false.
         */
        zoomReverse?: boolean;

        /**
         * If true and user is on a retina display, it will request four tiles
         * of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
         *
         * Default value: false.
         */
        detectRetina?: boolean;

        /**
         * If true, all tiles will have their crossOrigin attribute set to ''.
         * This is needed if you want to access tile pixel data.
         *
         * Default value: false.
         */
        crossOrigin?: boolean;

    }

    export interface TileLayerStatic {
        /**
         * Instantiates a tile layer object given a URL template and optionally an options object.
         */
        new(urlTemplate: string, options?: TileLayerOptions): TileLayer;

        WMS: TileLayer.WMSStatic;
    }

    export interface TileLayer extends GridLayer {
        options: TileLayerOptions;

        /**
         * Updates the layer's URL template and redraws it (unless noRedraw is set to true).
         */
        setUrl(url: string, noRedraw?: boolean): this;

        /**
         * Called only internally, overrides GridLayer's createTile() to return
         * an <img> HTML element with the appropiate image URL given coords.
         * The done callback is called when the tile has been loaded.
         */
        createTile(coords: GridLayerCoords, done?: (err: any, tile: HTMLElement) => void): HTMLElement;
    }

    export var TileLayer: TileLayerStatic;

    export interface TileLayerFactory {
        /**
         * Instantiates a tile layer object given a URL template and optionally an options object.
         */
        (urlTemplate: string, options?: TileLayerOptions): TileLayer;

        /**
         * Instantiates a WMS tile layer object given a base URL of the WMS
         * service and a WMS parameters/options object.
         */
        wms(baseUrl: string, options: TileLayer.WMSOptions): TileLayer.WMS;
    }

    namespace TileLayer {
        export interface WMSOptions extends TileLayerOptions {

            /**
              * (required) Comma-separated list of WMS layers to show.
              *
              * Default value: ''.
              */
            layers?: string;

            /**
              * Comma-separated list of WMS styles.
              *
              * Default value: ''.
              */
            styles?: string;

            /**
              * WMS image format (use 'image/png' for layers with transparency).
              *
              * Default value: 'image/jpeg'.
              */
            format?: string;

            /**
              * If true, the WMS service will return images with transparency.
              *
              * Default value: false.
              */
            transparent?: boolean;

            /**
              * Version of the WMS service to use.
              *
              * Default value: '1.1.1'
              */
            version?: string;

            /**
             * Coordinate Reference System to use for the WMS requests, defaults to
             * map CRS. Don't change this if you're not sure what it means.
             *
             * Default value: null
             */
            crs?: CRS;

            /**
             * If true, WMS request parameter keys will be uppercase.
             *
             * Default value: false
             */
            uppercase?: boolean;
        }

        export interface WMSStatic extends ClassStatic {
            new(baseUrl: string, options: WMSOptions): WMS;
        }

        export interface WMS extends TileLayer {
            options: TileLayer.WMSOptions;

            /**
             * Merges an object with the new parameters and re-requests tiles on
             * the current screen (unless noRedraw was set to true).
             */
            setParams(params: TileLayer.WMSOptions, noRedraw?: boolean): this;
        }
    }

    export var tileLayer: TileLayerFactory;
}

declare namespace L {

    /**
      * Instantiates an image overlay object given the URL of the image and the geographical
      * bounds it is tied to.
      */
    function imageOverlay(imageUrl: string, bounds: LatLngBoundsExpression, options?: ImageOverlayOptions): ImageOverlay;

    export interface ImageOverlayOptions {

        /**
          * The opacity of the image overlay.
          *
          * Default value: 1.
          */
        opacity?: number;

        /**
         * Text for the alt attribute of the image (useful for accessibility).
         *
         * Default value: ''.
         */
        alt?: string;

        /**
         * If `true`, the image overlay will emit mouse events when clicked or hovered.
         *
         * Default value: false.
         */
        interactive?: boolean;

        /**
         * If true, the image will have its crossOrigin attribute set to ''.
         * This is needed if you want to access image pixel data.
         *
         * Default value: false.
         */
        crossOrigin?: boolean;
    }

    export interface ImageOverlayStatic {
        /**
         * Instantiates an image overlay object given the URL of the image and the geographical bounds it is tied to.
         */
        new(imageUrl: string, bounds: LatLngBoundsExpression, options?: ImageOverlayOptions): ImageOverlay;
    }

    export interface ImageOverlay extends Layer {
        options: ImageOverlayOptions;

        /**
          * Sets the opacity of the overlay.
          */
        setOpacity(opacity: number): this;

        /**
          * Brings the layer to the top of all overlays.
          */
        bringToFront(): this;

        /**
          * Brings the layer to the bottom of all overlays.
          */
        bringToBack(): this;

        /**
          * Changes the URL of the image.
          */
        setUrl(imageUrl: string): this;
    }

    export var ImageOverlay: ImageOverlayStatic;
}

declare namespace L {
    export interface PathOptions extends LayerOptions {
        /**
          * Whether to draw stroke along the path. Set it to false to disable borders on
          * polygons or circles.
          *
          * Default value: true.
          */
        stroke?: boolean;

        /**
          * Stroke color.
          *
          * Default value: '#3388ff'.
          */
        color?: string;

        /**
          * Stroke width in pixels.
          *
          * Default value: 3.
          */
        weight?: number;

        /**
          * Stroke opacity.
          *
          * Default value: 1.
          */
        opacity?: number;

        /**
          * A string that defines shape to be used at the end of the stroke.
          *
          * Default value: 'round'.
          */
        lineCap?: string;

        /**
          * A string that defines shape to be used at the corners of the stroke.
          *
          * Default value: 'round'.
          */
        lineJoin?: string;

        /**
          * A string that defines the stroke dash pattern. Doesn't work on canvas-powered
          * layers (e.g. Android 2).
          *
          * Default value: null.
          */
        dashArray?: string;

        /**
         * A string that defines the distance into the dash pattern to start the dash.
         * Doesn't work on canvas-powered layers.
         *
         * Default value: null.
         */
        dashOffset?: string;

        /**
          * Whether to fill the path with color. Set it to false to disable filling on polygons
          * or circles.
          *
          * Default value: false.
          */
        fill?: boolean;

        /**
          * Fill color.
          *
          * Default value: same as color.
          */
        fillColor?: string;

        /**
          * Fill opacity.
          *
          * Default value: 0.2.
          */
        fillOpacity?: number;

        /**
         * A string that defines how the inside of a shape is determined.
         *
         * Default value: 'evenodd'.
         */
        fillRule?: string;

        /**
         * If false, the vector will not emit mouse events and will act as a
         * part of the underlying map.
         *
         * Default value: true.
         */
        interactive?: boolean;

        /**
         * Use this specific instance of Renderer for this path.
         * Takes precedence over the map's default renderer.
         */
        renderer?: Renderer;

        /**
         * Custom class name set on an element. Only for SVG renderer.
         */
        className?: string;
    }

    export interface Path extends Layer {
        options: PathOptions;

        /**
          * Redraws the layer. Sometimes useful after you changed the coordinates that
          * the path uses.
          */
        redraw(): this;

        /**
          * Changes the appearance of a Path based on the options in the Path options object.
          */
        setStyle(style: PathOptions): this;

        /**
          * Brings the layer to the top of all path layers.
          */
        bringToFront(): this;

        /**
          * Brings the layer to the bottom of all path layers.
          */
        bringToBack(): this;
    }
}

declare namespace L {
    /**
      * Instantiates a polyline object given an array of geographical points and
      * optionally an options object.
      */
    function polyline(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions): Polyline;

    export interface PolylineOptions extends PathOptions {
        /**
          * How much to simplify the polyline on each zoom level. More means better performance
          * and smoother look, and less means more accurate representation.
          *
          * Default value: 1.0.
          */
        smoothFactor?: number;

        /**
          * Disabled polyline clipping.
          *
          * Default value: false.
          */
        noClip?: boolean;
    }

    export interface PolylineStatic {
        new(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions): Polyline;
    }

    export interface Polyline extends Path {
        options: PolylineOptions;

        /**
          * Returns a GeoJSON representation of the polyline
          * (as a GeoJSON LineString or MultiLineString Feature).
          */
        toGeoJSON(): any;

        /**
          * Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
          */
        getLatLngs(): LatLng[];

        /**
          * Replaces all the points in the polyline with the given array of geographical
          * points.
          */
        setLatLngs(latlngs: LatLngExpression[]): this;

        /**
         * Returns true if the Polyline has no LatLngs.
         */
        isEmpty(): boolean;

        /**
         * Returns the center (centroid) of the polyline.
         */
        getCenter(): LatLng;

        /**
          * Returns the LatLngBounds of the polyline.
          */
        getBounds(): LatLngBounds;

        /**
          * Adds a given point to the polyline.
          */
        addLatLng(latlng: LatLngExpression): this;
    }

    export var Polyline: PolylineStatic;
}

declare namespace L {
    /**
      * Instantiates a polygon object given an array of geographical points and
      * optionally an options object (the same as for Polyline). You can also create
      * a polygon with holes by passing an array of arrays of latlngs, with the first
      * latlngs array representing the exterior ring while the remaining represent
      * the holes inside.
      */
    function polygon(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions): Polygon;

    export interface PolygonStatic {
        new(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions): Polygon;
    }

    export interface Polygon extends Polyline {}

    export var Polygon: PolygonStatic;
}

declare namespace L {
    /**
      * Instantiates a rectangle object with the given geographical bounds and
      * optionally an options object.
      */
    function rectangle(bounds: LatLngBoundsExpression, options?: PolylineOptions): Rectangle;

    export interface RectangleStatic {
        new(bounds: LatLngBoundsExpression, options?: PolylineOptions): Rectangle;
    }

    export interface Rectangle extends Polygon {
        /**
          * Redraws the rectangle with the passed bounds.
          */
        setBounds(bounds: LatLngBoundsExpression): this;
    }

    export var Rectangle: RectangleStatic;
}

declare namespace L {
    export interface CircleOptions extends PathOptions {
        /**
         * Radius of the circle marker, in pixels
         *
         * Default value: 10.
         */
        radius?: number;
    }

    /**
     * Instantiates a circle object given a geographical point, and an options object which contains the circle radius.
     */
    function circle(latlng: LatLngExpression, options?: CircleOptions | number, legacyOptions?: CircleOptions): Circle;

    export interface CircleStatic {
        /**
         * Instantiates a circle object given a geographical point, and an options object which contains the circle radius.
         */
        new(latlng: LatLngExpression, options?: CircleOptions | number, legacyOptions?: CircleOptions): Circle;
    }

    export interface Circle extends CircleMarker {
        /**
          * Sets the radius of a circle. Units are in meters.
          */
        setRadius(radius: number): this;

        /**
          * Returns the current radius of a circle. Units are in meters.
          */
        getRadius(): number;

        /**
          * Returns the LatLngBounds of the path.
          */
        getBounds(): LatLngBounds;
    }

    export var Circle: CircleStatic;
}

declare namespace L {
    /**
      * Instantiates a circle marker given a geographical point and optionally
      * an options object. The default radius is 10 and can be altered by passing a
      * "radius" member in the path options object.
      */
    function circleMarker(latlng: LatLngExpression, options?: CircleOptions): CircleMarker;

    export interface CircleMarkerStatic {
        new(latlng: LatLngExpression, options?: CircleOptions): CircleMarker;
    }

    export interface CircleMarker extends Path {
        options: CircleOptions;

        /**
         * Returns a GeoJSON representation of the circle marker (as a GeoJSON Point Feature).
         */
        toGeoJSON(): any;

        /**
          * Sets the position of a circle marker to a new location.
          */
        setLatLng(latlng: LatLngExpression): this;

        /**
         * Returns the current geographical position of the circle marker.
         */
        getLatLng(): LatLng;

        /**
          * Sets the radius of a circle marker. Units are in pixels.
          */
        setRadius(radius: number): this;

        /**
         * Returns the current radius of the circle.
         */
        getRadius(): number;
    }

    export var CircleMarker: CircleMarkerStatic;
}

declare namespace L {
    function svg(options?: RendererOptions): SVG;

    export interface SVGStatic extends ClassStatic {
        new(options?: RendererOptions): SVG;

        /**
         * Returns a instance of SVGElement, corresponding to the class name passed.
         * For example, using 'line' will return an instance of SVGLineElement.
         */
        create(name: string): SVGElement;

        /**
         * Generates a SVG path string for multiple rings, with each ring turning
         * into "M..L..L.." instructions.
         */
        pointsToPath(rings: PointExpression[][], closed?: boolean): String;
    }

    export interface SVG extends Renderer {}

    export var SVG: SVGStatic;
}

declare namespace L {
    function canvas(options?: RendererOptions): Canvas;

    export interface CanvasStatic extends ClassStatic {
        new(options?: RendererOptions): Canvas;
    }

    export interface Canvas extends Renderer {}

    export var Canvas: CanvasStatic;
}

declare namespace L {
    /**
      * Create a layer group, optionally given an initial set of layers.
      */
    function layerGroup(layers?: Layer[]): LayerGroup;

    export interface LayerGroupStatic extends ClassStatic {
        /**
          * Create a layer group, optionally given an initial set of layers.
          */
        new(layers?: Layer[]): LayerGroup;
    }

    export interface LayerGroup extends Layer {
        /**
          * Returns a GeoJSON representation of the layer group (as a GeoJSON GeometryCollection).
          */
        toGeoJSON(): any;

        /**
          * Adds a given layer to the group.
          */
        addLayer(layer: Layer): this;

        /**
          * Removes a given layer from the group.
          */
        removeLayer(layer: Layer): this;

        /**
          * Removes a given layer of the given id from the group.
          */
        removeLayer(id: number): this;

        /**
          * Returns true if the given layer is currently added to the group.
          */
        hasLayer(layer: Layer): boolean;

        /**
          * Removes all the layers from the group.
          */
        clearLayers(): this;

        /**
         * Calls methodName on every layer contained in this group, passing
         * any additional parameters. Has no effect if the layers contained do not implement methodName.
         */
        invoke(methodName: string, ...args: any[]): this;

        /**
          * Iterates over the layers of the group, optionally specifying context of
          * the iterator function.
          */
        eachLayer(fn: (layer: Layer) => void, context?: any): this;

        /**
          * Returns the layer with the given id.
          */
        getLayer(id: number): Layer;

        /**
          * Returns an array of all the layers added to the group.
          */
        getLayers(): Layer[];

        /**
         * Calls setZIndex on every layer contained in this group, passing the z-index.
         */
        setZIndex(zIndex: number): this;

        /**
         * Returns the internal ID for a layer.
         */
        getLayerId(layer: Layer): number;
    }

    export var LayerGroup: LayerGroupStatic;
}

declare namespace L {
    /**
      * Create a layer group, optionally given an initial set of layers.
      */
    function featureGroup(layers?: Layer[]): FeatureGroup;

    export interface FeatureGroupStatic {
        new(layers?: Layer[]): FeatureGroup;
    }

    export interface FeatureGroup extends LayerGroup {

        /**
          * Sets the given path options to each layer of the group that has a setStyle method.
          */
        setStyle(style: PathOptions): this;

        /**
          * Brings the layer group to the top of all other layers.
          */
        bringToFront(): this;

        /**
          * Brings the layer group to the bottom of all other layers.
          */
        bringToBack(): this;

        /**
          * Returns the LatLngBounds of the Feature Group (created from bounds and coordinates
          * of its children).
          */
        getBounds(): LatLngBounds;
    }

    export var FeatureGroup: FeatureGroupStatic;
}

declare namespace L {
    /**
      * Creates a GeoJSON layer. Optionally accepts an object in GeoJSON format
      * to display on the map (you can alternatively add it later with addData method)
      * and an options object.
      */
    function geoJson(geojson?: any, options?: GeoJSONOptions): GeoJSON;

    export interface GeoJSONOptions {
        /**
          * Function that will be used for creating layers for GeoJSON points (if not
          * specified, simple markers will be created).
          */
        pointToLayer?: (featureData: any, latlng: LatLng) => Layer;

        /**
          * Function that will be used to get style options for vector layers created
          * for GeoJSON features.
          */
        style?: (featureData: any) => any;

        /**
          * Function that will be called on each created feature layer. Useful for attaching
          * events and popups to features.
          */
        onEachFeature?: (feature: any, layer: Layer) => void;

        /**
          * Function that will be used to decide whether to show a feature or not.
          */
        filter?: (featureData: any) => boolean;

        /**
          * Function that will be used for converting GeoJSON coordinates to LatLng points
          * (if not specified, coords will be assumed to be WGS84 standard[longitude, latitude]
          * values in degrees).
          */
        coordsToLatLng?: (coords: any[]) => LatLng[];
    }

    export interface GeoJSONStatic {
        new(geojson?: any, options?: GeoJSONOptions): GeoJSON;

        /**
          * Creates a layer from a given GeoJSON feature.
          */
        geometryToLayer(featureData: any, options?: GeoJSONOptions): Layer;

        /**
          * Creates a LatLng object from an array of 2 numbers (latitude, longitude)
          * used in GeoJSON for points. If reverse is set to true, the numbers will be interpreted
          * as (longitude, latitude).
          */
        coordsToLatLng(coords: [number, number] | [number, number, number]): LatLng;

        /**
          * Creates a multidimensional array of LatLng objects from a GeoJSON coordinates
          * array. levelsDeep specifies the nesting level (0 is for an array of points,
          * 1 for an array of arrays of points, etc., 0 by default). Can use a custom coordsToLatLng function.
          */
        coordsToLatLngs(coords: any[], levelsDeep?: number, coordsToLatLng?: (coords: number[]) => LatLng): any[];

        /**
         * Reverse of coordsToLatLng
         */
        latLngToCoords(latlng: LatLngExpression): number[];

        /**
         * Reverse of coordsToLatLngs
         */
        latLngsToCoords(latlngs: any[], levelsDeep?: number, closed?: boolean): number[];

        /**
         * Normalize GeoJSON geometries/features into GeoJSON features.
         */
        asFeature(geojson: any): any;
    }

    export interface GeoJSON extends FeatureGroup {
        options: GeoJSONOptions;
    }

    export var GeoJSON: GeoJSONStatic;
}

declare namespace L {
    /**
     * Creates a new instance of GridLayer with the supplied options.
     */
    function gridLayer(options?: GridLayerOptions): GridLayer;

    interface GridLayerOptions {
        /**
         * Width and height of tiles in the grid. Use a number if width and height
         * are equal, or L.point(width, height) otherwise.
         *
         * Default value: 256.
         */
        tileSize?: number | Point;

        /**
         * Opacity of the tiles. Can be used in the createTile() function.
         *
         * Default value: 1.
         */
        opacity?: number;

        /**
         * If false, new tiles are loaded during panning, otherwise only
         * after it (for better performance). true by default on mobile browsers, otherwise false.
         *
         * Default value: L.Browser.mobile.
         */
        updateWhenIdle?: boolean;

        /**
         * Tiles will not update more than once every updateInterval milliseconds.
         *
         * Default value: 200.
         */
        updateInterval?: number;

        /**
         * String to be shown in the attribution control,
         * describes the layer data, e.g. "© Mapbox".
         *
         * Default value: null.
         */
        attribution?: string;

        /**
         * The explicit zIndex of the tile layer.
         *
         * Default value: 1.
         */
        zIndex?: number;

        /**
         * If set, tiles will only be loaded inside inside the set LatLngBounds.
         *
         * Default value: null.
         */
        bounds?: LatLngBounds;

        /**
         * The minimum zoom level that tiles will be loaded at. By default the entire map.
         *
         * Default value: 0.
         */
        minZoom?: number;

        /**
         * The maximum zoom level that tiles will be loaded at.
         *
         * Default value: undefined.
         */
        maxZoom?: number;

        /**
         * GridLayer will only be displayed once at low zoom levels.
         *
         * Default value: false.
         */
        noWrap?: boolean;

        /**
         * Map pane where the grid layer will be added.
         *
         * Default value: 'tilePane'.
         */
        pane?: string;
    }

    interface GridLayerCoords {
        x: number;
        y: number;
        z: number;
    }

    export interface GridLayerStatic extends ClassStatic {
        /**
         * Creates a new instance of GridLayer with the supplied options.
         */
        new(options?: GridLayerOptions): GridLayer;
    }

    export interface GridLayer extends Layer {
        options: GridLayerOptions;

        /**
         * Brings the tile layer to the top of all tile layers.
         */
        bringToFront(): this;

        /**
         * Brings the tile layer to the bottom of all tile layers.
         */
        bringToBack(): this;

        /**
         * Used by the attribution control, returns the attribution option.
         */
        getAttribution(): string;

        /**
         * Returns the HTML element that contains the tiles for this layer.
         */
        getContainer(): HTMLElement;

        /**
         * Changes the opacity of the grid layer.
         */
        setOpacity(opacity: number): this;

        /**
         * Changes the zIndex of the grid layer.
         */
        setZIndex(zIndex: number): this;

        /**
         * Returns true if any tile in the grid layer has not finished loading.
         */
        isLoading(): boolean;

        /**
         * Causes the layer to clear all the tiles and request them again.
         */
        redraw(): this;

        /**
         * Normalizes the tileSize option into a point. Used by the createTile() method.
         */
        getTileSize(): Point;

        /**
         * Called only internally, must be overriden by classes extending GridLayer.
         * Returns the HTMLElement corresponding to the given coords.
         * If the done callback is specified, it must be called when the
         * tile has finished loading and drawing.
         */
        createTile(coords: GridLayerCoords, done?: (err: any, tile: HTMLElement) => void): HTMLElement | void;
    }

    namespace GridLayer {
        type createTile = (coords: GridLayerCoords, done?: (err: any, tile: HTMLElement) => void) => HTMLElement | void;
    }

    export var GridLayer: GridLayerStatic;
}

declare namespace L {
    type LatLngExpression = LatLng | [number, number] | [number, number, number] | number[] | ({ lat: number; lng: number, alt?: number }) | ({ lat: number; lon: number, alt?: number });
    type LatLngBoundsExpression = LatLngBounds | LatLngExpression[];
    type PointExpression = Point | [number, number] | number[] | { x: number, y: number };
    type BoundsExpression = Bounds | [PointExpression, PointExpression];
}

declare namespace L {
    /**
      * Creates an object representing a geographical point with the given
      * latitude and longitude (and optionally altitude).
      */
    function latLng(latitude: number, longitude: number, altitude?: number): LatLng;

    /**
      * Creates an object representing a geographical point with the given latitude
      * and longitude.
      */
    function latLng(coords: LatLngExpression): LatLng;

    export interface LatLng {
        /**
          * Returns true if the given LatLng point is at the same position (within a small margin of error).
          * The margin of error can be overriden by setting maxMargin to a small number.
          */
        equals(otherLatlng: LatLngExpression, maxMargin?: number): boolean;

        /**
          * Returns a string representation of the point (for debugging purposes).
          */
        toString(): string;

        /**
          * Returns the distance (in meters) to the given LatLng calculated using the Haversine formula.
          */
        distanceTo(otherLatlng: LatLngExpression): number;

        /**
          * Returns a new LatLng object with the longitude wrapped so it's always between -180 and +180 degrees.
          */
        wrap(): LatLng;

        /**
         * Returns a new LatLngBounds object in which each boundary is sizeInMeters meters apart from the LatLng.
         */
        toBounds(sizeInMeters: number): LatLngBounds;

        /**
          * Latitude in degrees.
          */
        lat: number;

        /**
          * Longitude in degrees.
          */
        lng: number;

        /**
         * Altitude in meters (optional).
         */
        alt: number;
    }

    export interface LatLngStatic {
        /**
          * Creates an object representing a geographical point with the given
          * latitude and longitude (and optionally altitude).
          */
        new(latitude: number, longitude: number, altitude?: number): LatLng;

        /**
          * Creates an object representing a geographical point with the given latitude
          * and longitude.
          */
        new(coords: LatLngExpression): LatLng;
    }

    export var LatLng: LatLngStatic;
}

declare namespace L {
    /**
      * Creates a LatLngBounds object by defining south-west and north-east corners
      * of the rectangle.
      */
    function latLngBounds(southWest: LatLngExpression, northEast: LatLngExpression): LatLngBounds;

    /**
      * Creates a LatLngBounds object defined by the geographical points it contains.
      * Very useful for zooming the map to fit a particular set of locations with fitBounds.
      */
    function latLngBounds(latlngs: LatLngBoundsExpression): LatLngBounds;

    export interface LatLngBounds {
        /**
          * Extends the bounds to contain the given point.
          */
        extend(latlng: LatLngExpression): this;

        /**
          * Extends the bounds to contain the given bounds.
          */
        extend(latlng: LatLngBoundsExpression): this;

        /**
          * Returns bigger bounds created by extending the current bounds by a given
          * percentage in each direction.
          */
        pad(bufferRatio: number): LatLngBounds;

        /**
          * Returns the center point of the bounds.
          */
        getCenter(): LatLng;

        /**
          * Returns the south-west point of the bounds.
          */
        getSouthWest(): LatLng;

        /**
          * Returns the north-east point of the bounds.
          */
        getNorthEast(): LatLng;

        /**
          * Returns the north-west point of the bounds.
          */
        getNorthWest(): LatLng;

        /**
          * Returns the south-east point of the bounds.
          */
        getSouthEast(): LatLng;

        /**
          * Returns the west longitude in degrees of the bounds.
          */
        getWest(): number;

        /**
          * Returns the south latitude in degrees of the bounds.
          */
        getSouth(): number;

        /**
          * Returns the east longitude in degrees of the bounds.
          */
        getEast(): number;

        /**
          * Returns the north latitude in degrees of the bounds.
          */
        getNorth(): number;

        /**
          * Returns true if the rectangle contains the given one.
          */
        contains(otherBounds: LatLngBoundsExpression): boolean;

        /**
          * Returns true if the rectangle contains the given point.
          */
        contains(latlng: LatLngExpression): boolean;

        /**
          * Returns true if the rectangle intersects the given bounds.
          */
        intersects(otherBounds: LatLngBoundsExpression): boolean;

        /**
         * Returns true if the rectangle overlaps the given bounds.
         * Two bounds overlap if their intersection is an area.
         */
        overlaps(otherBounds: LatLngBoundsExpression): boolean;

        /**
          * Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat'
          * format. Useful for sending requests to web services that return geo data.
          */
        toBBoxString(): string;

        /**
          * Returns true if the rectangle is equivalent (within a small margin of error)
          * to the given bounds.
          */
        equals(otherBounds: LatLngBoundsExpression): boolean;

        /**
          * Returns true if the bounds are properly initialized.
          */
        isValid(): boolean;

    }

    export interface LatLngBoundsStatic {
        /**
          * Creates a LatLngBounds object by defining south-west and north-east corners
          * of the rectangle.
          */
        new(southWest: LatLngExpression, northEast: LatLngExpression): LatLngBounds;

        /**
          * Creates a LatLngBounds object defined by the geographical points it contains.
          * Very useful for zooming the map to fit a particular set of locations with fitBounds.
          */
        new(latlngs: LatLngBoundsExpression): LatLngBounds;
    }

    export var LatLngBounds: LatLngBoundsStatic;
}

declare namespace L {
    /**
      * Creates a Point object with the given x and y coordinates. If optional round
      * is set to true, rounds the x and y values.
      */
    export function point(x: number, y: number, round?: boolean): Point;

    export function point(coords: PointExpression): Point;

    export interface Point {
        /**
          * Returns a copy of the current point.
          */
        clone(): Point;

        /**
          * Returns the result of addition of the current and the given points.
          */
        add(otherPoint: PointExpression): Point;

        /**
          * Returns the result of subtraction of the given point from the current.
          */
        subtract(otherPoint: PointExpression): Point;

        /**
          * Returns the result of division of the current point by the given number. If
          * optional round is set to true, returns a rounded result.
          */
        divideBy(number: number, round?: boolean): Point;

        /**
         * Multiply each coordinate of the current point by each coordinate of scale.
         * In linear algebra terms, multiply the point by the scaling matrix defined by scale.
         */
        scaleBy(scale: PointExpression): Point;

        /**
         * Inverse of scaleBy. Divide each coordinate of the current point by each coordinate of scale.
         */
        unscaleBy(scale: PointExpression): Point;

        /**
          * Returns a copy of the current point with rounded coordinates.
          */
        round(): Point;

        /**
          * Returns a copy of the current point with floored coordinates (rounded down).
          */
        floor(): Point;

        /**
          * Returns a copy of the current point with ceiled coordinates (rounded up).
          */
        ceil(): Point;

        /**
          * Returns the result of multiplication of the current point by the given number.
          */
        multiplyBy(number: number): Point;

        /**
          * Returns the distance between the current and the given points.
          */
        distanceTo(otherPoint: PointExpression): number;

        /**
          * Returns true if the given point has the same coordinates.
          */
        equals(otherPoint: PointExpression): boolean;

        /**
         * Returns true if both coordinates of the given point are less than the
         * corresponding current point coordinates (in absolute values).
         */
        contains(otherPoint: PointExpression): boolean;

        /**
          * Returns a string representation of the point for debugging purposes.
          */
        toString(): string;

        /**
          * The x coordinate.
          */
        x: number;

        /**
          * The y coordinate.
          */
        y: number;
    }

    export interface PointStatic {
        /**
          * Creates a Point object with the given x and y coordinates. If optional round
          * is set to true, rounds the x and y values.
          */
        new(x: number, y: number, round?: boolean): Point;

        new(coords: PointExpression): Point;
    }

    export var Point: PointStatic;
}


declare namespace L {
    /**
      * Creates a Bounds object from two coordinates (usually top-left and bottom-right
      * corners).
      */
    export function bounds(topLeft: PointExpression, bottomRight: PointExpression): Bounds;

    /**
      * Creates a Bounds object defined by the points it contains.
      */
    export function bounds(points: PointExpression[]): Bounds;

    export interface Bounds {
        /**
          * Extends the bounds to contain the given point.
          */
        extend(point: PointExpression): this;

        /**
          * Returns the center point of the bounds.
          */
        getCenter(round?: boolean): Point;

        /**
         *  Returns the bottom-left point of the bounds.
         */
        getBottomLeft(): Point;

        /**
         *  Returns the top-right point of the bounds.
         */
        getTopRight(): Point;

        /**
          * Returns the size of the given bounds.
          */
        getSize(): Point;

        /**
          * Returns true if the rectangle contains the given one.
          */
        contains(otherBounds: BoundsExpression): boolean;

        /**
          * Returns true if the rectangle contains the given point.
          */
        contains(point: PointExpression): boolean;

        /**
          * Returns true if the rectangle intersects the given bounds.
          */
        intersects(otherBounds: BoundsExpression): boolean;

        /**
          * Returns true if the rectangle overlaps the given bounds.
          */
        overlaps(otherBounds: BoundsExpression): boolean;

        /**
          * The top left corner of the rectangle.
          */
        min: Point;

        /**
          * The bottom right corner of the rectangle.
          */
        max: Point;
    }

    export interface BoundsStatic {
        /**
          * Creates a Bounds object from two coordinates (usually top-left and bottom-right
          * corners).
          */
        new(topLeft: PointExpression, bottomRight: PointExpression): Bounds;

        /**
          * Creates a Bounds object defined by the points it contains.
          */
        new(points: PointExpression[]): Bounds;
    }

    export var Bounds: BoundsStatic;
}

declare namespace L {
    /**
      * Creates an icon instance with the given options.
      */
    function icon(options?: IconOptions): Icon;

    export interface IconOptions {

        /**
          * (required) The URL to the icon image (absolute or relative to your script
          * path).
          */
        iconUrl?: string;

        /**
          * The URL to a retina sized version of the icon image (absolute or relative to
          * your script path). Used for Retina screen devices.
          */
        iconRetinaUrl?: string;

        /**
          * Size of the icon image in pixels.
          */
        iconSize?: PointExpression;

        /**
          * The coordinates of the "tip" of the icon (relative to its top left corner).
          * The icon will be aligned so that this point is at the marker's geographical
          * location. Centered by default if size is specified, also can be set in CSS
          * with negative margins.
          */
        iconAnchor?: PointExpression;

        /**
          * The coordinates of the point from which popups will "open", relative to the
          * icon anchor.
          */
        popupAnchor?: PointExpression;

        /**
          * The URL to the icon shadow image. If not specified, no shadow image will be
          * created.
          */
        shadowUrl?: string;

        /**
          * The URL to the retina sized version of the icon shadow image. If not specified,
          * no shadow image will be created. Used for Retina screen devices.
          */
        shadowRetinaUrl?: string;

        /**
          * Size of the shadow image in pixels.
          */
        shadowSize?: PointExpression;

        /**
          * The coordinates of the "tip" of the shadow (relative to its top left corner)
          * (the same as iconAnchor if not specified).
          */
        shadowAnchor?: PointExpression;

        /**
          * A custom class name to assign to both icon and shadow images. Empty by default.
          */
        className?: string;
    }

    export interface IconStatic extends ClassStatic {
        new(options?: IconOptions): Icon;

        Default: {
            new(): Icon.Default

            imagePath: string;
        }
    }

    export interface Icon {
        options: IconOptions;

        /**
         * Called internally when the icon has to be shown, returns a <img> HTML
         * element styled according to the options.
         */
        createIcon(oldIcon?: HTMLElement): HTMLElement;

        /**
         * As createIcon, but for the shadow beneath it.
         */
        createShadow(oldIcon?: HTMLElement): HTMLElement;
    }

    namespace Icon {
        /**
          * L.Icon.Default extends L.Icon and is the blue icon Leaflet uses
          * for markers by default.
          */
        export interface Default extends Icon {}
    }

    export var Icon: IconStatic;
}

declare namespace L {
    /**
      * Creates a div icon instance with the given options.
      */
    function divIcon(options?: DivIconOptions): DivIcon;

    export interface DivIconOptions extends IconOptions {

        /**
          * A custom HTML code to put inside the div element.
          *
          * Default value: ''.
          */
        html?: string;

        /**
         * Optional relative position of the background, in pixels.
         *
         * Default value: [0, 0]
         */
        bgPos?: PointExpression;
    }

    export interface DivIconStatic {
        new(options?: DivIconOptions): DivIcon;
    }

    export interface DivIcon extends Icon {
        options: DivIconOptions;
    }

    export var DivIcon: DivIconStatic;
}

declare namespace L {
    namespace Browser {
        /**
          * true for all Internet Explorer versions (not Edge).
          */
        export var ie: boolean;

        /**
          * true for Internet Explorer versions less than 9.
          */
        export var ielt9: boolean;

        /**
          * true for the Edge web browser.
          */
        export var edge: boolean;

        /**
          * true for webkit-based browsers like Chrome and Safari (including mobile versions).
          */
        export var webkit: boolean;

        /**
          * true for gecko-based browsers like Firefox.
          */
        export var gecko: boolean;

        /**
          * true for any browser running on an Android platform.
          */
        export var android: boolean;

        /**
          * true for browsers running on Android 2 or Android 3.
          */
        export var android23: boolean;

        /**
          * true for the Chrome browser.
          */
        export var chrome: boolean;

        /**
          * true for the Safari browser.
          */
        export var safari: boolean;

        /**
          * true for all Internet Explorer versions supporting CSS transforms.
          */
        export var ie3d: boolean;

        /**
          * true for webkit-based browsers supporting CSS transforms.
          */
        export var webkit3d: boolean;

        /**
          * true for gecko-based browsers supporting CSS transforms.
          */
        export var gecko3d: boolean;

        /**
          * true for the Opera browser supporting CSS transforms (version 12 or later).
          */
        export var opera12: boolean;

        /**
          * true for all browsers supporting CSS transforms.
          */
        export var any3d: boolean;

        /**
          * true for all browsers running in a mobile devide.
          */
        export var mobile: boolean;

        /**
          * true for all webkit-based browsers in a mobile device.
          */
        export var mobileWebkit: boolean;

        /**
          * true for all webkit-based browsers in a mobile device supporting CSS transforms.
          */
        export var mobileWebkit3d: boolean;

        /**
          * true for the Opera browser in a mobile device.
          */
        export var mobileOpera: boolean;

        /**
          * true for gecko-based browsers running in a mobile device.
          */
        export var mobileGecko: boolean;

        /**
          * true for all browsers supporting touch events.
          */
        export var touch: boolean;

        /**
          * true for browsers implementing the Microsoft touch events model (notably IE10).
          */
        export var msPointer: boolean;

        /**
          * true for all browsers supporting pointer events.
          */
        export var pointer: boolean;

        /**
          * true for browsers on a high-resolution "retina" screen.
          */
        export var retina: boolean;

        /**
         * true when the browser supports <canvas>.
         */
        export var canvas: boolean;

        /**
         * true if the browser supports VML.
         */
        export var vml: boolean;

        /**
         * true when the browser supports SVG.
         */
        export var svg: boolean;
    }
}

declare namespace L {
    /**
      * Merges the properties of the src object (or multiple objects) into dest object
      * and returns the latter. Has an L.extend shortcut.
      */
    export function extend(dest: any, ...sources: any[]): any;

    /**
      * Returns a function which executes function fn with the given scope obj (so
      * that this keyword refers to obj inside the function code). Has an L.bind shortcut.
      */
    export function bind<T extends Function>(fn: T, obj: any): T;

    /**
      * Merges the given properties to the options of the obj object, returning the
      * resulting options. See Class options. Has an L.setOptions shortcut.
      */
    export function setOptions(obj: any, options: any): any;

    namespace Util {
        /**
          * Merges the properties of the src object (or multiple objects) into dest object
          * and returns the latter. Has an L.extend shortcut.
          */
        export function extend(dest: any, ...sources: any[]): any;

        /**
         * Compatibility polyfill for Object.create
         */
        export function create(proto: any, properties?: any): any;

        /**
          * Returns a function which executes function fn with the given scope obj (so
          * that this keyword refers to obj inside the function code). Has an L.bind shortcut.
          */
        export function bind<T extends Function>(fn: T, obj: any): T;

        /**
          * Returns the unique ID of an object, assiging it one if it doesn't have it.
          */
        export function stamp(obj: any): number;

        /**
          * Returns a wrapper around the function fn that makes sure it's called not more
          * often than a certain time interval time, but as fast as possible otherwise
          * (for example, it is used for checking and requesting new tiles while dragging
          * the map), optionally passing the scope (context) in which the function will
          * be called.
          */
        export function throttle<T extends Function>(fn: T, time: number, context?: any): T;

        /**
         * Returns the number num modulo range in such a way so it lies within range[0] and range[1].
         * The returned value will be always smaller than range[1] unless includeMax is set to true.
         */
        export function wrapNum(num: number, range: number[], includeMax?: boolean): number;

        /**
          * Returns a function which always returns false.
          */
        export function falseFn(): () => boolean;

        /**
          * Returns the number num rounded to digits decimals.
          */
        export function formatNum(num: number, digits?: number): number;

        /**
         * Compatibility polyfill for String.prototype.trim
         */
        export function trim(str: string): string;

        /**
          * Trims and splits the string on whitespace and returns the array of parts.
          */
        export function splitWords(str: string): string[];

        /**
          * Merges the given properties to the options of the obj object, returning the
          * resulting options. See Class options. Has an L.setOptions shortcut.
          */
        export function setOptions(obj: any, options: any): any;

        /**
          * Converts an object into a parameter URL string, e.g. {a: "foo", b: "bar"}
          * translates to '?a=foo&b=bar'.
          */
        export function getParamString(obj: any, existingUrl?: string, uppercase?: boolean): string;

        /**
         * Simple templating facility, accepts a template string of the form 'Hello {a}, {b}'
         * and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
         * ('Hello foo, bar'). You can also specify functions instead of strings for
         * data values — they will be evaluated passing `data` as an argument.
         */
        export function template(str: string, data: any): string;

        /**
          * Returns true if the given object is an array.
          */
        export function isArray(obj: any): boolean;

        /**
         * Compatibility polyfill for Array.prototype.indexOf
         */
        export function indexOf(array: any[], el: any): number;

        /**
         * Schedules fn to be executed when the browser repaints.
         * fn is bound to context if given. When immediate is set, fn is called immediately
         * if the browser doesn't have native support for window.requestAnimationFrame,
         * otherwise it's delayed. Returns an id that can be used to cancel the request.
         */
        export function requestAnimFrame(fn: Function, context?: any, immediate?: boolean): number;

        /**
         * [cancelAnimFrame description]
         * @param  {[type]} id: number        [description]
         * @return {[type]}     [description]
         */
        export function cancelAnimFrame(id: number): void;

        /**
         * Last unique ID used by stamp()
         */
        export var lastId: number;

        /**
         * Data URI string containing a base64-encoded empty GIF image.
         * Used as a hack to free memory from unused images on WebKit-powered mobile devices (by setting image src to this string).
         */
        export var emptyImageUrl: string;
    }
}

declare namespace L {
    export interface TransformationStatic {
        /**
          * Creates a transformation object with the given coefficients.
          */
        new(a: number, b: number, c: number, d: number): Transformation;
    }

    export interface Transformation {
        /**
          * Returns a transformed point, optionally multiplied by the given scale.
          * Only accepts real L.Point instances, not arrays.
          */
        transform(point: Point, scale?: number): Point;

        /**
          * Returns the reverse transformation of the given point, optionally divided
          * by the given scale. Only accepts real L.Point instances, not arrays.
          */
        untransform(point: Point, scale?: number): Point;
    }

    export var Transformation: TransformationStatic;
}

declare namespace L {
    namespace LineUtil {
        /**
          * Dramatically reduces the number of points in a polyline while retaining
          * its shape and returns a new array of simplified points. Used for a huge performance
          * boost when processing/displaying Leaflet polylines for each zoom level
          * and also reducing visual noise. tolerance affects the amount of simplification
          * (lesser value means higher quality but slower and with more points). Also
          * released as a separated micro-library Simplify.js.
          */
        export function simplify(points: Point[], tolerance: number): Point[];

        /**
          * Returns the distance between point p and segment p1 to p2.
          */
        export function pointToSegmentDistance(p: Point, p1: Point, p2: Point): number;

        /**
          * Returns the closest point from a point p on a segment p1 to p2.
          */
        export function closestPointOnSegment(p: Point, p1: Point, p2: Point): Point;

        /**
          * Clips the segment a to b by rectangular bounds. Used by Leaflet to only show 
          * polyline points that are on the screen or near, increasing performance. Returns
          * either false or a length-2 array of clipped points.
          */
        export function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: boolean, round?: boolean): void;
    }
}

declare namespace L {
    namespace PolyUtil {
        /**
          * Clips the polygon geometry defined by the given points by rectangular bounds.
          * Used by Leaflet to only show polygon points that are on the screen or near,
          * increasing performance. Note that polygon points needs different algorithm
          * for clipping than polyline, so there's a seperate method for it.
          */
        export function clipPolygon(points: Point[], bounds: Bounds, round?: boolean): Point[];
    }
}

declare namespace L {
    export interface DomEvent {
        /**
          * Adds a listener fn to the element's DOM event of the specified type. this keyword
          * inside the listener will point to context, or to the element if not specified.
          */
        addListener(el: HTMLElement, type: string, fn: (e: Event) => void, context?: any): this;
        on(el: HTMLElement, type: string, fn: (e: Event) => void, context?: any): this;

        /**
          * Removes an event listener from the element.
          */
        removeListener(el: HTMLElement, type: string, fn: (e: Event) => void, context?: any): this;
        off(el: HTMLElement, type: string, fn: (e: Event) => void, context?: any): this;

        /**
          * Stop the given event from propagation to parent elements. Used inside the
          * listener functions:
          * L.DomEvent.addListener(div, 'click', function
          * (e) {
          * L.DomEvent.stopPropagation(e);
          * });
          */
        stopPropagation(e: Event): this;

        /**
          * Adds stopPropagation to the element's 'mousewheel' events.
          */
        disableScrollPropagation(el: HTMLElement): this;

        /**
          * Adds stopPropagation to the element's 'click', 'doubleclick', 'mousedown'
          * and 'touchstart' events.
          */
        disableClickPropagation(el: HTMLElement): this;

        /**
          * Prevents the default action of the event from happening (such as following
          * a link in the href of the a element, or doing a POST request with page reload
          * when form is submitted). Use it inside listener functions.
          */
        preventDefault(e: Event): this;

        /**
          * Does stopPropagation and preventDefault at the same time.
          */
        stop(e: Event): this;

        /**
          * Gets normalized mouse position from a DOM event relative to the container
          * or to the whole page if not specified.
          */
        getMousePosition(e: Event, container?: HTMLElement): Point;

        /**
          * Gets normalized wheel delta from a mousewheel DOM event.
          */
        getWheelDelta(e: Event): number;

    }

    export var DomEvent: DomEvent;
}

declare namespace L {
    namespace DomUtil {
        /**
          * Returns an element with the given id if a string was passed, or just returns
          * the element if it was passed directly.
          */
        export function get(id: string | HTMLElement): HTMLElement;

        /**
          * Returns the value for a certain style attribute on an element, including
          * computed values or values set through CSS.
          */
        export function getStyle(el: HTMLElement, style: string): string;

        /**
          * Creates an element with tagName, sets the className, and optionally appends
          * it to container element.
          */
        export function create(tagName: string, className: string, container?: HTMLElement): HTMLElement;

        export function remove(el: HTMLElement): void

        export function empty(el: HTMLElement): void

        export function toFront(el: HTMLElement): void

        export function toBack(el: HTMLElement): void;

        /**
          * Returns true if the element class attribute contains name.
          */
        export function hasClass(el: HTMLElement, name: string): boolean;

        /**
          * Adds name to the element's class attribute.
          */
        export function addClass(el: HTMLElement, name: string): void;

        /**
          * Removes name from the element's class attribute.
          */
        export function removeClass(el: HTMLElement, name: string): void;

        /**
         * Sets the element's class.
         */
        export function setClass(el: HTMLElement, name: string): void;

        /**
         * Returns the element's class.
         */
        export function getClass(el: HTMLElement): string;

        /**
          * Set the opacity of an element (including old IE support). Value must be from
          * 0 to 1.
          */
        export function setOpacity(el: HTMLElement, value: number): void;

        /**
          * Goes through the array of style names and returns the first name that is a valid
          * style name for an element. If no such name is found, it returns false. Useful
          * for vendor-prefixed styles like transform.
          */
        export function testProp(props: string[]): any;

        /**
         * Resets the 3D CSS transform of el so it is translated by offset pixels and
         * optionally scaled by scale. Does not have an effect if the browser doesn't support 3D CSS transforms.
         */
        export function setTransform(el: HTMLElement, offset: Point, scale?: number): void;

        /**
          * Sets the position of an element to coordinates specified by point, using
          * CSS translate or top/left positioning depending on the browser (used by
          * Leaflet internally to position its layers). Forces top/left positioning
          * if disable3D is true.
          */
        export function setPosition(el: HTMLElement, point: Point, disable3D?: boolean): void;

        /**
          * Returns the coordinates of an element previously positioned with setPosition.
          */
        export function getPosition(el: HTMLElement): Point;

        /**
          * Makes sure text cannot be selected, for example during dragging.
          */
        export function disableTextSelection(): void;

        /**
          * Makes text selection possible again.
          */
        export function enableTextSelection(): void;

        /**
         * As L.DomUtil.disableTextSelection, but for dragstart DOM events,
         * usually generated when the user drags an image.
         */
        export function disableImageDrag(): void;

        /**
         * Cancels the effects of a previous L.DomUtil.disableImageDrag.
         */
        export function enableImageDrag(): void;

        /**
         * Makes the outline of the element el invisible. Used internally by Leaflet to prevent
         * focusable elements from displaying an outline when the user performs a drag interaction on them.
         */
        export function preventOutline(el: HTMLElement): void;

        /**
         * Cancels the effects of a previous L.DomUtil.preventOutline.
         */
        export function restoreOutline(el: HTMLElement): void;

        /**
          * Vendor-prefixed transform style name.
          */
        export var TRANSFORM: string;

        /**
          * Vendor-prefixed transition style name (e.g. 'webkitTransition' for WebKit).
          */
        export var TRANSITION: string;
    }
}

declare namespace L {
    export interface PosAnimationStatic {
        /**
          * Creates a PosAnimation object.
          */
        new(): PosAnimation;
    }

    export var PosAnimation: PosAnimationStatic;

    export interface PosAnimation extends Evented {
        /**
          * Run an animation of a given element to a new position, optionally setting
          * duration in seconds (0.25 by default) and easing linearity factor (3rd argument
          * of the cubic bezier curve, 0.5 by default)
          */
        run(element: HTMLElement, newPos: Point, duration?: number, easeLinearity?: number): void;

        /**
         * Stops the animation (if currently running).
         */
        stop(): void;
    }
}

declare namespace L {
    export interface DraggableOptions {
        /**
         * The max number of pixels a user can shift the mouse pointer during a click
         * for it to be considered a valid click (as opposed to a mouse drag).
         * Creates a Draggable object for moving el when you start dragging the
         * dragHandle element (equals el itself by default).
         *
         * Default value: 3
         */
        clickTolerance: number;
    }

    export interface DraggableStatic {
        new(element: HTMLElement, dragStartTarget: HTMLElement, preventOutline?: boolean, options?: DraggableOptions): Draggable;
    }

    export var Draggable: DraggableStatic;

    export interface Draggable {
        /**
          * Enables the dragging ability.
          */
        enable(): void;

        /**
          * Disables the dragging ability.
          */
        disable(): void;
    }
}

declare namespace L {
    export interface ClassExtendProps {
        /**
          * Your class's constructor function, meaning that it gets called when you do 'new MyClass(...)'.
          */
        initialize?: Function;

        /**
          * options is a special property that unlike other objects that you pass
          * to extend will be merged with the parent one instead of overriding it
          * completely, which makes managing configuration of objects and default
          * values convenient.
          */
        options?: any;

        /**
          * includes is a special class property that merges all specified objects
          * into the class (such objects are called mixins). A good example of this
          * is L.Mixin.Events that event-related methods like on, off and fire
          * to the class.
          */
        includes?: any;

        /**
          * statics is just a convenience property that injects specified object
          * properties as the static properties of the class, useful for defining
          * constants.
          */
        statics?: any;

        [prop: string]: any;
    }

    export interface ClassStatic {
        extend(props: ClassExtendProps): {
            new(...args: any[]): any;
        }

        extend<Constructor>(props: ClassExtendProps): Constructor;

        include(props: any): void;

        mergeOptions(options: any): void;

        addInitHook(fn: Function): void;

        addInitHook(methodName: string, ...args: any[]): void;
    }

    export interface Class {
        extend(props: ClassExtendProps): {
            new(...args: any[]): any;
        }

        extend<Constructor>(props: ClassExtendProps): Constructor;
    }

    export var Class: Class;
}

declare namespace L {
    namespace Evented {
        export interface EventedMap {
            click?: (e: MouseEvent) => void;
            dblclick?: (e: MouseEvent) => void;
            mousedown?: (e: MouseEvent) => void;
            mouseup?: (e: MouseEvent) => void;
            mouseover?: (e: MouseEvent) => void;
            mousemove?: (e: MouseEvent) => void;
            contextmenu?: (e: MouseEvent) => void;
            preclick?: (e: MouseEvent) => void;
            locationfound?: (e: LocationEvent) => void;
            locationerror?: (e: ErrorEvent) => void;
            layeradd?: (e: LayerEvent) => void;
            layerremove?: (e: LayerEvent) => void;
            baselayerchange?: (e: LayersControlEvent) => void;
            overlayadd?: (e: LayersControlEvent) => void;
            overlayremove?: (e: LayersControlEvent) => void;
            tileunload?: (e: TileEvent) => void;
            tileloadstart?: (e: TileEvent) => void;
            tileload?: (e: TileEvent) => void;
            tileerror?: (e: TileErrorEvent) => void;
            resize?: (e: ResizeEvent) => void;
            popupopen?: (e: PopupEvent) => void;
            popupclose?: (e: PopupEvent) => void;
            dragend?: (e: DragEndEvent) => void;
            zoomanim?: (e: ZoomAnimEvent) => void;
        }
    }

    export interface Evented {
        /**
         * Adds a listener function (fn) to a particular event type of the object.
         * You can optionally specify the context of the listener (object the this
         * keyword will point to). You can also pass several space-separated types (e.g. 'click dblclick').
         */
        on(type: 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseover' | 'mousemove' | 'contextmenu' | 'preclick', fn: (e: MouseEvent) => void, context?: any): this;
        on(type: 'locationfound', fn: (e: LocationEvent) => void, context?: any): this;
        on(type: 'locationerror', fn: (e: ErrorEvent) => void, context?: any): this;
        on(type: 'layeradd' | 'layerremove', fn: (e: LayerEvent) => void, context?: any): this;
        on(type: 'baselayerchange' | 'overlayadd' | 'overlayremove', fn: (e: LayersControlEvent) => void, context?: any): this;
        on(type: 'tileunload' | 'tileloadstart' | 'tileload', fn: (e: TileEvent) => void, context?: any): this;
        on(type: 'tileerror', fn: (e: TileErrorEvent) => void, context?: any): this;
        on(type: 'resize', fn: (e: ResizeEvent) => void, context?: any): this;
        on(type: 'popupopen' | 'popupclose', fn: (e: PopupEvent) => void, context?: any): this;
        on(type: 'dragend', fn: (e: DragEndEvent) => void, context?: any): this;
        on(type: 'zoomanim', fn: (e: ZoomAnimEvent) => void, context?: any): this;
        on(type: string, fn: (e: Event) => void, context?: any): this;

        /**
         * Adds a set of type/listener pairs, e.g. {click: onClick, mousemove: onMouseMove}
         */
        on(eventMap: Evented.EventedMap): this;

        /**
         * Removes a previously added listener function. If no function is specified,
         * it will remove all the listeners of that particular event from the object.
         * Note that if you passed a custom context to on, you must pass the
         * same context to off in order to remove the listener.
         */
        off(type: 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseover' | 'mousemove' | 'contextmenu' | 'preclick', fn: (e: MouseEvent) => void, context?: any): this;
        off(type: 'locationfound', fn: (e: LocationEvent) => void, context?: any): this;
        off(type: 'locationerror', fn: (e: ErrorEvent) => void, context?: any): this;
        off(type: 'layeradd' | 'layerremove', fn: (e: LayerEvent) => void, context?: any): this;
        off(type: 'baselayerchange' | 'overlayadd' | 'overlayremove', fn: (e: LayersControlEvent) => void, context?: any): this;
        off(type: 'tileunload' | 'tileloadstart' | 'tileload', fn: (e: TileEvent) => void, context?: any): this;
        off(type: 'tileerror', fn: (e: TileErrorEvent) => void, context?: any): this;
        off(type: 'resize', fn: (e: ResizeEvent) => void, context?: any): this;
        off(type: 'popupopen' | 'popupclose', fn: (e: PopupEvent) => void, context?: any): this;
        off(type: 'dragend', fn: (e: DragEndEvent) => void, context?: any): this;
        off(type: 'zoomanim', fn: (e: ZoomAnimEvent) => void, context?: any): this;
        off(type: string, fn: (e: Event) => void, context?: any): this;

        /**
         * Removes a set of type/listener pairs.
         */
        off(eventMap: any): this;

        /**
         * Removes all listeners to all events on the object.
         */
        off(): this;

        /**
         * Fires an event of the specified type. You can optionally provide an
         * data object — the first argument of the listener function will contain
         * its properties. The event might can optionally be propagated to event parents.
         */
        fire(type: string, data?: any, propagate?: boolean): this;

        /**
         * Returns true if a particular event type has any listeners attached to it.
         */
        listens(type: string): boolean;

        /**
         * Behaves as on(...), except the listener will only get fired once and then removed.
         */
        once(type: 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseover' | 'mousemove' | 'contextmenu' | 'preclick', fn: (e: MouseEvent) => void, context?: any): this;
        once(type: 'locationfound', fn: (e: LocationEvent) => void, context?: any): this;
        once(type: 'locationerror', fn: (e: ErrorEvent) => void, context?: any): this;
        once(type: 'layeradd' | 'layerremove', fn: (e: LayerEvent) => void, context?: any): this;
        once(type: 'baselayerchange' | 'overlayadd' | 'overlayremove', fn: (e: LayersControlEvent) => void, context?: any): this;
        once(type: 'tileunload' | 'tileloadstart' | 'tileload', fn: (e: TileEvent) => void, context?: any): this;
        once(type: 'tileerror', fn: (e: TileErrorEvent) => void, context?: any): this;
        once(type: 'resize', fn: (e: ResizeEvent) => void, context?: any): this;
        once(type: 'popupopen' | 'popupclose', fn: (e: PopupEvent) => void, context?: any): this;
        once(type: 'dragend', fn: (e: DragEndEvent) => void, context?: any): this;
        once(type: 'zoomanim', fn: (e: ZoomAnimEvent) => void, context?: any): this;
        once(type: string, fn: (e: Event) => void, context?: any): this;

        /**
         * Adds an event parent - an Evented that will receive propagated events
         */
        addEventParent(obj: Evented): this;

        /**
         * Adds an event parent - an Evented that will receive propagated events
         */
        removeEventParent(obj: Evented): this;

        /**
         * Alias to on(...)
         */
        addEventListener(type: 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseover' | 'mousemove' | 'contextmenu' | 'preclick', fn: (e: MouseEvent) => void, context?: any): this;
        addEventListener(type: 'locationfound', fn: (e: LocationEvent) => void, context?: any): this;
        addEventListener(type: 'locationerror', fn: (e: ErrorEvent) => void, context?: any): this;
        addEventListener(type: 'layeradd' | 'layerremove', fn: (e: LayerEvent) => void, context?: any): this;
        addEventListener(type: 'baselayerchange' | 'overlayadd' | 'overlayremove', fn: (e: LayersControlEvent) => void, context?: any): this;
        addEventListener(type: 'tileunload' | 'tileloadstart' | 'tileload', fn: (e: TileEvent) => void, context?: any): this;
        addEventListener(type: 'tileerror', fn: (e: TileErrorEvent) => void, context?: any): this;
        addEventListener(type: 'resize', fn: (e: ResizeEvent) => void, context?: any): this;
        addEventListener(type: 'popupopen' | 'popupclose', fn: (e: PopupEvent) => void, context?: any): this;
        addEventListener(type: 'dragend', fn: (e: DragEndEvent) => void, context?: any): this;
        addEventListener(type: 'zoomanim', fn: (e: ZoomAnimEvent) => void, context?: any): this;
        addEventListener(type: string, fn: (e: Event) => void, context?: any): this;

        /**
         * Alias to off(...)
         */
        removeEventListener(type: 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseover' | 'mousemove' | 'contextmenu' | 'preclick', fn: (e: MouseEvent) => void, context?: any): this;
        removeEventListener(type: 'locationfound', fn: (e: LocationEvent) => void, context?: any): this;
        removeEventListener(type: 'locationerror', fn: (e: ErrorEvent) => void, context?: any): this;
        removeEventListener(type: 'layeradd' | 'layerremove', fn: (e: LayerEvent) => void, context?: any): this;
        removeEventListener(type: 'baselayerchange' | 'overlayadd' | 'overlayremove', fn: (e: LayersControlEvent) => void, context?: any): this;
        removeEventListener(type: 'tileunload' | 'tileloadstart' | 'tileload', fn: (e: TileEvent) => void, context?: any): this;
        removeEventListener(type: 'tileerror', fn: (e: TileErrorEvent) => void, context?: any): this;
        removeEventListener(type: 'resize', fn: (e: ResizeEvent) => void, context?: any): this;
        removeEventListener(type: 'popupopen' | 'popupclose', fn: (e: PopupEvent) => void, context?: any): this;
        removeEventListener(type: 'dragend', fn: (e: DragEndEvent) => void, context?: any): this;
        removeEventListener(type: 'zoomanim', fn: (e: ZoomAnimEvent) => void, context?: any): this;
        removeEventListener(type: string, fn: (e: Event) => void, context?: any): this;

        /**
         * Alias to off()
         */
        clearAllEventListeners(): this;

        /**
         * Alias to once(...)
         */
        addOneTimeEventListener(type: 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseover' | 'mousemove' | 'contextmenu' | 'preclick', fn: (e: MouseEvent) => void, context?: any): this;
        addOneTimeEventListener(type: 'locationfound', fn: (e: LocationEvent) => void, context?: any): this;
        addOneTimeEventListener(type: 'locationerror', fn: (e: ErrorEvent) => void, context?: any): this;
        addOneTimeEventListener(type: 'layeradd' | 'layerremove', fn: (e: LayerEvent) => void, context?: any): this;
        addOneTimeEventListener(type: 'baselayerchange' | 'overlayadd' | 'overlayremove', fn: (e: LayersControlEvent) => void, context?: any): this;
        addOneTimeEventListener(type: 'tileunload' | 'tileloadstart' | 'tileload', fn: (e: TileEvent) => void, context?: any): this;
        addOneTimeEventListener(type: 'tileerror', fn: (e: TileErrorEvent) => void, context?: any): this;
        addOneTimeEventListener(type: 'resize', fn: (e: ResizeEvent) => void, context?: any): this;
        addOneTimeEventListener(type: 'popupopen' | 'popupclose', fn: (e: PopupEvent) => void, context?: any): this;
        addOneTimeEventListener(type: 'dragend', fn: (e: DragEndEvent) => void, context?: any): this;
        addOneTimeEventListener(type: 'zoomanim', fn: (e: ZoomAnimEvent) => void, context?: any): this;
        addOneTimeEventListener(type: string, fn: (e: Event) => void, context?: any): this;

        /**
         * Alias to fire(...)
         */
        fireEvent(type: string, data?: any, propagate?: boolean): this;

        /**
         * Alias to listens(...)
         */
        hasEventListeners(type: string): boolean;
    }
}

declare namespace L {
    interface LayerOptions {
        /**
         * By default the layer will be added to the map's overlay pane.
         * Overriding this option will cause the layer to be placed on another pane by default.
         */
        pane?: string;
    }

    export interface LayerStatic extends ClassStatic {
        new(): Layer;
    }

    export interface Layer extends Evented {

        /**
         * Adds the layer to the given map
         */
        addTo(map: Map | LayerGroup): this;

        /**
         * Removes the layer from the map it is currently active on.
         */
        remove(): this;

        /**
         * Removes the layer from the given map
         */
        removeFrom(map: Map): this;

        /**
         * Returns the HTMLElement representing the named pane on the map.
         * If name is omitted, returns the pane for this layer.
         */
        getPane(name?: string): HTMLElement;

        /**
         * Binds a popup to the layer with the passed content and sets up the neccessary event listeners.
         * If a Function is passed it will receive the layer as the first argument
         * and should return a String or HTMLElement.
         */
        bindPopup(content: HTMLElement, options?: PopupOptions): this;
        bindPopup(content: (layer: Layer) => string, options?: PopupOptions): this;
        bindPopup(content: Popup, options?: PopupOptions): this;
        bindPopup(content: string, options?: PopupOptions): this;

        /**
         * Removes the popup previously bound with bindPopup.
         */
        unbindPopup(): this;

        /**
         * Opens the bound popup at the specificed latlng or
         * at the default popup anchor if no latlng is passed.
         */
        openPopup(latlng?: LatLngExpression): this;

        /**
         * Closes the popup bound to this layer if it is open. Opens or closes the popup
         * bound to this layer depending on its current state.
         * Returns true if the popup bound to this layer is currently open.
         */
        closePopup(): this;

        /**
         * Sets the content of the popup bound to this layer.
         */
        setPopupContent(content: string): this;
        setPopupContent(content: HTMLElement): this;
        setPopupContent(content: (layer: Layer) => string): this;
        setPopupContent(content: Popup): this;

        /**
         * Returns the popup bound to this layer.
         */
        getPopup(): Popup;

        /**
         * Should contain code that creates DOM elements for the layer, adds them to
         * map panes where they should belong and puts listeners on relevant map events.
         * Called on map.addLayer(layer).
         */
        onAdd(map: Map): this;

        /**
         * Should contain all clean up code that removes the layer's elements from the
         * DOM and removes listeners previously added in onAdd.
         * Called on map.removeLayer(layer).
         */
        onRemove(map: Map): this;

        /**
         * This optional method should return an object like { viewreset: this._reset } for addEventListener.
         * These events will be automatically added and removed from the map with your layer.
         */
        getEvents?(): Evented.EventedMap;

        /**
         * This optional method should return a string containing HTML to be shown
         * on the Attribution control whenever the layer is visible.
         */
        getAttribution?(): string;

        /**
         * Optional method. Called on map.addLayer(layer), before the layer is added to the map,
         * before events are initialized, without waiting until the map is in a usable state.
         * Use for early initialization only.
         */
        beforeAdd?(map: Map): this;
    }

    export var Layer: LayerStatic;
}

declare namespace L {
    export interface ControlOptions {
        /**
          * The position of the control (one of the map corners).
          * Possible values are 'topleft', 'topright', 'bottomleft' or 'bottomright'
          * 
          * Default value: 'topleft'.
          */
        position?: string;
    }

    export interface ControlStatic extends ClassStatic {
        /**
          * Creates a control with the given options.
          */
        new(options?: ControlOptions): Control;

        Zoom: Control.ZoomStatic;
        Attribution: Control.AttributionStatic;
        Layers: Control.LayersStatic;
        Scale: Control.ScaleStatic;
    }

    export interface Control {
        /**
          * Returns the current position of the control.
          */
        getPosition(): string;

        /**
          * Sets the position of the control. See control positions.
          */
        setPosition(position: string): this;

        /**
          * Returns the HTML container of the control.
          */
        getContainer(): HTMLElement;

        /**
          * Adds the control to the map.
          */
        addTo(map: Map): this;

        /**
          * Removes the control from the map.
          */
        remove(): this;

        /**
         * Should return the container DOM element for the control and add listeners
         * on relevant map events. Called on control.addTo(map).
         */
        onAdd(map: Map): HTMLElement;

        /**
         * Optional method. Should contain all clean up code that removes the listeners
         * previously added in onAdd. Called on control.remove().
         */
        onRemove(map: Map): void;
    }

    export var Control: ControlStatic;

    export interface ControlFactory {
        /**
         * Create a control object.
         */
        (options?: ControlOptions): Control;

        /**
          * Creates a zoom control.
          */
        zoom(options?: Control.ZoomOptions): Control.Zoom;

        /**
          * Creates an attribution control.
          */
        attribution(options?: Control.AttributionOptions): Control.Attribution;

        /**
          * Creates an attribution control with the given layers. Base layers will be
          * switched with radio buttons, while overlays will be switched with checkboxes.
          */
        layers(baseLayers?: { [key: string]: Layer }, overlays?: { [key: string]: Layer }, options?: Control.LayersOptions): Control.Layers;

        /**
          * Creates an scale control with the given options.
          */
        scale(options?: Control.ScaleOptions): Control.Scale;
    }

    namespace Control {
        export interface ZoomOptions extends ControlOptions {

            /**
             * The text set on the zoom in button.
             *
             * Default value: '+'
             */
            zoomInText?: string;

            /**
             * The title set on the zoom in button.
             *
             * Default value: 'Zoom in'
             */
            zoomInTitle?: string;

            /**
             * The text set on the zoom out button.
             *
             * Default value: '-'
             */
            zoomOutText?: string;

            /**
             * The title set on the zoom out button.
             *
             * Default value: 'Zoom out'
             */
            zoomOutTitle?: string;
        }

        export interface ZoomStatic extends ClassStatic {
            new(options?: ZoomOptions): Zoom;
        }

        export interface Zoom extends Control {
            options: ZoomOptions;
        }

        export interface AttributionOptions extends ControlOptions {
            /**
             * The HTML text shown before the attributions. Pass false to disable.
             *
             * Default value: 'Leaflet'
             */
            prefix?: string | boolean;
        }

        export interface AttributionStatic extends ClassStatic {
            new(options?: AttributionOptions): Attribution;
        }

        export interface Attribution extends Control {
            options: AttributionOptions;

            /**
              * Sets the text before the attributions.
              */
            setPrefix(prefix: string): this;

            /**
              * Adds an attribution text (e.g. 'Vector data &copy; Mapbox').
              */
            addAttribution(text: string): this;

            /**
              * Removes an attribution text.
              */
            removeAttribution(text: string): this;
        }

        export interface LayersOptions extends ControlOptions {
            /**
             * If true, the control will be collapsed into an icon and expanded on mouse hover or touch.
             *
             * Default value: true.
             */
            collapsed?: boolean;

            /**
             * If true, the control will assign zIndexes in increasing order to
             * all of its layers so that the order is preserved when switching them on/off.
             *
             * Default value: true.
             */
            autoZIndex?: boolean;

            /**
             * If true, the base layers in the control will be hidden when there is only one.
             *
             * Default value: false.
             */
            hideSingleBase?: boolean;
        }

        export interface LayersStatic extends ClassStatic {
            new(baseLayers?: { [key: string]: Layer }, overlays?: { [key: string]: Layer }, options?: LayersOptions): Layers;
        }

        export interface Layers extends Control {
            options: LayersOptions;

            /**
              * Adds a base layer (radio button entry) with the given name to the control.
              */
            addBaseLayer(layer: Layer, name: string): this;

            /**
              * Adds an overlay (checkbox entry) with the given name to the control.
              */
            addOverlay(layer: Layer, name: string): this;

            /**
              * Remove the given layer from the control.
              */
            removeLayer(layer: Layer): this;

            /**
             * Expand the control container if collapsed.
             */
            expand(): this;

            /**
             * Collapse the control container if expanded.
             */
            collapse(): this;
        }

        export interface ScaleOptions extends ControlOptions {
            /**
             * Maximum width of the control in pixels. The width is set
             * dynamically to show round values (e.g. 100, 200, 500).
             *
             * Default value: 100.
             */
            maxWidth?: number;

            /**
             * Whether to show the metric scale line (m/km).
             *
             * Default value: true.
             */
            metric?: boolean;

            /**
             * Whether to show the imperial scale line (mi/ft).
             *
             * Default value: true
             */
            imperial?: boolean;

            /**
             * If true, the control is updated on moveend, otherwise it's always up-to-date (updated on move).
             *
             * Default value: false.
             */
            updateWhenIdle?: boolean;
        }

        export interface ScaleStatic extends ClassStatic {
            new(options?: ScaleOptions): Scale;
        }

        export interface Scale extends Control {
            options: ScaleOptions;
        }
    }

    export var control: ControlFactory;
}

declare namespace L {
    export interface Handler {
        /**
         * Enables the handler.
         */
        enable(): void;

        /**
         * Disables the handler.
         */
        disable(): void;

        /**
         * Returns true if the handler is enabled.
         */
        enabled(): boolean;

        /**
         * Called when the handler is enabled, should add event hooks.
         */
        addHooks(): void;

        /**
         * Called when the handler is disabled, should remove the event hooks added previously.
         */
        removeHooks(): void;
    }

    export interface HandlerStatic extends ClassStatic {
        new(): Handler;
    }

    export var Handler: HandlerStatic;
}

declare namespace L {
    export interface Projection {
        /**
          * Projects geographical coordinates into a 2D point.
          */
        project(latlng: LatLngExpression): Point;

        /**
          * The inverse of project. Projects a 2D point into geographical location.
          */
        unproject(point: PointExpression): LatLng;

        bounds: LatLngBounds;
    }
}

declare namespace L {
    namespace Projection {
        /**
          * Spherical Mercator projection — the most common projection for online maps,
          * used by almost all free and commercial tile providers. Assumes that Earth
          * is a sphere. Used by the EPSG:3857 CRS.
          */
        export var SphericalMercator: Projection;

        /**
          * Elliptical Mercator projection — more complex than Spherical Mercator.
          * Takes into account that Earth is a geoid, not a perfect sphere. Used by the
          * EPSG:3395 CRS.
          */
        export var Mercator: Projection;

        /**
          * Equirectangular, or Plate Carree projection — the most simple projection,
          * mostly used by GIS enthusiasts. Directly maps x as longitude, and y as latitude.
          * Also suitable for flat worlds, e.g. game maps. Used by the EPSG:3395 and Simple
          * CRS.
          */
        export var LonLat: Projection;
    }
}


declare namespace L {
    namespace CRS {
        /**
          * The most common CRS for online maps, used by almost all free and commercial
          * tile providers. Uses Spherical Mercator projection. Set in by default in
          * Map's crs option.
          */
        export var EPSG3857: CRS;

        /**
          * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
          */
        export var EPSG4326: CRS;

        /**
          * Rarely used by some commercial tile providers. Uses Elliptical Mercator
          * projection.
          */
        export var EPSG3395: CRS;

        /**
          * A simple CRS that maps longitude and latitude into x and y directly. May be
          * used for maps of flat surfaces (e.g. game maps). Note that the y axis should
          * still be inverted (going from bottom to top).
          */
        export var Simple: CRS;
    }
}

declare namespace L {
    export interface CRS {

        /**
          * Standard code name of the CRS passed into WMS services (e.g. 'EPSG:3857').
          */
        code: string;

        /**
         * An array of two numbers defining whether the longitude coordinate axis
         * wraps around a given range and how. Defaults to [-180, 180] in most geographical CRSs.
         */
        wrapLng: number[];

        /**
         * Like wrapLng, but for the latitude axis.
         */
        wrapLat: number[];

        /**
         * If true, the coordinate space will be unbounded (infinite in both axes)
         */
        infinite: boolean;

        /**
          * Projects geographical coordinates on a given zoom into pixel coordinates.
          */
        latLngToPoint(latlng: LatLngExpression, zoom: number): Point;

        /**
          * The inverse of latLngToPoint. Projects pixel coordinates on a given zoom
          * into geographical coordinates.
          */
        pointToLatLng(point: PointExpression, zoom: number): LatLng;

        /**
          * Projects geographical coordinates into coordinates in units accepted
          * for this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
          */
        project(latlng: LatLngExpression): Point;

        /**
          * Given a projected coordinate returns the corresponding LatLng.
          * The inverse of project.
          */
        unproject(point: PointExpression): LatLng;

        /**
          * Returns the scale used when transforming projected coordinates into pixel
          * coordinates for a particular zoom. For example, it returns 256 * 2^zoom for
          * Mercator-based CRS.
          */
        scale(zoom: number): number;

        /**
          * Inverse of scale(), returns the zoom level correspondingto a scale factor of scale.
          */
        zoom(scale: number): number;

        /**
          * Returns the projection's bounds scaled and transformed for the provided zoom.
          */
        getProjectedBounds(zoom: number): Bounds;

        /**
         * Returns a LatLng where lat and lng has been wrapped according to the
         * CRS's wrapLat and wrapLng properties, if they are outside the CRS's bounds.
         */
        wrapLatLng(latlng: LatLngExpression): LatLng;

    }
}

declare namespace L {
    export interface RendererOptions extends LayerOptions {
        /**
         * How much to extend the clip area around the map view (relative to its size)
         * e.g. 0.1 would be 10% of map view in each direction.
         *
         * Default value: 0.1.
         */
        padding?: number;
    }

    export interface RendererStatic extends ClassStatic {
        new(options?: RendererOptions): Renderer;
    }

    export interface Renderer extends Layer {
        options: RendererOptions;
    }

    export var Renderer: RendererStatic;
}

declare namespace L {
    export interface Event {
        /**
          * The event type (e.g. 'click').
          */
        type: string;

        /**
          * The object that fired the event.
          */
        target: any;

        /**
         * The child layer that fired the event if the event is propagated.
         */
        layer: any;
    }
}

declare namespace L {
    export interface MouseEvent extends Event {
        /**
          * The geographical point where the mouse event occured.
          */
        latlng: LatLng;

        /**
          * Pixel coordinates of the point where the mouse event occured relative to
          * the map layer.
          */
        layerPoint: Point;

        /**
          * Pixel coordinates of the point where the mouse event occured relative to
          * the map сontainer.
          */
        containerPoint: Point;

        /**
          * The original DOM mouse event fired by the browser.
          */
        originalEvent: MouseEvent;
    }
}

declare namespace L {
    export interface LocationEvent extends Event {
        /**
          * Detected geographical location of the user.
          */
        latlng: LatLng;

        /**
          * Geographical bounds of the area user is located in (with respect to the accuracy
          * of location).
          */
        bounds: LatLngBounds;

        /**
          * Accuracy of location in meters.
          */
        accuracy: number;

        /**
          * Height of the position above the WGS84 ellipsoid in meters.
          */
        altitude: number;

        /**
          * Accuracy of altitude in meters.
          */
        altitudeAccuracy: number;

        /**
          * The direction of travel in degrees counting clockwise from true North.
          */
        heading: number;

        /**
          * Current velocity in meters per second.
          */
        speed: number;

        /**
          * The time when the position was acquired.
          */
        timestamp: number;
    }
}

declare namespace L {
    export interface ErrorEvent extends Event {
        /**
          * Error message.
          */
        message: string;

        /**
          * Error code (if applicable).
          */
        code: number;
    }
}

declare namespace L {
    export interface LayerEvent extends Event {
        /**
          * The layer that was added or removed.
          */
        layer: Layer;
    }
}

declare namespace L {
    export interface LayersControlEvent extends Event {
        /**
          * The layer that was added or removed.
          */
        layer: Layer;

        /**
          * The name of the layer that was added or removed.
          */
        name: string;
    }
}

declare namespace L {
    export interface TileEvent extends Event {
        /**
          * The tile element (image).
          */
        tile: HTMLElement;

        /**
         * Point object with the tile's x, y, and z (zoom level) coordinates.
         */
        coords: { x: number, y: number, z: number }
    }
}

declare namespace L {
    export interface TileErrorEvent extends Event {
        /**
          * The tile element (image).
          */
        tile: HTMLElement;

        /**
         * Point object with the tile's x, y, and z (zoom level) coordinates.
         */
        coords: { x: number, y: number, z: number }

        /**
         * Error passed to the tile's done() callback.
         */
        error: any;
    }
}

declare namespace L {
    export interface ResizeEvent extends Event {
        /**
          * The old size before resize event.
          */
        oldSize: Point;

        /**
          * The new size after the resize event.
          */
        newSize: Point;
    }
}

declare namespace L {
    export interface PopupEvent extends Event {
        /**
          * The popup that was opened or closed.
          */
        popup: Popup;
    }
}

declare namespace L {
    export interface DragEndEvent extends Event {
        /**
          * The distance in pixels the draggable element was moved by.
          */
        distance: number;
    }
}

declare namespace L {
    export interface ZoomAnimEvent extends Event {
        /**
         * The current center of the map.
         */
        center: LatLng;

        /**
         * The current zoom level of the map.
         */
        zoom: number;

        /**
         * Whether layers should update their contents due to this event.
         */
        noUpdate: boolean;
    }
}

declare namespace L {

    /**
    * A constant that represents the Leaflet version in use.
    */
    export var version: string;

    /**
    * This method restores the L global variale to the original value it had
    * before Leaflet inclusion, and returns the real Leaflet namespace.
    */
    export function noConflict(): typeof L;
}


/**
  * Forces Leaflet to not use touch events even if it detects them.
  */
declare var L_NO_TOUCH: boolean;

/**
  * Forces Leaflet to not use hardware-accelerated CSS 3D transforms for positioning
  * (which may cause glitches in some rare environments) even if they're supported.
  */
declare var L_DISABLE_3D: boolean;

declare module "leaflet" {
	export = L;
}
