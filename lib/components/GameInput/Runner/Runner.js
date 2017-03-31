/**
 * Imports
 */

import {Block, Icon} from 'vdux-containers'
import RunnerButtons from './RunnerButtons'
import RunnerButton from './RunnerButton'
import {component, element} from 'vdux'

const pluralize = (noun, num) => num === 0 || num > 1 ? `${noun}s` : noun

/**
 * <Runner/>
 */

export default component({
  render ({props, context, actions}) {
	  const {
	    canAutoComplete,
	    removeSelected,
	    saveRef = '',
	    gameActions,
	    initialData,
	    inputType,
	    selected,
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
	      <Block flex>
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
			            clickHandler={function(){}} />
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
		      	canAutoComplete={canAutoComplete}
		      	saveRef={saveRef}/>
    		</Block>
	    </Block>
	  )
  }
})
