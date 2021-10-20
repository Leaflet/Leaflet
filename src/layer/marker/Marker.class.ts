import * as Util from '../../core/Util'
import { Marker as MarkerInternal } from './Marker'

function leafletExtends() {
  /**
   * 1. copy parent class's static
   * 2. append options to options chain
   * 3. set callInitHooks function
   * 4. 
   */
  return (target) => {
    const _options = target.options;
    const proto = target.prototype
    const chain = Util.extend(Util.create(proto.options), _options);
    Util.extend(proto, chain)
    proto.options = chain;
  }
}

@leafletExtends()
export class Marker extends MarkerInternal {
  static options = {
    draggable: true
  }

  constructor(latlng, options) {
    super(latlng, options)
  }

  onAdd(map) {
    console.log('added')
    super.onAdd(map);
  }
}

export function marker(latlng, options) {
  return new Marker(latlng, options);
}