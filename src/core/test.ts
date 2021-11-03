import { Evented, LeafletEvent } from "./Events";

interface X extends LeafletEvent {
  myProp: number
}

const e = new Evented<{
  'test': X
}>()

e.on('test', (ev) => {
  ev.myProp
})

e.on('jfdsksdfsldf', (e)=>{
  
})