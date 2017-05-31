/**
 * Imports
 */

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
          <Block flex>
            <HeaderElement text='Home' icon='home' url='/featured' />
            <HeaderElement text='Explore' icon='explore' url='/explore' />
            {!isAnonymous && <HeaderElement url={`/${username}/gallery`} text='Profile' image={props.userProfile.photoURL} />}
            <HeaderElement url='/search/games' text='Search' icon='search' />
          </Block>
          <HeaderElement onClick={openModal(() => <CodeLinkModal/>)} mb='0' text='Code' icon='link' />
          {isAnonymous
            ? <HeaderElement text='Log In' onClick={openModal(() => <Auth />)} icon='person_outline' />
            : <HeaderElement text='Log Out' onClick={signOut} icon='exit_to_app' />
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
    const {onClick, url, icon, text, image, ...restProps} = props

    const handleClick = onClick ? onClick : context.setUrl(url)
    const active = rootUrl(context.url) === rootUrl(url)

    return (
      <Block
        column
        align='center center'
        my='18px'
        cursor='pointer'
        color={active ? '#404040' : '#767676'}
        hoverProps={{color: '#404040'}}
        transition={'all .15s ease-in-out'}
        relative
        {...restProps}
        onClick={handleClick}>
        <Block
          display='inline-block'
          bgColor='transparent'
          cursor='pointer'
          align='center center'>
          {image && <Image src={image} sq='40px' margin='auto' circle />}
          {icon && <Icon name={icon} fs='30px' />}
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
