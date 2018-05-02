/**
 * Imports
 */

import PixelGradient from 'components/PixelGradient'
import TwoCanvas from 'components/TwoCanvas'
import createAction from '@f/create-action'
import { component, element } from 'vdux'
import { Button } from 'vdux-containers'
import { Block, Icon } from 'vdux-ui'
import fire from 'vdux-fire'

/**
 * <Game Map Page/>
 */

const getDraw = props => two => {
  const { playlistRef, numLevels, progress = {}, startsAt, middleware } = props
  const numInflections = 4
  const pathFill = '#FF99AA'
  const lockedFill = '#BBBBBB'
  let nextLevel = progress.current || -1
  const level = (n, x = 0, y = 0) => {
    const box = two.makeRectangle(x, y, 42, 42)
    const number = two.makeText(n, x, y + 2, {
      size: 12,
      fill: n - 1 <= nextLevel ? '#333333' : lockedFill,
      weight: 600,
      family: '"Press Start 2P"'
    })
    // const name = two.makeText(sequence[n - 1].name, x + 36, y + 2, {
    //   size: 14,
    //   fill: n - 1 <= nextLevel ? '#333333' : lockedFill,
    //   weight: 500,
    //   family: '"Press Start 2P"',
    //   alignment: 'left'
    // })
    const badges = []
    for (let i = 0; i < 3; i++) {
      badges.push(two.makeRectangle(x - 32, y - 12 + i * 12, 8, 8))
    }
    badges.map((badge, i) => {
      badge.noStroke()
      badge.fill =
        n - 1 < nextLevel
          ? Math.round(Math.random()) || i === 2 ? pathFill : '#FFFFFF'
          : '#FFFFFF'
    })
    box.fill = '#FFFFFF'
    box.stroke =
      n - 1 === nextLevel ? '#333333' : n <= nextLevel ? pathFill : lockedFill
    box.linewidth = 4
    // return two.makeGroup(box, number, name, ...badges)
    return two.makeGroup(box, number, ...badges)
  }

  let pathCoords = []
  if (props.pathCoords) {
    pathCoords = props.pathCoords
  } else {
    pathCoords.push(two.width / 2, two.height, two.width / 2, two.height - 50)
    for (let i = 0; i < numInflections - 1; i++) {
      pathCoords.push(
        two.width / 3 + Math.random() * (two.width / 3),
        // 50 + Math.random() * (two.height - 100)
        // 50 + Math.random() * (two.width - 100),
        two.height - 50 - (two.height - 100) / numInflections * (i + 1)
      )
    }
    pathCoords.push(two.width / 2, 50, two.width / 2, 0)
  }

  const route = two.makeCurve(...pathCoords, true)
  route.fill = 'none'
  route.stroke = pathFill
  route.linewidth = 7
  // route.subdivide(100)

  // let doneRoute = two.makeCurve(route.vertices.map(a => a.clone()), true)
  // doneRoute.fill = 'none'
  // doneRoute.stroke = '#AAFF99'
  // doneRoute.linewidth = 8
  // doneRoute.translation.addSelf(route.translation)

  let levels = []
  for (let i = 0; i < numLevels; i++) {
    levels.push(level(i + startsAt))
    route.getPointAt(0.1 + 0.8 * (i / (numLevels - 1)), levels[i].translation)
    levels[i].translation.addSelf(route.translation)
  }
  const square = two.makeText('world name', two.width / 5, 4 * two.height / 5, {
    size: 36,
    fill: '#FFFFFF',
    weight: 600,
    family: '"Press Start 2P"'
  })
  two.update()
  two.renderer.domElement.addEventListener('wheel', e => {
    if (e.deltaY > 15) {
      // prev map + debounce
      square.fill = `#FFAA00`
    } else if (e.deltaY < -15) {
      // next map + debounce
      square.fill = `#00FFAA`
    }
  })

  for (let i = 0; i < levels.length; i++) {
    const elem = levels[i]._renderer.elem
    elem.addEventListener('mouseover', () => {
      elem.style.cursor = nextLevel < i ? 'not-allowed' : 'pointer'
    })
    elem.addEventListener('click', () => {
      if (nextLevel < i) {
        return
      }
      middleware(setUrl(`/activity/${playlistRef}/${i}`))
      // elem.children[0].setAttribute('stroke', pathFill)
      // elem.children[1].setAttribute('fill', '#333333')
      // elem.children[2].setAttribute('fill', '#333333')
      // // elem.children[3].setAttribute(
      // //   'fill',
      // //   Math.random() < 0.5 ? pathFill : lockedFill
      // // )
      // // elem.children[4].setAttribute(
      // //   'fill',
      // //   Math.random() < 0.5 ? pathFill : lockedFill
      // // )
      // nextLevel += 1
      // if (nextLevel < numLevels) {
      //   const next = levels[nextLevel]._renderer.elem
      //   next.children[0].setAttribute('stroke', '#333333')
      //   next.children[1].setAttribute('fill', '#333333')
      //   next.children[2].setAttribute('fill', '#333333')
      // } else {
      //   // make new map
      // }
    })
  }

  // two.bind('update', frameCount => {
  //   edgeRect.scale += Math.sin(frameCount / 100) / 100
  //   edgeRect.rotation = Math.sin(frameCount / 10) / 50
  // })
}

