import {createFrames} from 'utils/frameReducer'
import {Canvas, Image} from 'canvas-webworker'
import e2d from 'e2d'

self.addEventListener('message', ({data}) => {

  console.log(data)
  // var s = context.toDataUrl()
  // console.log(context)
})
