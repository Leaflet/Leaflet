// Public types that JSDoc can't express. Options and event maps are interfaces rather than JSDoc typedefs (type
// aliases), since only interfaces merge with a plugin's `declare module 'leaflet'` augmentation.

/** The type of a class's `static defaultOptions`: some of its options, plus anything a subclass adds. */
export type Defaults<O> = Partial<O> & {[key: string]: unknown};
