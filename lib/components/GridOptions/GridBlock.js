/**
 * Imports
 */

import GridSizeSelector from 'components/GridSizeSelector'
import TurnSelector from 'components/TurnSelector'
import ColorPicker from 'components/ColorPicker'
import PaintButton from 'components/PaintButton'
import EraseButton from 'components/EraseButton'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Grid from 'components/Grid'
import {Block, Icon} from 'vdux-ui'
import Switch from '@f/switch'

/**
 * Constants
 */

const btnProps = {
	bgColor: '#FAFAFA',
 	border: '1px solid #CACACA',
 	sq: 40,
 	fs: 'm',
 	color: 'black'
}

/**
 * <GridBlock/>
 */

export default component({
	render ({props}) {
		const {
			type,
			grid,
			enableColorTips,
      animals,
			levelSize,
			opacity = 1,
			actions,
			onClick,
			gridState,
			size = '400px',
			isProject = true,
			title,
			userAnimal,
			info,
			palette,
			capabilities,
			enablePaint = true,
			enableMove = true,
			enableSize = true,
			...restProps
		} = props

  	const {mode, color, painted} = gridState
  	const mouseHandler = Switch({
  		paint: () => actions.setPainted(grid),
  		erase: () => actions.erase(grid),
  		animal: () => actions.moveAnimal(grid)
  	})(mode)

		return (
			<Block {...restProps}>
				{
					title && <Block textAlign='center'>
	  				<Block fs='m'color='blue'>{title}</Block>
	  				<Block fs='xs' my>
	  					{info}
	  				</Block>
	  			</Block>
	  		}
	  		<Block align='center start'>
	    		<Block pb>
	  			{
	    			isProject && <Block bgColor='white' px h={68} border='1px solid divider' borderBottomWidth={0} align='start center'>
	    				<Block align='start center'>
		          	<ColorPicker
		              clickHandler={actions.setColor(grid)}
		              paintColor={color}
		              colors={palette}
		              {...btnProps}
		              mr='s'
		              borderRadius={0}
		              swatchSize={26}
		              hide={!enablePaint} />
	            	<PaintButton
	            		active={mode === 'paint'}
	            		onClick={actions.setMode(grid, 'paint')}
	            		{...btnProps} />
		            <EraseButton
		            	{...btnProps}
		            	active={mode === 'erase'}
		            	clickHandler={actions.setMode(grid, 'erase')}
		            	hide={!enablePaint} />
		            <Button {...btnProps} ml='s' highlight={mode === 'animal'} onClick={actions.setMode(grid, 'animal')} hide={!enableMove}>
		            	<Icon name='open_with' />
		            </Button>
		            <TurnSelector ml='s' animal={userAnimal} hide={!enableMove} clickHandler={actions.turn(grid)} />
		            <Block flex />
		            <GridSizeSelector setSize={props.actions.setSize} size={levelSize[0]} {...btnProps} hide={!enableSize} />
	          	</Block>
	          </Block>
	  			}
		    	<Grid
						onClick={onClick || mouseHandler}
						onDrag={mouseHandler}
		    		opacity={opacity}
		    		enableColorTips={enableColorTips}
						userAnimal={userAnimal}
		        paintMode
		        animals={grid === 'initial' ? animals : []}
		        painted={painted}
		        levelSize={size}
		        numRows={props.levelSize[0]}
		        numColumns={props.levelSize[1]}
		        />
	        </Block>
	      </Block>
      </Block>
		)
	}
})
