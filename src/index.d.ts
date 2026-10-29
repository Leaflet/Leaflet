// The types entry: JSDoc typedefs don't pass through the barrels' named re-exports, so types.d.ts is re-exported here.
import type {Projection as ProjectionNamespace} from './Leaflet.js';
import type {Projection as ProjectionInterface} from './types.js';

export * from './Leaflet.js';
export type * from './types.js';

// `Projection` is both the namespace of built-in projections and their interface, like in `@types/leaflet`. The two
// `export *` would make it ambiguous, so the merged name is spelled out here.
export declare const Projection: typeof ProjectionNamespace;
export type Projection = ProjectionInterface;
