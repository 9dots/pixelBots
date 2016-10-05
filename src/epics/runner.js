import { startRun, stopRun, setActiveLine } from '../actions'
import {scrollTo} from '../middleware/scroll'
import * as animalApis from '../animalApis'
import { Observable } from 'rxjs'

const highlighter = (lineNum) => Observable.of(setActiveLine(lineNum))
const createDelay = (delay = 750) => Observable.empty().delay(delay)
const addScroll = (lineNum) => Observable.of(
  scrollTo('.code-editor', `#code-icon-${lineNum}`)
)
const getTimeout = (animals, id) => id
  ? animalApis[animals[id].type](id).speed
  : undefined

export default function runner (action$, store) {
  return action$.ofType(startRun.type)
    .map((action) => Observable.from(action.payload))
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
