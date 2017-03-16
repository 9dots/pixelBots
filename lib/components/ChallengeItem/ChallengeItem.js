/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import DetailInfo from 'components/DetailInfo'
import {Block, Icon, Image} from 'vdux-ui'
import {component, element} from 'vdux'
import {Text} from 'vdux-containers'
import fire from 'vdux-fire'
import moment from 'moment'

/**
 * <Challenge Item/>
 */

export default fire((props) => ({
  game: `/games/${props.gameRef}/meta`,
  saved: `/saved/${props.saveRef}/meta`
}))(component({
  initialState: {
    hovering: false
  },
  render ({props, children, context, actions, state}) {
    const {game, saved, link, shared, uid} = props
    const {hovering} = state

    if (game.loading || saved.loading) return <IndeterminateProgress />

    const value = {...game.value, ...saved.value}

    const sequence = value.animals
    ? value.animals[0].sequence
    : ''

    return (
      <Block
        onMouseOver={actions.mouseOver}
        onMouseOut={actions.mouseOut}
        wide
        p='1em'
        bgColor='white'
        align='start center'
        borderBottom='1px solid #e0e0e0'>
        <Block mr='14px'>
          <Image sq='40px' src={value.imageUrl} />
        </Block>
        <Block color='#666' column flex>
          <Block mb='4px' align='start start'>
            <Text
              transition='all 0.1s ease-in-out'
              fs='m'
              cursor='pointer'
              hoverProps={{color: 'link', textDecoration: 'underline'}}
              onClick={shared ? context.setUrl(`/${shared}`) : context.setUrl(`/play/${props.gameRef}`)}>
              {value.title}
            </Text>
          </Block>
          <Block wide align='start center'>
            <DetailInfo
              icon='view_headline'
              label={`${value.loc || 0} lines`} />
            <DetailInfo
              icon='gamepad'
              label={`${value.attempts || 0} runs`} />
            <DetailInfo
              icon='date_range'
              label={moment(value.lastEdited).fromNow()} />
            {
            value.likes > 0 && <DetailInfo
              icon='favorite'
              label={value.likes} />
          }
          </Block>
        </Block>
        {children}
      </Block>
    )
  },
  reducer: {
  	mouseOver: (state) => ({hovering: true}),
  	mouseOut: (state) => ({hovering: false})
  }
}))
