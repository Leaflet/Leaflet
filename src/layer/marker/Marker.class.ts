import { Marker as MarkerInternal } from './Marker'

function leafletExtends() {
  /**
   * 1. copy parent class's static
   * 2. append options to options chain
   * 3. set callInitHooks function
   * 4. 
   */
  return (target) => {
    console.log(target)
  }
}

@leafletExtends()
export class Marker extends MarkerInternal {
  includes = []
  options = []
}