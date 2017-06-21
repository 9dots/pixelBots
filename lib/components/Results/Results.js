/**
 * Imports
 */

import ShowcaseButton from 'components/ShowcaseButton'
import {CSSContainer, wrap} from 'vdux-containers'
import GameButton from 'components/GameButton'
import MainLayout from 'layouts/MainLayout'
import {Block, Icon, Image, Text} from 'vdux-ui'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import Badge from 'components/Badge'
import Switch from '@f/switch'
import moment from 'moment'

/**
 * <Results/>
 */

let v = 0

const imageSize = '400px'
const badgeSize = 110
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
    const current = Number(props.current)
    const base = `/playlist/${props.playlistRef}/play/${props.instanceRef}`
    const shared = !!(userProfile.showcase && userProfile.showcase[saveRef])
    const isLast = current + 1 === props.sequence.length
    const type = game.value.type || 'write'
    const img = type === 'write' ? 'teacherBot.png'  : `${type}Image.png`

    const isStepStretch = stretch.type === 'stepLimit'
    const isLineStretch = stretch.type === 'lineLimit'

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
		        	<Tile header='Badges' flex relative>
		        		<Image src='/animalImages/chaoslarge.png' absolute top bottom left={-120} m='auto' z={2} />
		        		<Block py='l' pl={100} w='80%' mx='auto'>
		        			<Block align='start center'>
		        				<Block flex>
		        					<Block fontFamily='"Press Start 2P"'>Completed</Block>
		        					<Block mt>
		        						You earned a new completed challenge badge!
	        						</Block>
	        					</Block>
		        				<Badge type='completed' size={badgeSize} />
	        				</Block>
	        				<Block align='start center' py='l'>
		        				<Block flex>
		        					<Block fontFamily='"Press Start 2P"'>Step Count {steps}</Block>
		        					<Block mt>
		        						Your code took {steps} steps to complete.
	        						</Block>
	        					</Block>
										<Badge type='stepLimit' count={badges.stepLimit || 0} icon='show_chart' color='green' disabledColor={'white'} size={badgeSize} message={isStepStretch ? false : 'No badge for this challenge'} />
                  </Block>
                  {
                  //	<BadgeLine type='lineLimit' count={loc} />
                  }
		        		</Block>
		        	</Tile>
		        </Block>
		        <Block mt align='start' relative>
			        <Tile flex mr header='Animation' >
			        	<Block p align='center center'>
			        		<Block align='center center' border='1px solid #e0e0e0'>
					          {
					            value.animatedGif
					              ? <Video gameRef={gameRef} saveRef={saveRef} shared={shared} url={value.animatedGif} />
					              : <Block sq={imageSize} align='center center' bgColor='#FCFCFC'>
					                  <Loading wide message='Building Gif Check Back Soon!' position='static' sq='auto' />
					                </Block>
					          }
					        </Block>
			        	</Block>
			        </Tile>
		        	<Tile header='Debug Stats' w={250} align='start stretch' column>
		        		<Block p column align='center stretch' flex>
		        			{
		        				Switch({
		        					read: () => (
		        						<Block column align='center' flex>
		        							<Stat label='Moves' icon='system_update_alt' value={runs} />
				                  <Stat label='Time' value={getDuration(timeElapsed)}/>
		        						</Block>
		        					),
		        					debug: () => (
		        						<Block column align='center' flex>
		        							<Stat label='Stepper' icon='skip_next' value={stepperSteps} />
						        			<Stat label='Slowdowns' icon='fast_rewind' value={slowdowns} />
		        						</Block>
		        					),
		        					default: () => (
		        						<Block column align='center' flex>
		        							<Stat label='Runs' icon='play_arrow' value={runs} />
				                  <Stat label='Stepper' icon='skip_next' value={stepperSteps} />
						        			<Stat label='Slowdowns' icon='fast_rewind' value={slowdowns} />
	        							</Block>
		        					),
		        				})(game.type)
                  } 
		        			<Block  mt='l' borderTop='1px solid divider' pt pb='s' px='s'>
				        		{
				        			isLast
				        			? <GameButton {...gameButton} onClick={context.setUrl('/')}>
					        				Home
					        			</GameButton>
					        		: <GameButton {...gameButton} onClick={context.setUrl(`${base}/${current + 1}`)}>
					        				Next
					        			</GameButton>
				        		}
			        			<GameButton {...gameButton} bgColor='red' mt onClick={context.setUrl(`${base}/${current}`)}>
				        			Retry
				        		</GameButton>
			        		</Block>
		        		</Block>
		        	</Tile>
		        </Block>
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
		const {label, value = 0, icon} = props
		return (
			<Block align='start center' fontFamily='"Press Start 2P"' my fs={13}>
				<Icon name={icon}  mr='s'/>
				<Block flex>{label}:</Block>
				<Block>{value}</Block>
			</Block>
		)
	}
})

const BadgeLine = component({
	render({props}) {
		<Block align='start center'>
			<Block flex>
				<Block fontFamily='"Press Start 2P"' align='start center'>
					Line Count: 
					<Block fs='xxs' ml>
						{loc} 
						<Text hide={!isLineStretch}>&nbsp;of {stretch.value}</Text>
					</Block>
				</Block>
				<Block mt mr={60}>
					This challenge took you {loc} lines of code to complete. 
					<Text hide={stretch.type !== 'lineLimit' || badges.lineLimit >= 1}>
						Complete this challenge in under {stretch.value} lines of code to earn this badge
					</Text>
				</Block>
			</Block>
    	<Badge 
    		type='lineLimit' 
    		hideTitle 
    		count={badges.lineLimit || 0} 
    		disabledColor={isLineStretch ? '#BBB' : 'white'}
    		size={badgeSize}
    		message={stretch.type === 'lineLimit' 
    			? false : 'No badge for this challenge'
    		} />
  	</Block>
	}
})

const Video = wrap(CSSContainer, {
  hoverProps: {
    hovering: true
  }
})(component({
	render({props}) {
		const {gameRef, saveRef, shared, url, hovering} = props
		return (
			<Block sq={imageSize} relative>
				<ShowcaseButton gameRef={gameRef} saveRef={saveRef} shared={shared} absolute m right top pointer z={1} opacity={hovering ? 1 : 0} transition='opacity .15s' />
				<video src={url} loop autoplay height={imageSize} width={imageSize} />
			</Block>
		)
	}
}))
