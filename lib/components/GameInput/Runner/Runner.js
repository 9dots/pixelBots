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
	    saved,
	    loc,
	    ...restProps
	  } = props

	  const isSelected = selected.length > 0
	  const btnProps = {bgColor: 'white', color: '#666'}

	  const selectable = inputType === 'icons' && sequence.filter(b => b.type !== 'repeat_end')

	  return (
	    <Block
	      border='1px solid rgba(white, .2)'
	      borderColor={isSelected ? 'rgba(black, .1)' : 'rgba(white, .2)'}
	      boxShadow={isSelected ? '0 6px 8px -3px rgba(0,0,0,.28)' : '0 0'}
	      align='end center'
	      zIndex='999'
	      bottom='0'
	      py='5px'
	      wide
	      {...restProps}
	      bgColor={isSelected ? '#666' : props.bgColor}
	      >
	      <Block flex  pl='s'>
	      	<Block align='start center' hide={inputType !== 'icons'} >
		      	{
	      			isSelected
	    		      ? <RunnerButton color='white' text='Clear Selection' mr={4} ml={2} clickHandler={invertSelection} icon='clear' />
		      			: <RunnerButton color='white' text='Select All' mr={4} ml={2} clickHandler={invertSelection} disabled={!selectable.length} icon='done_all' />
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
		            disabled={true}
	           		{...btnProps}
		            clickHandler={function() {}} />
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
	      	{ 
	      		isSelected
	        		? selected.length + ' selected'
	      			: loc + pluralize(' line', loc)
      		}
	        
	      </Block>
	      <Block flex align='end center'>
		      <Block pl='1em' fs='s' mr fontWeight='800'>
		        {saved ? 'saved' : ''}
		      </Block>
		      <RunnerButtons
		      	hide={isSelected}
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
