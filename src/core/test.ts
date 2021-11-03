import { Evented, LeafletEvent } from "./Events";

interface X extends LeafletEvent {
  myProp: number
}

const e = new Evented<{
  'test': X
}>()

e.on('test', (ev) => {
  // Is number
  ev.myProp.toExponential()
})

e.on('example of a non existing event type', (e)=>{
  // This also works!
})