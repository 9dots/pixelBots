/**
 * Imports
 */

import GridSizeSelector from 'components/GridSizeSelector'
import ColorPicker from 'components/ColorPicker'
import EraseButton from 'components/EraseButton'
import filterPaint from 'utils/filterPaint'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import Grid from 'components/Grid'
import filter from '@f/filter'
import {Block} from 'vdux-ui'

/**
 * <Grid Options/>
 */

export default component({
	initialState ({props}) {
		return {
			painted: props.targetPainted,
			eraseMode: false,
			color: 'black'
		}
	},
  render ({props, state, actions}) {
  	const {type, animals, levelSize, ...restProps} = props
  	const {painted, eraseMode} = state
  	const btnProps = {
  		bgColor: '#FAFAFA', 
  		border: '1px solid #CACACA', 
  		sq: 40,
  		color: 'black'
  	}

    return (
    	<Block column align='start center' wide>
    		<Block mb textAlign='center'>
    			<Block fs='m'color='blue'>Paint your Target Grid</Block>
    			<Block fs='xs' my>
    				Students will use code to recreate the grid below.
    			</Block>
    		</Block>
    		<Block pb='xl'>
    			<Block bgColor='white' p='1em' border='1px solid divider' borderBottomWidth={0}>
    				<Block align='start center'>
	          	<ColorPicker
	              zIndex='999'
	              active={!eraseMode}
	              animalType={animals[0].type}
	              dropdownHandler={actions.setColor}
	              clickHandler={actions.setEraseMode(false)}
	              paintColor={state.color}
	              {...btnProps} />
	            <EraseButton
	            	{...btnProps}
	            	active={eraseMode}
	            	clickHandler={actions.setEraseMode(true)}/>
	            <Block flex />
	            <GridSizeSelector setSize={actions.setSize} size={levelSize[0]} {...btnProps} />
          	</Block>
          </Block>
		    	<Grid
		    		{...restProps}
		    		clickHandler={eraseMode ? actions.erase : actions.setPainted}
		      	mode='edit'
		        paintMode
		        animals={[]}
		        painted={painted}
		        levelSize='400px'
		        numRows={props.levelSize[0]}
		        numColumns={props.levelSize[1]}
		        />
        </Block>
      </Block>
    )
  },
  * onRemove ({actions, props, context, state}) {
  	yield props.save({targetPainted: filterPaint(state.painted) || null})
  },
  controller: {
  	* setSize ({props, state, context, actions}, size) {
  		yield context.firebaseUpdate(props.ref, {
  			levelSize: [size, size]
  		})
  		yield actions.setBulkPainted(filter((val, key) => key.split(',').every((v) => v <= size - 1), state.painted))
  	}
  },
  reducer: {
  	setBulkPainted: (state, painted) => ({painted}),
  	setPainted: (state, location) => ({painted: {...state.painted, [location]: state.color}}),
  	setEraseMode: (state, eraseMode) => ({eraseMode}),
  	setColor: (state, color) => ({color}),
  	erase: (state, location) => ({painted: {...state.painted, [location]: null}})
  }
})

  // onSubmit={(data) => onEdit({targetPainted: data})}
  // colorPicker
  // value={getLevel({painted: props.targetPainted, hideAnimal: true, game: props})}