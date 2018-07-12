import { Icon, Block } from 'vdux-containers'
import { Text, Avatar } from 'vdux-ui'
import { component, element } from 'vdux'

export default component({
  render ({ props }) {
    const { isSingleChallenge, type, title, isSandbox, setView, view } = props
    return (
      <Block wide>
        {isSingleChallenge && (
          <Block
            borderBottom='1px solid divider'
            align='start center'
            minHeight='50px'
            px='10'
            h={50}
            wide>
            <Avatar
              src={`/animalImages/${type}Image.png`}
              mr={15}
              display='block'
              borderRadius={0}
              sq={38} />
            <Text
              fontFamily='&quot;Press Start 2P&quot;'
              font-size='13px'
              line-height='15px'
              textTransform='uppercase'>
              {// prettier-ignore
                { read: 'Reading', write: 'Writing', debug: 'Debugging' }[type] || type}
            </Text>
          </Block>
        )}
        {/* {type !== 'read' &&
          type !== 'write' && (
            <Block
              h={46}
              minHeight='46px'
              wide
              align='space-around center'
              px='20'
              borderBottom='1px solid divider'>
              <IconTab
                icon='info_outline'
                name='read'
                setView={setView}
                current={view}
                color='green'
                hide={type !== 'read' && !isSandbox} />
              <IconTab
                icon='grid_on'
                name='grid'
                setView={setView}
                current={view}
                color='green'
                hide={type === 'read'} />
              <IconTab
                icon='description'
                name='info'
                setView={setView}
                current={view}
                color='blue'
                hide={isSandbox} />
              <IconTab
                icon='bug_report'
                name='debugStats'
                setView={setView}
                current={view}
                color='red' />
            </Block>
          )} */}
      </Block>
    )
  }
})

const IconTab = component({
  render ({ props, context }) {
    const { icon, name, setView, current, color = 'blue', ...rest } = props
    const active = name === current

    return (
      <Icon
        p='10'
        userSelect='none'
        color={active ? color : '#BBB'}
        onClick={setView(name)}
        name={icon}
        pointer
        fs='23px'
        {...rest} />
    )
  }
})
