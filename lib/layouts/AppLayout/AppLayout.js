/**
 * Imports
 */
import CreateModal from 'components/CreateModal'
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
            {!isAnonymous &&
              <Block>
                <HeaderElement active={activeRoute === username} onClick={setUrl(`/${username}/gallery`)} text='Profile' icon='dashboard' />
                <HeaderElement active={activeRoute === 'create'} onClick={openModal(() => <CreateModal/>)} text='Create' icon='add' />
              </Block>
            }
          </Block>
          <HeaderElement mb='0' text='Code' icon='link' />
          {isAnonymous
            ? <HeaderElement text='Sign In' onClick={openModal(() => <Auth />)} icon='person_outline' />
            : <HeaderElement text='Sign Out' onClick={signOut} icon='exit_to_app' />
           }
        </Nav>
        <Block id='top' tall relative left='80px' w='calc(100% - 80px)' overflowY='auto'>
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
          {image && <Image src={image} sq='50px' margin='auto' />}
          {icon && <Icon name={icon} fs='30px' />}
        </Block>
        {text && <Text mt='8px' fs='xxs' fontWeight='600'>{text}</Text>}
        {children}
      </Block>
    )
  }
})
