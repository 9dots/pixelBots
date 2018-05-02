/**
 * Imports
 */

import { Button, Text } from 'vdux-containers'
import { Block, Modal, ModalHeader, ModalFooter, ModalBody } from 'vdux-ui'
import { stopPropagation, component, element } from 'vdux'
import GridBlock from 'components/GridOptions/GridBlock'
import diffKeys from '@f/diff-keys'
import filter from '@f/filter'

/**
 * <Edit Grid Modal/>
 */

export default component({
  initialState ({ props }) {
    const { painted, paintColor, levelSize } = props

    return {
      painted,
      paintColor,
      levelSize,
      mode: 'paint'
    }
  },
  render ({ props, context, state, actions }) {
    const { ...rest } = props
    return (
      <Modal>
        <ModalBody align='center center'>
          <Block w={350} align='center center' pt='l'>
            <GridBlock
              gridState={{
                mode: state.mode,
                color: state.paintColor,
                painted: state.painted
              }}
              id='modalTarget'
              size='350px'
              mode={state.mode}
              enableMove={false}
              enableSize={props.enableSize || false}
              {...rest}
              setCanvasContext={actions.setCanvasContext}
              enablePaint={true}
              erase={actions.setPainted}
              setSize={actions.setSize}
              setPainted={actions.setPainted}
              setColor={actions.setColor}
              setMode={actions.setMode}
              levelSize={state.levelSize}
              painted={state.painted}
              paintColor={state.paintColor} />
          </Block>
        </ModalBody>
        <ModalFooter bgColor='#666' p='12px' fs='xxs'>
          <Text
            pointer
            mr
            color='grey'
            hoverProps={{ textDecoration: 'underline' }}
            onClick={context.closeModal}>
            CANCEL
          </Text>
          <Button fs='s' px='l' py='s' bgColor='blue' onClick={actions.close}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    )
  },
  onUpdate (prev, { state }) {
    if (state.modalTargetCanvas && prev.state.painted !== state.painted) {
      const newKeys = diffKeys(prev.state.painted, state.painted)
      newKeys.forEach(key => {
        const [y, x] = key.split(',').map(Number)
        const place = x + state.levelSize[0] * y
        state.modalTargetCanvas.updateShapeColor(
          place,
          state.painted[key] || 'white'
        )
      })
    }
  },
  controller: {
    * close ({ props, state, actions, context }) {
      yield props.setTargetPainted(state.painted)
      yield [
        props.reset(),
        props.setLevelSize(state.levelSize),
        actions.submit(),
        context.closeModal()
      ]
    },
    * submit ({ props, state, context }) {
      const { saveRef } = props
      const { levelSize } = state
      yield context.firebaseUpdate(`/saved/${saveRef}`, {
        levelSize,
        animals: props.animals.map(a => ({
          ...a,
          current: { ...a.current, location: [levelSize[0] - 1, 0] },
          initial: { ...a.initial, location: [levelSize[0] - 1, 0] }
        }))
      })
    }
  },
  reducer: {
    setSize: (state, size) => ({
      levelSize: [size, size],
      painted: filter(
        (val, key) => key.split(',').every(v => v <= size - 1),
        state.painted
      )
    }),
    setMode: (state, grid, mode) => ({ mode }),
    setColor: (state, grid, paintColor) => ({ paintColor }),
    setCanvasContext: (state, canvas, name) => ({ [`${name}Canvas`]: canvas }),
    setPainted: (state, grid, paint) => ({
      painted: {
        ...state.painted,
        [paint]: state.mode === 'erase' ? 'white' : state.paintColor
      }
    })
  }
})
