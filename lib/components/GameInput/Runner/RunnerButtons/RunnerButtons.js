/**
 * Imports
 */

import {abortRun, completeProject} from 'pages/Game/middleware/codeRunMiddleware'
import ConfirmDelete from 'components/ConfirmDelete'
import LinkModal from 'components/LinkModal'
import RunnerButton from '../RunnerButton'
import {Block} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * <Runner Buttons/>
 */

export default component({
  render ({props, actions, context}) {
  	const {inputType, gameActions, removeSelected, canAutoComplete, saveRef, ...rest} = props

  	const deleteModal = <ConfirmDelete
	    header='Start Over?'
	    message='start over? All of your code will be deleted.'
	    dismiss={context.closeModal()}
	    action={actions.startOver()} />

	  const completeModal = <ConfirmDelete
	    header='Complete Project?'
	    message='submit this project as completed?'
	    dismiss={context.closeModal()}
	    action={completeProject} />

    return (
    	<Block h='80%' align='end stretch' {...rest} >
	    	<RunnerButton
	    		text='Start Over'
	    		bgColor='#666'
	    		px
	    		clickHandler={context.openModal(() => deleteModal)}>
	    		Reset
    		</RunnerButton>
	    	{
	    		inputType === 'code' && <RunnerButton
	    		  icon='print'
	    		  text='Print'
	    		  bgColor='#666'
	    		  clickHandler={actions.print()} />
	    	}
	      {
	      	(!canAutoComplete && saveRef) && <RunnerButton
	      		icon='check'
	      		text='Completed'
	      		bgColor='green'
	      		clickHandler={context.openModal(() => completeModal)} />
	      }
	    </Block>
    )
  },
  controller: {
  	* openModal ({context}, modal) {
  		return function * () {
  			yield context.openModal(() => modal)
  		}
  	},
  	* print () {
  		yield window.print()
  	},
  	* startOver ({props}) {
  		const {gameActions, initialData} = props
  		yield gameActions.reset()
  		console.log(initialData)
  		yield gameActions.gameDidInitialize({
  			...initialData,
	      animals: initialData.animals.map((animal) => ({
	        ...animal,
	        sequence: []
	      }))
  		})
  	}
  }
})
