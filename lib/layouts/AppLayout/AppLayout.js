/**
 * Imports
 */

import JoinClassModal from 'components/JoinClassModal'
import CodeLinkModal from 'components/CodeLink'
import {Icon, Image, Text} from 'vdux-ui'
import {component, element} from 'vdux'
import {Block} from 'vdux-containers'
import Auth from 'components/Auth'
import Nav from './Nav'

/**
 * App
 */

export default component({
  render ({props, children, context}) {
    const {username, isAnonymous, signOut, openModal} = context

    return (
      <Block tall class='app'>
        <Nav {...props} >
          <Block flex wide>
            {
              isAnonymous
                ? <HeaderElement color='red' text='Log In' onClick={openModal(() => <Auth />)} icon='person' />
                : <HeaderElement text='Home' color='red' icon='home' url='/' />
            }
            <HeaderElement text='Courses' color='blue' icon='class' url='/courses' />
            {
              !isAnonymous &&
                <HeaderElement url={`/${username}/gallery`} text='Profile' image={props.userProfile.photoURL}/>
            }
            <HeaderElement color='green' url='/search/playlists' text='Search' icon='search' />
          </Block>
          <HeaderElement onClick={openModal(() => <CodeLinkModal/>)} text='Code' icon='link' />
          {
            !isAnonymous
              && <Block>
              <HeaderElement onClick={openModal(() => <JoinClassModal/>)} text='Join Class' icon='school' />
              <HeaderElement text='Log Out' mt={0} onClick={signOut} icon='exit_to_app' />
            </Block>

          }
        </Nav>
        <Block id='top' tall relative left='70px' w='calc(100% - 70px)' overflowY='auto'>
          {children}
        </Block>
      </Block>
    )
  }
})

const HeaderElement = component({
  render ({props, children, context}) {
    const {onClick, url, icon, text, image, color, ...restProps} = props

    const handleClick = onClick ? onClick : context.setUrl(url)
    const active = rootUrl(context.url) === rootUrl(url)

    return (
      <Block
        column
        align='center center'
        mx={6}
        my={4}
        py={6}
        cursor='pointer'
        transition={'all .1s ease-in-out'}
        opacity={active ? 1 : .77}
        hoverProps={{opacity: 1}}
        color='#404040'
        relative
        {...restProps}
        onClick={handleClick}>
        <Block
          display='inline-block'
          bgColor='transparent'
          cursor='pointer'

          align='center center'>
          {image && <Image src={image} circle='36px' margin='auto' />}
          {icon && <Icon color={color || 'inherit'} name={icon} fs='30px' />}
        </Block>
        {text && <Text mt='8px' fs='xxs' fontWeight='600'>{text}</Text>}
        {children}
      </Block>
    )

    function rootUrl(url) {
      return url && url.replace(/^\/([^\/]*).*$/, '$1')
    }
  }
})
