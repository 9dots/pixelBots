/**
 * Imports
 */

import PixelGradient from 'components/PixelGradient'
import ImagePicker from 'components/ImagePicker'
import { Button, Text } from 'vdux-containers'
import { Block, Icon, Image } from 'vdux-ui'
import TwoCanvas from 'components/TwoCanvas'
import createAction from '@f/create-action'
import { component, element } from 'vdux'
import Loading from 'components/Loading'
import reduceObj from '@f/reduce-obj'
import Auth from 'components/Auth'
import fire from 'vdux-fire'

/**
 *  Two.js Draw Helper
 */

const getDraw = props => two => {
  const {
    playlistRef,
    numLevels,
    progress = {},
    startsAt,
    middleware,
    userProfile,
    sequence
  } = props
  console.log(props)

  /**
   *  Constants and Variables
   */
  const background = two.makeGroup()
  const foreground = two.makeGroup()
  const levelLength =
    numLevels < 6 ? two.height : two.height * numLevels / 6 + 200
  const numInflections = 5
  const pathFill = '#FF99AA'
  const lockedFill = '#BBBBBB'
  const nextLevel = progress.completedChallenges
    ? progress.completedChallenges.length || 0
    : 0
  const currentLevel =
    progress.current === nextLevel
      ? progress.current
      : progress.current + 1 || 0

  let animations = []

  /**
   *  Helper Functions
   */
  const createLevel = (n, x = 0, y = 0) => {
    const box = two.makeRectangle(x, y, 42, 42)
    const number = two.makeText(n, x, y + 2, {
      size: 12,
      fill: n - 1 <= nextLevel ? '#333333' : lockedFill,
      weight: 600,
      family: '"Press Start 2P"'
    })
    const challengeScore =
      progress.challengeScores &&
      progress.challengeScores[sequence[n - 1].gameRef]
    const numBadges = challengeScore ? challengeScore.available || 1 : 0
    const badges = two.makeGroup()
    for (let i = 0; i < numBadges; i++) {
      const badge = two.makeRectangle(x, y + i * 12, 8, 8)
      badge.stroke = 'white'
      badge.linewidth = 2
      badge.fill = 'white'
      if (challengeScore) {
        if (i === 0) {
          if (challengeScore.completed) {
            badge.fill = pathFill
          }
        } else {
          if (challengeScore.badge && challengeScore.badge >= i) {
            badge.fill = pathFill
          }
        }
      }
      badges.add(badge)
    }
    badges.translation.x = x - 32
    badges.translation.y = y - (numBadges - 1) * 6
    box.fill = '#FFFFFF'
    box.stroke =
      n - 1 === nextLevel ? '#333333' : n <= nextLevel ? pathFill : lockedFill
    box.linewidth = 4
    return two.makeGroup(box, number, badges)
  }

  /**
   *  Rendering code
   */

  // create path (random or from props)
  let pathCoords = []
  if (props.pathCoords) {
    pathCoords = props.pathCoords
  } else {
    pathCoords.push(two.width / 2, levelLength, two.width / 2, levelLength - 50)
    for (let i = 0; i < numInflections - 1; i++) {
      pathCoords.push(
        two.width / 4 + Math.random() * (two.width / 2),
        levelLength - 50 - (levelLength - 100) / numInflections * (i + 1)
      )
    }
    pathCoords.push(two.width / 2, 50, two.width / 2, 0)
  }
  const route = two.makeCurve(...pathCoords, true)
  route.fill = 'none'
  route.stroke = pathFill
  route.linewidth = 7

  // add levels to path
  let levels = []
  for (let i = 0; i < numLevels; i++) {
    levels.push(createLevel(i + startsAt))
    route.getPointAt(0.1 + 0.8 * (i / (numLevels - 1)), levels[i].translation)
    levels[i].translation.addSelf(route.translation)
  }

  // place player on map
  const playerX = levels[currentLevel].translation.x
  const playerY = levels[currentLevel].translation.y
  const outerCircle = two.makeCircle(playerX, playerY, 28)
  const outerPoint = two.makePath(
    playerX,
    playerY + 39.6,
    playerX + 19.8,
    playerY + 19.8,
    playerX - 19.8,
    playerY + 19.8,
    false
  )
  const outer = two.makeGroup(outerCircle, outerPoint)
  outer.fill = '#333333'
  outer.stroke = '#333333'
  outer.linewidth = 4
  const inner = two.makeGroup(outerCircle.clone(), outerPoint.clone())
  inner.fill = 'white'
  inner.linewidth = 0
  const inside = two.makeCircle(playerX, playerY, 20)
  inside.fill = pathFill
  inside.stroke = '#333333'
  inside.linewidth = 2
  const eyeL = two.makeCircle(playerX - 6, playerY - 6, 1)
  eyeL.fill = '#333333'
  eyeL.stroke = '#333333'
  const eyeR = two.makeCircle(playerX + 6, playerY - 6, 1)
  eyeR.fill = '#333333'
  eyeR.stroke = '#333333'
  const smile = two.makeCurve(
    playerX - 14,
    playerY,
    playerX - 10,
    playerY + 10,
    playerX,
    playerY + 14,
    playerX + 10,
    playerY + 10,
    playerX + 14,
    playerY,
    true
  )
  smile.fill = 'none'
  smile.stroke = '#333333'
  smile.linewidth = 2
  const player = two.makeGroup(outer, inner, inside, eyeL, eyeR, smile)
  player.translation.y = -50

  // center map around player
  foreground.add(player)
  background.add(route, ...levels)
  background.translation.y = -(levelLength - two.height)
  foreground.translation.y = -(levelLength - two.height)
  const world = two.makeGroup(background, foreground)
  world.translation.y = levelLength - 200 - playerY
  if (world.translation.y <= 0) {
    world.translation.y = 0
  } else if (world.translation.y >= levelLength - two.height) {
    world.translation.y = levelLength - two.height
  }

  // update needs to ran once to spawn elements
  two.update()

  // allow map scrolling
  two.renderer.domElement.addEventListener('wheel', e => {
    if (world.translation.y - e.deltaY <= 0) {
      world.translation.y = 0
    } else if (world.translation.y - e.deltaY >= levelLength - two.height) {
      world.translation.y = levelLength - two.height
    } else {
      world.translation.y -= e.deltaY
    }
  })

  // make levels clickable
  for (let i = 0; i < levels.length; i++) {
    const elem = levels[i]._renderer.elem
    elem.addEventListener('mouseover', () => {
      elem.style.cursor = nextLevel < i ? 'not-allowed' : 'pointer'
    })
    elem.addEventListener('click', () => {
      if (nextLevel < i) {
        animations.push(frameCount => {
          const end = frameCount + 120
          player.translation.copy(levels[nextLevel].translation)
          console.log(player.translation, background)
          const dx =
            (background.translation.x +
              levels[nextLevel].translation.x -
              player.translation.x) /
            120
          // const dy =
          //   (player.translation.y - levels[nextLevel].translation.y) / 120
          const f = frameCount => {
            player.translation.x += dx
            // player.translation.y += dy
            return frameCount < end ? f : null
          }
          return f
        })
        return
      }
      middleware(setUrl(`/map/${playlistRef}/play/${i}`))
    })
  }

  // run animations if any get added by an event listener, etc
  two.bind('update', frameCount => {
    if (animations && animations.length >= 0) {
      animations = animations
        .map(anim => anim(frameCount))
        .filter(anim => anim !== null)
    }
  })

  two.bind('resize', () => {
    world.translation.set(two.width / 2, two.height / 2)
  })
}

