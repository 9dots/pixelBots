/** @jsx element */

import {initializeGame, clearMessage, setModalMessage} from '../actions'
import {completeProject} from '../middleware/checkCompleted'
import ConfirmDelete from '../components/ConfirmDelete'
import {abortRun} from '../middleware/codeRunner'
import {Block, Icon, Text} from 'vdux-containers'
import LinkModal from '../components/LinkModal'
import element from 'vdux/element'
import Button from './Button'

const pluralize = (noun, num) => num === 0 || num > 1 ? `${noun}s` : noun

function createButton (icon, text, bgColor, clickHandler) {
  return <Button
    tall
    flex
    bgColor={bgColor}
    p='4px'
    wide
    mx='4px'
    fs='s'
    color='white'
    align='center center'
    onClick={clickHandler}>
    <Icon fs='m' name={icon} />
  </Button>
}

function render ({props, state, local}) {
  const {
    canAutoComplete,
    initialData,
    saveID = '',
    inputType,
    saved,
    loc,
    ...restProps
  } = props

  const deleteModal = <ConfirmDelete
    header='Start Over?'
    message='start over? All of your code will be deleted.'
    dismiss={clearMessage}
    action={startOver} />

  const completeModal = <ConfirmDelete
    header='Complete Project?'
    message='submit this project as completed?'
    dismiss={clearMessage}
    action={completeProject} />

  const saveModal = <LinkModal code={saveID} />

  const playButtons = (
    <Block h='80%' align='center center'>
      {createButton('delete_forever', 'Start Over', '#666', () => setModalMessage(deleteModal))}
      {inputType === 'code' && createButton('print', 'Print', '#666', () => window.print())}
      {saveID && createButton('save', 'Save', '#2C4770', () => setModalMessage(saveModal))}
      {(!canAutoComplete && saveID) && createButton('check', 'Completed', 'green', () => setModalMessage(completeModal))}
    </Block>
  )
  return (
    <Block
      transition='all .3s ease-in-out'
      align='end center'
      bgColor={props.bgColor}
      border='1px solid rgba(255, 255, 255, 0.2)'
      borderBottomWidth='0'
      zIndex='999'
      bottom='0'
      py='5px'
      wide
      {...restProps}>
      <Block flex pl='1em'>
        <Text color='white' fs='s' fontWeight='800'>{saved ? 'saved' : ''}</Text>
      </Block>
      <Block flex>
        <Text color='white' fs='s' fontWeight='800'>{loc} {pluralize('line', loc)}</Text>
      </Block>
      {playButtons}
    </Block>
  )

  function * startOver () {
    yield abortRun('STOP')
    yield initializeGame({
      ...initialData,
      animals: initialData.animals.map((animal) => ({
        ...animal,
        sequence: []
      }))
    })
  }
}

export default {
  render
}
