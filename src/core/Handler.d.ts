import { Class } from './Class';
import { Map } from "../map/Map";


export abstract class Handler extends Class {
    static addTo(map: Map, name: string): typeof this;

    constructor(map: Map);
    enable(): this;
    disable(): this;
    enabled(): boolean;

    // Extension methods
    abstract addHooks(): void;
    abstract removeHooks(): void;
}
