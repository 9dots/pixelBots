/**
 * Imports
 */

import GridSizeSelector from 'components/GridSizeSelector'
import TurnSelector from 'components/TurnSelector'
import ColorPicker from 'components/ColorPicker'
import EraseButton from 'components/EraseButton'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Grid from 'components/Grid'
import {Block, Icon} from 'vdux-ui'
import Switch from '@f/switch'

export default component({
	render ({props}) {
		const {
			type, 
			grid,
      animals,
			levelSize,
			actions,
			gridState,
			title, 
			info,
			enablePaint = true,
			enableMove = true,
			enableSize = true,
			...restProps
		} = props
  	const btnProps = {
  		bgColor: '#FAFAFA', 
  		border: '1px solid #CACACA', 
  		sq: 40,
  		color: 'black'
  	}

  	const {mode, color, painted} = gridState
  	const clickHandler = Switch({
  		paint: () => actions.setPainted(grid),
  		erase: () => actions.erase(grid),
  		animal: () => actions.moveAnimal(grid)
  	})(mode)

		return (
			<Block {...restProps}>
				<Block mt textAlign='center'>
	  			<Block fs='m'color='blue'>{title}</Block>
	  			<Block fs='xs' my>
	  				{info}
	  			</Block>
	  		</Block>
	  		<Block align='center start'>
	    		<Block pb>
	    			<Block bgColor='white' p='1em' border='1px solid divider' borderBottomWidth={0} z='9999' relative>
	    				<Block align='start center'>
		          	<ColorPicker
		              zIndex='999'
		              active={mode === 'paint'}
		              animalType={animals[0].type}
		              dropdownHandler={actions.setColor(grid)}
		              clickHandler={actions.setMode(grid, 'paint')}
		              paintColor={color}
		              {...btnProps}
		              hide={!enablePaint} />
		            <EraseButton
		            	{...btnProps}
		            	active={mode === 'erase'}
		            	clickHandler={actions.setMode(grid, 'erase')}
		            	hide={!enablePaint} />
		            <Button {...btnProps} ml='s' highlight={mode === 'animal'} onClick={actions.setMode(grid, 'animal')} hide={!enableMove}>
		            	<Icon name='open_with' />
		            </Button>
		            <TurnSelector ml='s' animals={animals} hide={!enableMove} clickHandler={actions.turn(grid)}/>
		            <Block flex />

		            <GridSizeSelector setSize={actions.setSize} size={levelSize[0]} {...btnProps} hide={!enableSize} />
	          	</Block>
	          </Block>
			    	<Grid
			    		clickHandler={clickHandler}
			      	mode='edit'
			        paintMode
			        animals={grid === 'initialPainted' ? animals : []}
			        painted={painted}
			        levelSize='400px'
			        numRows={props.levelSize[0]}
			        numColumns={props.levelSize[1]}
			        />
	        </Block>
	      </Block>
      </Block>
		)
	}
})