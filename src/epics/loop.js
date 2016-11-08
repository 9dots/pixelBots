import { startRun, stopRun, setActiveLine } from '../actions'
import {loopAction} from '../animalApis/loop'
import {scrollTo} from '../middleware/scroll'
import isGenerator from '@f/is-generator'
import animalApis from '../animalApis'
import { Observable } from 'rxjs'

const highlighter = (lineNum) => Observable.of(setActiveLine(lineNum))
const createDelay = (delay = 750) => Observable.empty().delay(delay)
const addScroll = (lineNum) => Observable.of(
  scrollTo('.code-editor', `#code-icon-${lineNum}`)
)

const getTimeout = (animals, id) => {
  return id
    ? animalApis[animals[id].type].speed
    : undefined
}

export default function runner (action$, store) {
  return action$.filter((action) => action.type === loopAction.type)
    .map((action) => 
      Observable.from(action.payload)
    )
    .switchMap((obs) => mapObserver(obs, store)
      .concatAll()
      .takeUntil(action$.ofType(stopRun.type))
    )
}

function mapObserver (obs, store) {
  return obs.map((x) => {
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
}
