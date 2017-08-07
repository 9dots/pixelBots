/**
 * Imports
 */

import {Avatar, Block, Icon, Box, Text} from 'vdux-ui'
import Badge from 'components/Badge'
import {component, element} from 'vdux'

/**
 * <Main Layout/>
 */

export default component({
  render ({props, children}) {
    const {
      title,
      titleImg,
      imgRounded,
      titleActions,
      navigation = [],
      titleProps,
      bodyProps,
      badges = {}
    } = props

    return (
      <Block column wide tall>
        <Box relative wide color='#767676' fontWeight='800'>
          <Block p='16px 20px' align='start center' flex {...titleProps}>
            {titleImg &&
                <Block relative bgColor='white'>
                  <Avatar display='block' sq='50' src={titleImg} borderRadius={imgRounded ?  '9999px': 0} />
                  <Block border='1px solid rgba(0,0,0,.0975)' absolute top left sq='100%' circle={imgRounded}/>
                </Block>
            }
            <Block align='start center' flex relative ml='1em'>
              {navigation.filter((nav) => !!nav).map(({category, title, onClick}, i, arr) => (
                <Block align='start center'>
                  <Block
                    onClick={!!onClick && onClick}
                    cursor={onClick ? 'pointer' : 'default'}
                    column
                    align='start start'>
                    {
                      category && <Text
                        display='block'
                        fontWeight='300'
                        fontFamily='"Press Start 2P"'
                        fs='xs' mb='s'>{category.toUpperCase()}
                      </Text>
                    }
                    <Text
                      display='block'
                      fontWeight='500'
                      fs='l'>
                      {title}
                    </Text>
                  </Block>
                  {i < arr.length - 1 && <Icon fs='l' mx='1em' name='keyboard_arrow_right' />}
                </Block>
              ))}
              {
                badges.length
                  ? <Block align='start center' ml>
                      {
                        badges.map((badge) => <MiniBadge badge={badge} />)
                      }
                    </Block>
                  : <span />
              }
            </Block>
            {titleActions}
          </Block>
        </Box>
        <Box flex wide py='8px' {...bodyProps}>
          {children}
        </Box>
      </Block>
    )
  }
})

const MiniBadge = component({
  render({props}) {
    const {badge} = props
    const {type, limit, earned} = badge

    if(!type) return <span/> 
    
    const noun = type.split(/(?=[A-Z])/)[0] + (limit === 1 ? '' : 's')
    const message = type === 'completed'
      ? 'Finish to earn this badge.'
      : `Finish in ${limit} ${noun} or under`

    return (
      <Badge tooltipProps={{placement: 'bottom'}} type={type} hideTitle size={40} effects={false} description={message} ml count={earned ? 1 : 0} />
    )
  }
})
