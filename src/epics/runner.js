import { Observable } from 'rxjs'
import { startRun, stopRun } from '../actions'

const delay = Observable.empty().delay(500)

export default function runner (action$) {
  return action$.ofType(startRun.type)
    .map((action) => {
      console.log(action)
      return Observable.from(action.payload)
    })
    .switchMap((obs) =>
      obs
        .map((x) => {
          console.log(x)
          Observable.of(x).concat(delay)
        })
        .concatAll()
        .takeUntil(action$.ofType(stopRun.type))
    )
}
