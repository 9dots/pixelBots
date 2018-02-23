/**
 * Imports
 */

import PixelGradient from 'components/PixelGradient'
import { component, element } from 'vdux'
import { Block } from 'vdux-ui'
import Two from 'two.js'

/**
 * <TwoCanvas/>
 */

export default component({
  initialState: {
    canvasId: null,
    two: null,
    appended: false
  },
  * onCreate ({ props, state, actions }) {
    if (!state.canvasId) {
      if (props.id) {
        return yield actions.setCanvasId(props.id)
      } else {
        for (;;) {
          let canvasId = `twojs-container-${Math.random()
            .toString(32)
            .substr(2, 8)}`
          if (document.getElementById(canvasId)) {
            continue
          }
          return yield actions.setCanvasId(canvasId)
        }
      }
    }
  },
  * afterRender ({ props, state, actions }) {
    const { appended, canvasId } = state
    const { twoProps = {}, draw } = props
    if (!appended && canvasId && !state.two) {
      const parent = document.getElementById(canvasId)
      const two = new Two({
        // type: Two.Types['svg'],
        width: parent.clientWidth,
        height: parent.clientHeight,
        autostart: true,
        ...twoProps
      })
      yield actions.setTwo(two)
      two.appendTo(parent)
      yield actions.setAppended()
      draw(two)
    }
  },
  render ({ props, state, actions }) {
    const { w = '100%', h = '100%', colors } = props
    const { canvasId } = state

    return (
      <PixelGradient
        p={0}
        mb={0}
        w={w}
        h={h}
        colors={colors}
        angle={180}
        id={canvasId} />
    )
  },
  reducer: {
    setCanvasId: (state, canvasId) => ({ canvasId }),
    setTwo: (state, two) => ({ two }),
    setAppended: state => ({ appended: true })
  }
})
