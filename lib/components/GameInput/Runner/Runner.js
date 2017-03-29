/**
 * Imports
 */

import {Block, Icon, Text} from 'vdux-containers'
import RunnerButtons from './RunnerButtons'
import {component, element} from 'vdux'

const pluralize = (noun, num) => num === 0 || num > 1 ? `${noun}s` : noun

/**
 * <Runner/>
 */

export default component({
  render ({props, context, actions}) {
	  const {
	    canAutoComplete,
	    gameActions,
	    initialData,
	    saveRef = '',
	    inputType,
	    selected,
	    removeSelected,
	    saved,
	    loc,
	    ...restProps
	  } = props

	  return (
	    <Block
	      borderBottom='1px solid rgba(255, 255, 255, 0.2)'
	      transition='all .3s ease-in-out'
	      align='end center'
	      bgColor={props.bgColor}
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
	      <RunnerButtons
	      	selected={selected}
	      	removeSelected={removeSelected}
	      	initialData={initialData}
	      	inputType={inputType}
	      	gameActions={gameActions}
	      	canAutoComplete={canAutoComplete}
	      	saveRef={saveRef} />
	    </Block>
	  )
  }
})
