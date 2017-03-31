/**
 * Imports
 */

import {Block, Icon} from 'vdux-containers'
import RunnerButtons from './RunnerButtons'
import RunnerButton from './RunnerButton'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
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
	    selected,
	    sequence,
	    saved,
	    loc,
	    ...restProps
	  } = props

	  const isSelected = selected.length > 0
	  const btnProps = {bgColor: '#666'}

	  return (
	    <Block
	      border='1px solid rgba(white, .2)'
	      transition='background-color .2s'
	      align='end center'
	      zIndex='999'
	      bottom='0'
	      py='5px'
	      wide
	      {...restProps}
	      bgColor={isSelected ? '#c2ccde' : props.bgColor}
	      >
	      <Block flex align='start center' pl='s'>
	      	{
	      		selected.length
    		      ?	<Checkbox
    		      		checkProps={{sq: 25, fs: 's'}}
    		      		checked={selected.length && selected.length === sequence.length}
    		      		indeterminate={selected.length && selected.length !== sequence.length}
    		      		onChange={invertSelection} />
	      			: <Button onClick={invertSelection}>
    		      		<Icon fs='s' color='white' name='done_all' />
    		      	</Button>
		      }
	      	{
          	isSelected &&
	          	<Block align='start stretch'>
		           	<RunnerButton
			            icon='content_copy'
			            text='Copy'
		           		{...btnProps}
			            clickHandler={function(){}} />
		          	<RunnerButton
			            icon='content_cut'
			            text='Copy'
			            {...btnProps}
			            clickHandler={function(){}} />
			          <RunnerButton
			            icon='content_paste'
			            text='Paste'
			            {...btnProps}
			            clickHandler={function(){}} />
		          	<RunnerButton
			            icon='delete'
			            text='Remove Blocks'
			            {...btnProps}
			            clickHandler={removeSelected} />
	            </Block>
        	}
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
