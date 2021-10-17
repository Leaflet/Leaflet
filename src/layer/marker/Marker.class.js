import { Util } from '../../core/index';
import { Marker as MarkerInternal } from './Marker'

/**
 * Old Class.extend steps:
 * 
 * - create a constructor function named `NewClass`.
 * - get the prototype of what being extended.
 * - create a new prototype named `proto` based on this prototype.
 * - set constructor property to NewClass
 * - set NewClass's prototype to `proto`
 * - set static propeties of NewClass coping from this.
 * - & from props (class)
 * - concat includes on props (class) to `proto`
 * - rewrite `props.options` by merging `proto.options` and `props.options`
 * - set all properties on `props` to `proto`
 * - init hooks.
 * - create callInitHooks function on `proto`
 */

// @options({})
export class Marker extends MarkerInternal {
  constructor(latlng, options) {
    super(latlng, { ...options });
  }

  onAdd(map) {
    console.log('added')
    super.onAdd(map);
  }
}

function options(_options) {
  return (target) => {
    proto = target.prototype
    const chain = Util.extend(Util.create(proto.options), _options);
    // Util.extend(proto, chain)
    proto.options = chain;
  }
}

export function marker(latlng, options) {
  return new Marker(latlng, options);
}