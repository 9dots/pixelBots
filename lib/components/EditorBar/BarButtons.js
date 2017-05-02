/**
 * Imports
 */

import {completeProject} from 'pages/Game/middleware/codeRunMiddleware'
import ConfirmDelete from 'components/ConfirmDelete'
import {component, element} from 'vdux'
import BarButton from './BarButton'
import {Block} from 'vdux-ui'

/**
 * <BarButtons/>
 */

export default component({
  render ({props, actions, context}) {
    const {inputType, startOver, canAutoComplete, saveRef, ...rest} = props

    const deleteModal = <ConfirmDelete
      header='Start Over?'
      message='start over? All of your code will be deleted.'
      dismiss={context.closeModal}
      action={startOver} />

    const completeModal = <ConfirmDelete
      header='Complete Project?'
      message='submit this project as completed?'
      dismiss={context.closeModal()}
      action={completeProject} />

    return (
      <Block h='80%' align='end stretch' {...rest}>
        <BarButton
          text='Start Over'
          bgColor='#666'
          px
          onClick={context.openModal(() => deleteModal)}>
          Reset
        </BarButton>
        {
          inputType === 'code' && <BarButton
            icon='print'
            text='Print'
            bgColor='#666'
            onClick={actions.print} />
        }
        {
          (!canAutoComplete && saveRef) && <BarButton
            icon='check'
            text='Completed'
            bgColor='green'
            onClick={context.openModal(() => completeModal)} />
        }
      </Block>
    )
  },
  controller: {
    * print () {
      yield window.print()
    }
  }
})
