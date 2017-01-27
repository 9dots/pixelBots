/** @jsx element */

import PrintContainer from '../pages/PrintContainer'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {Block} from 'vdux-containers'
import element from 'vdux/element'
import Buttons from './Buttons'
import {getLoc} from '../utils'
import CodeBox from './CodeBox'
import Runner from './Runner'
import Code from './Code'

const addLoop = createAction('ADD_LOOP: controls')
const loopAdded = createAction('LOOP_ADDED: controls')

function initialState ({local}) {
  return {
    tab: 'code',
    waitingForLoop: false,
    actions: {
      startAddLoop: local(() => addLoop()),
      finishAddLoop: local(() => loopAdded())
    }
  }
}

function render ({props, state}) {
  const {
    editorActions,
    selectedLine,
    inputType,
    minHeight = '600px',
    running,
    animals,
    canCode,
    active,
    saved
  } = props
  const sequence = animals[active].sequence || []
  const {actions, waitingForLoop} = state
  const {startAddLoop, finishAddLoop} = actions

  const loc = getLoc(sequence)

  return (
    <Block
      minHeight={minHeight}
      column
      tall
      relative
      w={props.w || '100%'}
      color='white'>
      <Block flex tall wide align='start start'>
        {
          inputType === 'icons'
            ? <Block wide tall align='center center'>
              {addButtons()}
              <Code canCode={canCode} waitingForLoop={waitingForLoop} finishAddLoop={finishAddLoop} {...props} />
            </Block>
            : <Block wide tall align='center center'>
              {addButtons()}
              <PrintContainer code={sequence} />
              <CodeBox canCode={canCode} startCode={props.initialData && props.initialData.startCode} {...props} />
            </Block>
        }
      </Block>
      {<Runner
        bgColor={inputType === 'icons' ? '#A7B4CB' : '#1D1F21'}
        initialData={props.initialData}
        saveID={props.saveID}
        saved={props.saveID && saved}
        loc={loc}
        creatorMode
        inputType={inputType}/>}
    </Block>
  )

  function addButtons () {
    return (
      <Buttons
        startAddLoop={startAddLoop}
        selectedLine={selectedLine}
        running={running}
        canCode={canCode}
        active={active}
        type={animals[active].type}
        editorActions={editorActions}
        inputType={inputType} />
    )
  }
}

const reducer = handleActions({
  [addLoop.type]: (state) => ({...state, waitingForLoop: true}),
  [loopAdded.type]: (state) => ({...state, waitingForLoop: false})
})

export default {
  initialState,
  reducer,
  render
}
