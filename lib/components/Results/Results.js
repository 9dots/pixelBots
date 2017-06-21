/**
 * Imports
 */

import ShowcaseButton from 'components/ShowcaseButton'
import GameButton from 'components/GameButton'
import MainLayout from 'layouts/MainLayout'
import {Block, Icon, Image} from 'vdux-ui'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import Badge from 'components/Badge'
import Switch from '@f/switch'
import moment from 'moment'

/**
 * <Results/>
 */

let v = 0

const gameButton = {
	fontFamily: '"Press Start 2P"',
	bgColor: 'blue',
	color: 'white',
	wide: true,
	lh: '2em',
	py: 's',
	mt: 's',
	fs: 15
}

export default component({
  render ({props, context}) {
  	const {playlist, saved, game, gameRef, saveRef, userProfile} = props

    const {value, loading} = saved

    if(loading) return <span />

    const solutionSteps = value && value.solutionSteps || game.value.solutionSteps
    const {badges = {}, steps = 0} = !!value && value
    const {loc = 0, timeElapsed, slowdowns, runs, stepperSteps = 0} = value && value.meta
    const {stretch = {}} = game.value
    const imageSize = '420px'
    const current = Number(props.current)
    const base = `/playlist/${props.playlistRef}/play/${props.instanceRef}`
    const shared = !!(userProfile.showcase && userProfile.showcase[saveRef])
    const isLast = current + 1 === props.sequence.length
    const type = game.value.type || 'write'
    const img = type === 'write' ? 'teacherBot.png'  : `${type}Image.png`

    return (
      <Block tall>
        <MainLayout
          bodyProps={{px: 120, w: 1050, mx: 'auto'}}
          navigation={[{category: playlist.title, title: game.value.title}]}
          titleImg={'/animalImages/' + img}
          titleActions={playlist && playlist.actions}
          >
          <Block  mx='auto'>
		        <Block align='start stretch'>
		        	<Tile header='Results' flex mr relative>
		        		<Block align='space-around center' p='l' pl={100}>
		        			<Image src='/animalImages/chaoslarge.png' absolute top bottom left={-120} m='auto' />
		        			<Badge name='Completed' icon='star' color='yellow' />
		        			{
                    stretch.type === 'stepLimit' && (
                      <Badge count={badges.stepLimit || 0} name='Steps Taken' icon='show_chart' color='green' />
                    )
                  }
                  {
                    stretch.type === 'lineLimit' && (
                      <Badge count={badges.lineLimit || 0} name='Lines of Code' icon='view_list' color='blue' />
                    )
                  }
		        		</Block>
		        	</Tile>
		        	<Tile header='Stats' w={250} align='start stretch' column>
		        		<Block p column align='start' flex>
		        			{
		        				Switch({
		        					read: () => (
		        						<Block flex>
		        							<Stat label='Moves' value={runs} />
				                  <Stat label='Time' value={getDuration(timeElapsed)}/>
		        						</Block>
		        					),
		        					debug: () => (
		        						<Block></Block>
		        					),
		        					default: () => (
		        						<Block flex column align='space-between'>
		        							<Stat label='Runs' value={runs} />
				                  <Stat label='Stepper' value={stepperSteps} />
						        			<Stat label='Slowdowns' value={slowdowns} />
	        							</Block>
		        					),
		        				})(game.type)

		        				// <Stat label='Steps' value={steps} />
                    // game.type !== 'read' && (
                    //   <Stat label='Lines' value={loc} />
                    // )
                  }
		        			<Block flex />
		        			<Block align='start center'>
			        			<GameButton {...gameButton} bgColor='red' mr='s' onClick={context.setUrl(`${base}/${current}`)}>
				        			Retry
				        		</GameButton>
				        		{
				        			isLast
				        			? <GameButton {...gameButton} onClick={context.setUrl('/')}>
					        				Home
					        			</GameButton>
					        		: <GameButton {...gameButton} onClick={context.setUrl(`${base}/${current + 1}`)}>
					        				Next
					        			</GameButton>
				        		}
			        		</Block>
		        		</Block>
		        	</Tile>
		        </Block>
		        <Tile mt header='Animation' >
		        	<Block p column align='center center'>
		        		<Block align='center center' border='1px solid #e0e0e0'>
				          {
				            value.animatedGif
				              ? <video src={value.animatedGif} loop autoplay width={imageSize} height={imageSize}/>
				              : <Block sq={imageSize} align='center center' bgColor='#FCFCFC'>
				                  <Loading wide message='Building Gif Check Back Soon!' position='static' sq='auto' />
				                </Block>
				          }
				        </Block>
				        <ShowcaseButton gameRef={gameRef} saveRef={saveRef} shared={shared} mt/>
		        	</Block>
		        </Tile>
		      </Block>
        </MainLayout>
      </Block>
    )
  }
})

/**
 * Helpers
 */

function getDuration(time) {
	const duration = moment.duration(time)
  const m = Math.floor(duration.asMinutes())
  const s = Math.floor(duration.seconds())
  return `${m || '0'}m${pad(s)}s`
}

function pad(input, length = 2) {
	let str = input.toString()
  while (str.length < length) str = 0 + str
  return str
}

/**
 *
 */

const Tile = component({
	render({props, children}) {
		const {header, ...rest} = props
		return (
			<Block bg='white' border='1px solid divider' relative {...rest}>
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
			<Block align='space-between center' fontFamily='"Press Start 2P"' my='s' fs={13}>
				<Block>{label}:</Block>
				<Block>{value}</Block>
			</Block>
		)
	}
})
