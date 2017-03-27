/**
 * Imports
 */
import CreateModal from 'components/CreateModal'
import {Icon, Image, Text, Avatar} from 'vdux-ui'
import {component, element} from 'vdux'
import {Block} from 'vdux-containers'
import Auth from 'components/Auth'
import Nav from './Nav'

/**
 * App
 */

export default component({
  render ({props, children, context}) {
    const {url, username, isAnonymous, setUrl, signOut, openModal} = context
    const activeRoute = url

    return (
      <Block tall class='app'>
        <Nav {...props} >
          <Block flex>
            <HeaderElement
              text='Home'
              icon='home'
              active={activeRoute === 'featured'}
              handleClick={setUrl('/')} />
            <HeaderElement active={activeRoute === 'search'} onClick={setUrl('/search/games')} text='Search' icon='search' />
            {!isAnonymous && <HeaderElement active={activeRoute === username} onClick={setUrl(`/${username}/gallery`)} text='Profile' image={props.userProfile.photoURL} /> }
            {!isAnonymous && <HeaderElement active={activeRoute === 'create'} onClick={openModal(() => <CreateModal/>)} text='Create' icon='add' /> }
            
          </Block>
          <HeaderElement mb='0' text='Code' icon='link' />
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
  render ({props, children}) {
    const {handleClick, icon, text, image, active, ...restProps} = props
    return (
      <Block
        column
        align='center center'
        my='18px'
        cursor='pointer'
        onClick={handleClick}
        color={active ? '#404040' : '#767676'}
        hoverProps={{color: '#404040'}}
        transition={'all .3s ease-in-out'}
        relative
        {...restProps}>
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
  }
})
