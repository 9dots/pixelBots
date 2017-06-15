/**
 * Imports
 */

import GameButton from 'components/GameButton'
import Badge from 'components/Badge'
import {Block, Icon, Image} from 'vdux-ui'
import {component, element} from 'vdux'
import MainLayout from 'layouts/MainLayout'
import DisplayCard from 'components/DisplayCard'
/**
 * <Results/>
 */

export default component({
  render ({props}) {
  	const {playlist, saved, game} = props
    const steps = saved && saved.value.steps
    const {loc} = saved && saved.value && saved.value.meta
    const solutionSteps = saved.value.solutionSteps || game.value.solutionSteps

    return (
      <Block tall>
        <MainLayout
          bodyProps={{px: 120, w: 1050, mx: 'auto'}}
          navigation={[
            playlist && {category: 'playlist', title: playlist.title},
            {category: 'challenge', title: playlist.subtitle}
          ]}
          titleActions={playlist && playlist.actions}
          titleImg={playlist ? playlist.img : props.imageUrl}>
          <Block  mx='auto'>
		        <Block align='start stretch'>
		        	<Tile header='Results' flex mr relative>
		        		<Block align='space-around center' p='l' pl={100}>
		        			<Image src='/animalImages/chaoslarge.png' absolute top bottom left={-120} m='auto' />
		        			<Badge name='Completed' icon='check' color='green' />
		        			<Badge name='Steps Taken' icon='show_chart' color='blue' />
		        		</Block>
		        	</Tile>
		        	<Tile header='Stats' w={250}>
		        		<Block p>
		        			<Stat label='Steps' value={steps} />
		        			{
                    game.type !== 'read' && (
                      <Stat label='Lines' value={loc} />
                    )
                  }
		        			{/* <Stat label='Time' value='3:20'/> */}
		        			{/* <Stat label='Errors' value='6' /> */}
			        		<GameButton p bgColor='blue' color='white' fs='s' wide mt fontFamily='"Press Start 2P"'>
			        			Try Again
			        		</GameButton>
		        		</Block>
		        	</Tile>
		        </Block>
		        <Tile mt header='GIF' >
		        	<Block p align='center'>
		        		<DisplayCard
                  gameRef={props.gameRef}
                  saveRef={props.saveRef} />
		        	</Block>
		        </Tile>
		      </Block>
        </MainLayout>
      </Block>
    )
  }
})

const Tile = component({
	render({props, children}) {
		const {header, ...rest} = props
		return (
			<Block bg='white' border='1px solid divider' {...rest}>
				<Block bg='#835584' p textAlign='center' color='white' fontFamily='"Press Start 2P"'>
					{header}
				</Block>
				{children}
			</Block>
		)
	}
})

const Stat = component({
	render({props}) {
		const {label, value = 0} = props
		return (
			<Block align='space-between center' fontFamily='"Press Start 2P"' my='m' fs='12'>
				<Block>{label}:</Block>
				<Block>{value}</Block>
			</Block>
		)
	}
})
