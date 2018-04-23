/**
 * Imports
 */

import { component, element } from 'vdux'
import Canvas from 'components/Canvas'
import diffKeys from '@f/diff-keys'
import sleep from '@f/sleep'
import mw, {
  terminateCodeWorker,
  initCodeWorker,
  startCodeRun
} from 'middleware/codeRunMiddleware'

// import { CSSContainer, wrap } from 'vdux-containers'
// import mapValues from '@f/map-values'
// import { images } from 'animalApis'

/**
 * <PreviewCanvas/>
 */

export default component({
  initialState ({ props }) {
    return props
  },
  * onCreate ({ props, actions }) {
    const initialData = props.initialData || props
    yield initCodeWorker({
      state: {
        ...initialData,
        animals: props.animals.map(a => ({
          ...a,
          current: a.initial,
          hidden: true
        })),
        speed: props.speed
      },
      updateAction: actions.handleUpdate
    })
    yield sleep(500)
    yield startCodeRun()
  },
  render ({ props, state, actions, context }) {
    const {
      userAnimal,
      levelSize,
      palette,
      animals,
      invalid,
      running,
      painted,
      hasRun,
      active,
      speed,
      size,
      type,
      h = 600,
      w = 600
    } = state
    return (
      <Canvas
        id='preview'
        type={type}
        mode='read'
        opacity={1}
        name='preview'
        userAnimal={userAnimal}
        animals={animals.map(a => ({ ...a, hidden: true }))}
        hasRun={hasRun}
        running={running}
        palette={palette}
        invalid={invalid}
        active={active}
        setCanvasContext={actions.setCanvasContext}
        painted={painted}
        h={h}
        w={w}
        hideGrid
        speed={speed}
        levelSize={size}
        numRows={levelSize[0]}
        numColumns={levelSize[1]}
        canvasColor='transparent' />
    )
  },
  middleware: [mw],
  onUpdate (prev, { state }) {
    if (state.previewCanvas && prev.state.painted !== state.painted) {
      const newKeys = diffKeys(prev.state.painted || {}, state.painted)
      newKeys.forEach(key => {
        const [y, x] = key.split(',').map(Number)
        const place = x + state.levelSize[0] * y
        state.previewCanvas.updateShapeColor(
          place,
          state.painted[key] || 'white'
        )
      })
    }
  },
  onRemove () {
    return terminateCodeWorker()
  },
  controller: {
    * handleUpdate ({ actions }, { data: { payload, type } }) {
      if (type === 'newState') {
        yield actions.setFrame(payload)
      }
    }
  },
  reducer: {
    setCanvasContext: (state, canvas, name) => ({ [`${name}Canvas`]: canvas }),
    setFrame: (state, frame) => ({ ...frame })
  }
})

// const Bot = wrap(CSSContainer, {
//   hoverProps: { hovering: true }
// })(
//   component({
//     render ({ props, context, actions }) {
//       const { src, hovering } = props

//       return (
//         <Block
//           opacity={hovering ? 0.5 : 1}
//           transition='all .25s'
//           pointer
//           onClick={[actions.setBot, context.closeModal]}>
//           <Image display='block' sq={110} m='s' src={src} />
//         </Block>
//       )
//     },
//     controller: {
//       * setBot ({ context, props }) {
//         yield context.firebaseSet(`/users/${context.uid}/photoURL/`, props.src)
//         yield context.firebaseSet(`/users/${context.uid}/bot/`, props.bot)
//       }
//     }
//   })
// )

/**
 * Helpers
 */

// const blackList = ['teacherBot']

// function filterUrl (url) {
//   return !blackList.some(function (str) {
//     return url.indexOf(str) !== -1
//   })
// }
