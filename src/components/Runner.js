/** @jsx element */

import element from 'vdux/element'
import ConfirmDelete from '../components/ConfirmDelete'
import LinkModal from '../components/LinkModal'
import {Block, Icon} from 'vdux-containers'
import Button from './Button'
import {abortRun} from '../middleware/codeRunner'
import {initializeGame, clearMessage, setModalMessage} from '../actions'

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
    <Icon fs='m' name={icon}/>
  </Button>
}

function render ({props}) {
  const {creatorMode, initialData, saveID=''} = props

  const deleteModal = <ConfirmDelete
    header='Start Over?'
    message='start over? All of your code will be deleted.'
    dismiss={clearMessage}
    action={startOver}/>

  const saveModal = <LinkModal code={saveID}/>

  const playButtons = (
    <Block h='80%' align='center center' mr='1em'>
      {createButton('delete_forever', 'Start Over', '#666', () => setModalMessage(deleteModal))}
      {saveID && createButton('save', 'Save', '#2C4770', () => setModalMessage(saveModal))}
    </Block>
  )
  return (
    <Block {...props} align='start center' hoverProps={{highlight: true}} transition='all .3s ease-in-out'>
      {
        creatorMode
          ? <Block wide tall/>
          : playButtons
      }
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
