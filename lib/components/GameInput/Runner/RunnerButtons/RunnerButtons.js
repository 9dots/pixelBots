/**
 * Imports
 */

import {abortRun, completeProject} from 'pages/Game/middleware/codeRunMiddleware'
import ConfirmDelete from 'components/ConfirmDelete'
import LinkModal from 'components/LinkModal'
import RunnerButton from '../RunnerButton'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <Runner Buttons/>
 */

export default component({
  render ({props, actions, context}) {
  	const {inputType, gameActions, canAutoComplete, saveRef} = props

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
    	<Block h='80%' align='center center'>
	    	<RunnerButton
	    		icon='delete_forever'
	    		text='Start Over'
	    		bgColor='#666'
	    		clickHandler={context.openModal(() => deleteModal)} />
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
  		console.log(initialData)
  		yield abortRun('STOP')
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