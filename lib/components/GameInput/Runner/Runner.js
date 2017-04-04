/**
 * Imports
 */

import {Button, Tooltip} from 'vdux-containers'
import {Block, Icon} from 'vdux-containers'
import RunnerButtons from './RunnerButtons'
import RunnerButton from './RunnerButton'
import {component, element} from 'vdux'
import {Checkbox} from 'vdux-ui'

const pluralize = (noun, num) => num === 0 || num > 1 ? `${noun}s` : noun

/**
 * <Runner/>
 */

export default component({
  render ({props, context, actions}) {
	  const {
	    canAutoComplete,
	    invertSelection,
	    removeSelected,
	    saveRef = '',
	    gameActions,
	    initialData,
	    inputType,
	    clipboard,
	    selected,
	    sequence,
	    canUndo,
	    saved,
	    loc,
	    ...restProps
	  } = props

	  const isSelected = selected.length > 0
	  const btnProps = {bgColor: '#666'}

	  const selectable = inputType === 'icons' && sequence.filter(b => b.type !== 'repeat_end')

	  return (
	    <Block
	      border='1px solid'
	      borderColor={isSelected ? 'divider' : 'rgba(white, .2)'}
	      // transition='background-color .2s'
	      align='end center'
	      zIndex='999'
	      bottom='0'
	      py='5px'
	      wide
	      {...restProps}
	      bgColor={isSelected ? '#FFF' : props.bgColor}
	      >
	      <Block flex  pl='s'>
	      	<Block align='start center' hide={inputType !== 'icons'} >
		      	{
	      			isSelected
	    		      ?	<Tooltip message='Clear Selection'>
			      				<Button {...btnProps} bgColor='white' mr={4} onClick={invertSelection}>
		    		      		<Icon fs='s' color={btnProps.bgColor} name='clear' />
		    		      	</Button>
	    		      	</Tooltip>
		      			: <Tooltip message='Select All'>
			      				<Button {...btnProps} disabled={!selectable.length} mr={4} onClick={invertSelection}>
		    		      		<Icon fs='s' color='white' name='done_all' />
		    		      	</Button>
	    		      	</Tooltip>
			      }
	        	<Block align='start stretch'>
	           	<RunnerButton
		            icon='content_copy'
		            text='Copy'
		            disabled={!isSelected}
	           		{...btnProps}
		            clickHandler={gameActions.copySelection} />
	          	<RunnerButton
		            disabled={!isSelected}
		            icon='content_cut'
		            text='Cut'
		            {...btnProps}
		            clickHandler={gameActions.cutSelection} />
		          <RunnerButton
		          	disabled={!clipboard || !clipboard.length}
		            icon='content_paste'
		            text='Paste'
		            {...btnProps}
		            clickHandler={gameActions.paste} />
	            <RunnerButton
		            icon='undo'
		            text='Undo'
		            disabled={!canUndo}
	           		{...btnProps}
		            clickHandler={gameActions.undo} />
	          	<RunnerButton
	          		disabled={!isSelected}
		            icon='delete'
		            text='Delete'
		            {...btnProps}
		            clickHandler={removeSelected} />
	          </Block>
          </Block>
	      </Block>
	      <Block fs='s' fontWeight='800' flex textAlign='center'>
	        {loc} {pluralize('line', loc)}
	      </Block>
	      <Block flex align='end center'>
		      <Block pl='1em' fs='s' mr fontWeight='800'>
		        {saved ? 'saved' : ''}
		      </Block>
		      <RunnerButtons
		      	selected={selected}
		      	removeSelected={removeSelected}
		      	initialData={initialData}
		      	inputType={inputType}
		      	gameActions={gameActions}
		      	invertSelection={invertSelection}
		      	sequence={sequence}
		      	canAutoComplete={canAutoComplete}
		      	saveRef={saveRef} />
    		</Block>
	    </Block>
	  )
  }
})
