import { startRun, stopRun, setActiveLine } from '../actions'
import {scrollTo} from '../middleware/scroll'
import animalApis from '../animalApis'
import { Observable } from 'rxjs'

const highlighter = (lineNum) => Observable.of(setActiveLine(lineNum))
const createDelay = (delay = 750) => Observable.empty().delay(delay)
const addScroll = (lineNum) => Observable.of(
  scrollTo('.code-editor', `#code-icon-${lineNum}`)
)

console.log(animalApis)
const getTimeout = (animals, id) => {
  console.log(animalApis[animals[id].type].speed)
  return id
    ? animalApis[animals[id].type].speed
    : undefined
}
export default function runner (action$, store) {
  return action$.ofType(startRun.type)
    .map((action) =>
      Observable.from(action.payload).delay(800)
    )
    .switchMap((obs) =>
      obs.map((x) => {
        const addDelay = Observable
          .of(x)
          .concat(
            createDelay(getTimeout(store.getState().game.animals, x.payload.id)
          ))
        return x.meta
          ? addDelay
            .merge(highlighter(x.meta.lineNum))
            .merge(addScroll(x.meta.lineNum))
          : addDelay
      })
         .concatAll()
         .takeUntil(action$.ofType(stopRun.type))
    )
}