/**
 *  <StageMap />
 */

const hudProps = {
  bgColor: 'white',
  color: 'primary',
  border: '1px solid rgba(0, 0, 0, 0.09)',
  borderRadius: '0',
  flex: '1 1 auto',
  fs: 'l',
  py: 's',
  px: 's',
  zIndex: 99
}

const initPlaylist = (ref, uid) => ({
  completedChallenges: [],
  lastEdited: Date.now(),
  savedChallenges: null,
  playlist: ref,
  current: 0,
  uid,
  assigned: false
})

const StageMap = fire(props => ({
  instance: `/playlistsByUser/${props.uid}/byPlaylistRef/${props.playlistRef}`
}))(
  component({
    initialState ({ props }) {
      return {
        instanceRef: props.instanceRef
      }
    },

    render ({ middleware, props, state, context }) {
      if (!state.instanceRef) return <span />
      return (
        <StageMapView
          {...props}
          instanceRef={state.instanceRef}
          uid={context.uid} />
      )
    },

    * onUpdate (prev, { props, context, actions }) {
      if (
        prev.props.instance.loading &&
        !props.instance.loading &&
        !props.instanceRef
      ) {
        if (!props.instanceRef) {
          const { instanceRef } = props.instance.value || {}
          if (!instanceRef) {
            return yield actions.createInstance()
          }
          yield actions.setInstanceRef(instanceRef)
        }
      }
    },

    middleware: [yieldMw],

    controller: {
      * createInstance ({ props, context, actions }) {
        const { playlistRef } = props
        const { uid } = context
        const { key } = yield context.firebasePush(
          `/playlistInstances`,
          initPlaylist(playlistRef, uid)
        )
        yield context.firebaseUpdate(`/playlistsByUser/${uid}/byPlaylistRef`, {
          [playlistRef]: {
            lastEdited: Date.now(),
            instanceRef: key
          }
        })
        yield context.firebaseTransaction(
          `/playlists/${playlistRef}/plays`,
          plays => plays + 1
        )
        yield actions.setInstanceRef(key)
      }
    },

    reducer: {
      setInstanceRef: (state, instanceRef) => ({ instanceRef })
    }
  })
)
const StageMapView = fire(props => ({
  playlist: `/playlists/${props.playlistRef}`,
  myProgress: `/playlistInstances/${props.instanceRef}`
}))(
  component({
    render ({ middleware, props, state, context }) {
      if (props.playlist.loading || props.myProgress.loading) return <span />
      const playlist = props.playlist.value
      const progress = props.myProgress.value || {}
      let sequence = []
      for (const x in playlist.sequence) {
        sequence[playlist.sequence[x].order] = {
          name: `Challenge ${playlist.sequence[x].order + 1}`,
          gameRef: playlist.sequence[x].gameRef
        }
      }
      const availableBadges = props.world.possibleBadges
      const completedBadges = reduceObj(
        (score, level) => score + (level.completed || 0) + (level.badge || 0),
        0,
        progress.challengeScores
      )
      return (
        <Block h='100%' overflow='hidden'>
          <TwoCanvas
            key={props.key}
            id={props.key}
            colors={props.colors}
            draw={getDraw({
              ...props,
              numLevels: Object.keys(playlist.sequence).length,
              progress,
              sequence,
              middleware
            })} />
          <Block display='flex' py={0} px='xl' mt='l'>
            <Button
              {...hudProps}
              borderRadius='99px 0 0 99px'
              onClick={props.setScreen('worlds')}>
              <Icon fs='l' bolder name='arrow_back_ios' />
              <Icon fs='xl' bolder name='public' />
            </Button>
            <Text
              {...hudProps}
              borderLeft='1px solid white'
              borderRight='1px solid white'
              textAlign='center'
              pt='m'
              flex='4 2 50%'
              fontFamily='&quot;Press Start 2P&quot;'>
              {props.world.name}
            </Text>
            <Button
              {...hudProps}
              borderRadius='0 99px 99px 0'
              fontFamily='&quot;Press Start 2P&quot;'>
              <Icon fs='l' mr='m' bolder name='stars' />
              {availableBadges !== 0
                ? `${completedBadges}/${availableBadges}`
                : completedBadges}
            </Button>
          </Block>
        </Block>
      )
    },

    middleware: [yieldMw]
  })
)

