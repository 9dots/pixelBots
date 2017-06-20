/**
 * Imports
 */

import Loading from 'components/Loading'
import GameButton from 'components/GameButton'
import {Block, Icon, Image} from 'vdux-ui'
import MainLayout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Badge from 'components/Badge'
import moment from 'moment'

/**
 * <Results/>
 */

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
    const {loc = 0, timeElapsed, slowdowns, runs} = value && value.meta
    const {stretch = {}} = game.value
    const imageSize = '420px'
    const current = Number(props.current)
    const base = `/playlist/${props.playlistRef}/play/${props.instanceRef}`
    const shared = !!(userProfile.showcase && userProfile.showcase[saveRef])
    const isLast = current + 1 === props.sequence.length

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
		        			<Stat label='Steps' value={steps} />
		        			{
                    game.type !== 'read' && (
                      <Stat label='Lines' value={loc} />
                    )
                  }
                  <Stat label='Runs' value={runs} />
		        			<Stat label='Time' value={getDuration(timeElapsed)}/>
		        			<Stat label='Slowdowns' value={slowdowns} />
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
				              ? <video loop autoplay width={imageSize} height={imageSize} src={value.animatedGif}>
													<source src={value.animatedGif} type="video/mp4" />
												</video>
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
	// const h = Math.floor(duration.asHours())
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


const ShowcaseButton = component({
  render ({props, actions}) {
    const {shared, ...rest} = props
    const {add, remove} = actions
    const btnProps = {
      color: shared ? 'red' : 'white',
      bgColor: shared ? 'white' : 'blue',
      borderColor: shared ? 'red' : 'rgba(0,0,0,.1)',
      hoverProps: {highlight: shared ? .02 : .1},
      focusProps: {},
      p: '6px 12px',
      fs: 'xs',

    }

    return (
      <Button {...btnProps} {...rest} onClick={shared ? remove : add}>
    		<Icon name='collections' mr='s' />
    		{ shared ? 'Remove from Showcase' : 'Add to Showcase' }
    	</Button>
    )
  },
  controller: {
    * add ({context, props}) {
      const {uid, firebasePush, firebaseUpdate, firebaseSet} = context
      const {gameRef, saveRef} = props
      yield firebaseUpdate(`/saved/${saveRef}/meta`, {shared: true})
      yield firebaseSet(`/users/${context.uid}/showcase/${saveRef}`, {
        gameRef,
        saveRef,
        lastEdited: Date.now()
      })
    },
    * remove ({context, props}) {
      const {uid, firebasePush, firebaseUpdate, firebaseSet} = context
      const {gameRef, saveRef} = props
      yield firebaseUpdate(`/saved/${saveRef}/meta`, {shared: false})
      yield firebaseSet(`/users/${context.uid}/showcase/${saveRef}`, null)
    }
  }
})