const StageMap = fire(props => ({
  playlist: `/playlists/${props.playlistRef}`,
  myProgress: {
    ref: `/playlistsByUser/${props.uid}/byPlaylistRef/${props.playlistRef}`,
    join: {
      ref: `/playlistInstances`,
      child: 'progressValue',
      childRef: 'instanceRef'
    }
  }
}))(
  component({
    render ({ middleware, props, context }) {
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
      return (
        <TwoCanvas
          key={props.key}
          colors={props.colors}
          draw={getDraw({
            ...props,
            numLevels: Object.keys(playlist.sequence).length,
            progress: progress.progressValue,
            sequence,
            middleware
          })} />
      )
    },
    middleware: [yieldMw]
  })
)

export default fire(props => ({
  gameMap: `/gameMap`
}))(
  component({
    initialState: {
      screen: 'start'
    },
    render ({ middleware, props, context, state, actions }) {
      if (state.screen === 'start') {
        return (
          <PixelGradient animate p={0} mb={0} angle={180} w='100%' h='100%'>
            <Block fs='xxl' mb='l' fontFamily='&quot;Press Start 2P&quot;'>
              PixelBots
            </Block>
            <Button
              borderRadius={99}
              fs='l'
              py='m'
              px='xl'
              mt='l'
              bold
              bgColor='white'
              color='primary'
              textTransform='uppercase'
              onClick={actions.setScreen('map')}>
              PLAY
            </Button>
          </PixelGradient>
        )
      }
      if (props.gameMap.loading) return <span />
      if (state.screen === 'map') {
        const mapData = props.gameMap.value
        return (
          <Block h='100%'>
            {/* <StageMap
              {...props}
              colors={['#29a4e2', '#fcd721']}
              pathCoords={[
                677,
                965,
                677,
                915,
                824.7633319098074,
                698.75,
                693.6111928415937,
                482.5,
                573.7516644705793,
                266.25,
                677,
                50,
                677,
                0
              ]}
              playlistRef={mapData[1].playlistRef}
              startsAt={10} /> */}
            <StageMap
              {...props}
              key='world-map-canvas'
              colors={['#fcd721', '#39b54a']}
              // pathCoords={[
              //   677,
              //   965,
              //   677,
              //   915,
              //   702.9127694704052,
              //   698.75,
              //   471.5180515728297,
              //   482.5,
              //   492.60056810804997,
              //   266.25,
              //   677,
              //   50,
              //   677,
              //   0
              // ]}
              playlistRef={mapData[0].playlistRef}
              startsAt={1} />
          </Block>
        )
      }
    },
    reducer: {
      setScreen: (state, screen) => ({ screen })
    }
  })
)

/**
 * Middleware
 */

const setUrl = createAction('<AnimationView/>: UPLOAD')

function yieldMw ({ dispatch, getContext }) {
  return next => action => {
    if (action.type === setUrl.type) {
      dispatch(getContext().setUrl(action.payload))
    }
    return next(action)
  }
}