/**
 *  <Game Map Page />
 */

export default fire(props => ({
  gameMap: `/gameMap`
}))(
  component({
    initialState: {
      screen: null,
      world: null
    },
    * onCreate ({ props, actions }) {
      const screen = props.screen || 'start'
      const world = props.world || 0
      yield actions.setScreen(screen)
      yield actions.setWorld(world)
    },
    render ({ middleware, props, context, state, actions }) {
      if (state.screen === 'start') {
        return (
          <PixelGradient animate p={0} mb={0} angle={180} w='100%' h='100%'>
            <Block fs='xxl' mb='l' fontFamily='&quot;Press Start 2P&quot;'>
              PixelBots
            </Block>
            <Block display='flex' column>
              <Button
                borderRadius={99}
                fs='l'
                py='m'
                px='xl'
                mt='l'
                bold
                flex
                bgColor='white'
                color='primary'
                textTransform='uppercase'
                onClick={actions.setScreen('worlds')}>
                PLAY
              </Button>
              {!context.isAnonymous && (
                <Button
                  borderRadius={99}
                  fs='l'
                  py='s'
                  mt='l'
                  bold
                  bgColor='white'
                  color='primary'
                  textTransform='uppercase'
                  onClick={context.openModal(() => <ImagePicker />)}>
                  <Image
                    src={props.userProfile.photoURL}
                    circle='48px'
                    mr='s' />
                  <Text ellipsis>
                    {context.username}
                  </Text>
                </Button>
              )}
              {context.isAnonymous ? (
                <Button
                  borderRadius={99}
                  fs='l'
                  py='m'
                  px='xl'
                  mt='l'
                  bold
                  flex
                  bgColor='white'
                  color='primary'
                  textTransform='uppercase'
                  onClick={context.openModal(() => <Auth />)}>
                  LOG IN
                </Button>
              ) : (
                <Button
                  borderRadius={99}
                  fs='l'
                  py='m'
                  px='xl'
                  mt='l'
                  bold
                  flex
                  bgColor='white'
                  color='primary'
                  textTransform='uppercase'
                  onClick={context.signOut}>
                  LOG OUT
                </Button>
              )}
            </Block>
          </PixelGradient>
        )
      }
      if (props.gameMap.loading) return <Loading />
      const mapData = props.gameMap.value
      if (state.screen === 'worlds') {
        return (
          <PixelGradient animate p={0} mb={0} angle={180} w='100%' h='100%'>
            <Block display='flex' column align='start start' h='100%' p='xl'>
              <Button
                borderRadius={99}
                fs='m'
                py='s'
                px='m'
                bold
                bgColor='white'
                color='primary'
                textTransform='uppercase'
                onClick={actions.setScreen('start')}>
                <Icon name='arrow_back_ios' />
                BACK TO START
              </Button>
              <Block
                fs='xxl'
                my='l'
                fontFamily='&quot;Press Start 2P&quot;'
                textAlign='center'>
                World Select
              </Block>
              {mapData.map((world, i) => (
                <Button
                  display='flex'
                  row
                  align='start stretch'
                  w='100%'
                  mt='l'
                  p='s'
                  bold
                  bgColor='white'
                  color='primary'
                  key={`world-${i}-${world.playlistRef}`}
                  onClick={[actions.setWorld(i), actions.setScreen('view')]}>
                  <Block
                    sq='60'
                    background={`linear-gradient(${mapData[i].colors[0]}, ${
                      mapData[i].colors[1]
                    })`}
                    color='white'>
                    <Icon mt='15' fs='l' bolder name='lock' />
                  </Block>
                  <Text
                    flex
                    fs='l'
                    py='m'
                    ml='m'
                    textAlign='left'
                    textTransform='uppercase'
                    fontFamily='&quot;Press Start 2P&quot;'>
                    {world.name}
                  </Text>
                </Button>
              ))}
            </Block>
          </PixelGradient>
        )
      }
      if (state.screen === 'view') {
        return (
          <StageMap
            {...props}
            {...actions}
            key='world-map-canvas'
            colors={getColorArray(mapData[state.world].colors)}
            playlistRef={mapData[state.world].playlistRef}
            world={mapData[state.world]}
            startsAt={1} />
        )
      }
    },
    reducer: {
      setScreen: (state, screen) => ({ screen }),
      setWorld: (state, world) => ({ world })
    }
  })
)

/**
 * Middleware
 */

const setUrl = createAction('<GameMapPage/>: SETURL')

function yieldMw ({ dispatch, getContext }) {
  return next => action => {
    if (action.type === setUrl.type) {
      dispatch(getContext().setUrl(action.payload))
    }
    return next(action)
  }
}

/**
 * Helper Functions
 */

function getColorArray (colors) {
  return [colors[0], colors[1]]
}
