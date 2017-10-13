/**
 * Imports
 */

import ShowcaseButton from 'components/ShowcaseButton'
import PlaylistBadges from 'components/PlaylistBadges'
import { Block, Icon, Image } from 'vdux-ui'
import ResultBadges from 'components/ResultBadges'
import GameButton from 'components/GameButton'
import MainLayout from 'layouts/MainLayout'
import Loading from 'components/Loading'
import { component, element } from 'vdux'

/**
 * <Results/>
 */

const imageSize = '400px'
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
  render ({ props, context }) {
    const {
      playlist,
      saved,
      game,
      gameRef,
      saveRef,
      userProfile = {},
      sequence,
      playlistRef
    } = props
    const { value, loading } = saved

    if (loading || !game.value) return <span />

    const { stretch = {} } = game.value
    const current = Number(props.current)
    const base = `/playlist/${playlistRef}/play/${props.instanceRef}`
    const shared = !!(userProfile.showcase && userProfile.showcase[saveRef])
    const isLast = current + 1 === sequence.length
    const type = game.value.type || 'write'
    const img = type === 'write' ? 'teacherBot.png' : `${type}Image.png`

    return (
      <Block tall>
        <MainLayout
          bodyProps={{ px: 120, w: 1050, mx: 'auto', pb: 'xl' }}
          navigation={[{ category: playlist.title, title: game.value.title }]}
          titleImg={'/animalImages/' + img}>
          <Block align='space-between center' mt={-20} mb>
            <GameButton
              {...gameButton}
              bgColor='green'
              mr
              onClick={context.setUrl(`${base}/${current}`)}>
              <Icon name='keyboard_arrow_left' mr ml={-16} />
              Revise
            </GameButton>
            {isLast ? (
              <GameButton {...gameButton} onClick={context.setUrl('/')}>
                Home
              </GameButton>
            ) : (
              <GameButton
                {...gameButton}
                onClick={context.setUrl(`${base}/${current + 1}`)}>
                Next
                <Icon name='keyboard_arrow_right' ml mr={-16} />
              </GameButton>
            )}
          </Block>
          <Block mb align='start' relative>
            <Tile flex header='Animation'>
              <Image
                src='/animalImages/chaoslarge.png'
                absolute
                top
                bottom
                left={-120}
                m='auto'
                z={2} />
              <Block p column align='center center'>
                <Block
                  relative
                  align='center center'
                  border='1px solid #e0e0e0'>
                  <Block
                    z={2}
                    sq={40}
                    border='30px solid transparent'
                    borderTopColor='red'
                    borderRightColor='red'
                    absolute
                    top
                    right
                    hide={!shared}>
                    <Icon
                      absolute
                      top={-23}
                      right={-23}
                      fs={20}
                      color='white'
                      name='collections' />
                  </Block>
                  {value.animatedGif ? (
                    <Video url={value.animatedGif} />
                  ) : (
                    <Block
                      sq={imageSize}
                      align='center center'
                      bgColor='#FCFCFC'>
                      <Loading
                        wide
                        message='Building Gif Check Back Soon!'
                        position='static'
                        sq='auto' />
                    </Block>
                  )}
                </Block>
                <ShowcaseButton
                  gameRef={gameRef}
                  saveRef={saveRef}
                  shared={shared}
                  pointer
                  py
                  z={1}
                  m />
              </Block>
            </Tile>
          </Block>
          <Block align='start stretch'>
            <Tile header='Challange Badges' flex relative>
              <ResultBadges
                py='l'
                w='85%'
                mx='auto'
                gameType={type}
                stretch={stretch}
                best={value && value.best} />
            </Tile>
          </Block>
          <Block my mx='auto' align='start' relative>
            <Tile flex header='Playlist Badges'>
              <Block p>
                <PlaylistBadges
                  uid={props.uid}
                  playlist={playlist}
                  sequence={sequence} />
              </Block>
            </Tile>
          </Block>
        </MainLayout>
      </Block>
    )
  }
})

/**
 *
 */

const Tile = component({
  render ({ props, children }) {
    const { header, ...rest } = props
    return (
      <Block bg='white' border='1px solid divider' relative {...rest}>
        <Block
          bg='#835584'
          p
          textAlign='center'
          color='white'
          fontFamily='&quot;Press Start 2P&quot;'>
          {header}
        </Block>
        {children}
      </Block>
    )
  }
})

const Video = component({
  render ({ props }) {
    const { url } = props
    return (
      <Block sq={imageSize} relative>
        <video src={url} loop autoPlay height={imageSize} width={imageSize} />
      </Block>
    )
  }
})
