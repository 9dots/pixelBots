/**
 * Imports
 */

import ShowcaseButton from 'components/ShowcaseButton'
import {CSSContainer, wrap} from 'vdux-containers'
import {Block, Icon, Image, Text} from 'vdux-ui'
import GameButton from 'components/GameButton'
import MainLayout from 'layouts/MainLayout'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import Badge from 'components/Badge'
import Switch from '@f/switch'
import moment from 'moment'

/**
 * <Results/>
 */

const imageSize = '400px'
const badgeSize = 110
const gameButton = {
	fontFamily: '"Press Start 2P"',
	bgColor: 'blue',
	color: 'white',
	lh: '2em',
	py: 's',
	my: true,
	w: 200,
	fs: 15
}

export default component({
  render ({props, context}) {
  	const {playlist, saved, game, gameRef, saveRef, userProfile = {}} = props

    const {value, loading} = saved

    if (loading) return <span />

    const {badges = {}, moves, steps} = !!value && value
    const {timeElapsed, slowdowns, runs, stepperSteps = 0, loc, modifications} = value && value.meta
    const {stretch = {}} = game.value
    const current = Number(props.current)
    const base = `/playlist/${props.playlistRef}/play/${props.instanceRef}`
    const shared = !!(userProfile.showcase && userProfile.showcase[saveRef])
    const isLast = current + 1 === props.sequence.length
    const type = game.value.type || 'write'
    const img = type === 'write' ? 'teacherBot.png' : `${type}Image.png`

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
	        				<BadgeLine
                		hasBadge={true}
                		title='Completed'
                		type='completed'
                		noun='completed'
                		earned
                		borderTop={0} />
                  <BadgeLine
                		hasBadge={stretch.type === 'stepLimit'}
                		limit={stretch.value}
                		title='Step Count'
                		type='stepLimit'
                		noun='step'
                		count={steps}
                		hide={type !== 'write' || stretch.type !== 'stepLimit'} />
                	<BadgeLine
                		hasBadge={stretch.type === 'lineLimit'}
                		limit={stretch.value}
                		title='Line Count'
                		type='lineLimit'
                		noun='line'
                		count={loc}
                		hide={type !== 'write' || stretch.type !== 'lineLimit'} />
                	<BadgeLine
                		hasBadge={type === 'read'}
                		limit={3}
                		title='Error Limit'
                		type='errorLimit'
                		noun='error'
                		count={saved.value.invalidCount}
                		hide={type !== 'read'} />
									<BadgeLine
										hasBadge={type === 'debug'}
										limit={3}
										title='Modification Limit'
										type='modLimit'
										noun='modification'
										count={modifications}
										hide={type !== 'debug'} />
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
		        </Block>
		        <Block align='center center'>
        			<GameButton {...gameButton} bgColor='red' mr onClick={context.setUrl(`${base}/${current}`)}>
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
		const {count, type, hasBadge, limit, title, noun, ...rest} = props
		const earned = props.earned || count <= limit
		const isBinary = count === undefined

		return (
			<Block align='start center' borderTop='1px solid divider' py='l' {...rest}>
				<Block flex>
					<Block fontFamily='"Press Start 2P"' align='start center'>
						{title}
						<Block fs='xxs' hide={isBinary}>
							:
							<Text color={earned ? 'primary' : 'red'}> {count}
								<Text hide={!hasBadge}>&nbsp;of {limit}</Text>
							</Text>
						</Block>
					</Block>
					<Block mt mr={60} hide={isBinary}>
						This challenge took you {count} {noun}s to complete.
						<Block mt='s' hide={!hasBadge || earned}>
							Do this challenge in under {limit} {noun}s to earn a badge!
						</Block>
					</Block>
					<Block mt mr={60} hide={!isBinary}>
						You earned a new {noun} challenge badge!
					</Block>
				</Block>
	    	<Badge
	    		message={hasBadge  ? false : `No ${noun} badge for this challenge`}
	    		disabledColor={hasBadge ? '#BBB' : 'white'}
	    		count={earned && hasBadge ? 1 : 0}
	    		type={type}
	    		size={120}
	    		hideTitle />
	  	</Block>
  	)
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
