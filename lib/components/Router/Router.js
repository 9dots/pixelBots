/**
 * Imports
 */

import LinkDecipher from 'components/LinkDecipher'
import PlaylistView from 'pages/PlaylistView'
import ProjectPage from 'pages/ProjectPage'
import Redirect from 'components/Redirect'
import AppLayout from 'layouts/AppLayout'
import SearchPage from 'pages/SearchPage'
import GameLoader from 'components/GameLoader'
import ImagePicker from 'components/ImagePicker'
import {component, element} from 'vdux'
import Playlist from 'pages/Playlist'
import Explore from 'pages/Explore'
import Profile from 'pages/Profile'
import Create from 'pages/Create'
import Docs from 'pages/Docs'
import {Block} from 'vdux-ui'
import enroute from 'enroute'

/**
 * <Router/>
 */

const router = enroute({
  '/featured': (params, props) => <AppLayout {...params} {...props}>
    <Explore tab='featured' {...props} />
  </AppLayout>,
  '/featured/:project': (params, props) => <AppLayout {...params} {...props}>
    <Explore tab='featured' project={params.project} {...props} {...params} />
  </AppLayout>,
  '/search': (params, props) => <AppLayout {...params} {...props}>
    <SearchPage />
  </AppLayout>,
  '/search/:searchType': (params, props) => <AppLayout {...params} {...props}>
    <SearchPage {...params} />
  </AppLayout>,
  '/search/:searchType/:searchQ': (params, props) => <AppLayout {...params} {...props}>
    <SearchPage {...params} />
  </AppLayout>,
  '/create/:draftID': ({draftID, step}, props) => <AppLayout {...props}>
    <Create new draftID={draftID} {...props} />
  </AppLayout>,
  '/create/:draftID/:step': ({draftID, step}, props) => <AppLayout {...props}>
    <Create new draftID={draftID} step={step} {...props} />
  </AppLayout>,
  '/edit/:draftID/:step': ({draftID, step}, props) => <AppLayout {...props}>
    <Create draftID={draftID} step={step} {...props} />
  </AppLayout>,
  '/edit/:draftID': ({draftID, step}, props) => <AppLayout {...props}>
    <Create left='60px' draftID={draftID} {...props} />
  </AppLayout>,
  '/games/:gameRef': (params, props) => <AppLayout {...params} {...props} >
    <ProjectPage gameRef={params.gameRef} {...params} {...props} />
  </AppLayout>,
  '/play/:gameRef': (params, props) => <AppLayout {...params} {...props}>
    <GameLoader {...params} {...props} />
  </AppLayout>,
  '/play/:gameRef/finished/:saveRef': (params, props) => <AppLayout {...params} {...props}>
    <GameLoader {...params} {...props} finished />
  </AppLayout>,
  '/playlist/:activeKey': (params, props) => <AppLayout {...params} {...props} >
    <PlaylistView {...params} {...props} />
  </AppLayout>,
  '/playlist/:playlistRef/:current/:gameRef': (params, props) => <AppLayout {...params} {...props}>
    <ProjectPage {...params} {...props}/>
  </AppLayout>,
  '/playSequence/:listID': ({listID}, props) => <AppLayout {...props} >
    <Playlist {...props} playlistRef={listID} ref='nothing' />
  </AppLayout>,
  '/docs': (params, props) => <Docs />,
  '/404': (params, props) => <AppLayout {...props}>
    <Block align='center center' p='xl' fs='l' fontFamily='"Press Start 2P"'>
      Page Not Found
    </Block>
  </AppLayout>,
  '/:profileName/:category': (params, props) => <AppLayout {...params} {...props} >
    <Profile key={params.profileName} {...params} {...props} />
  </AppLayout>,
  '/:profileName/:category/:subcategory': (params, props) => <AppLayout {...params} {...props} >
    <Profile key={params.profileName} {...params} {...props} />
  </AppLayout>,
  '/:link': (params, props) => <AppLayout {...params} {...props} >
    <LinkDecipher link={params.link} {...props}/>
  </AppLayout>,
  '*': (params, props) => <AppLayout {...params} {...props}>
    <Explore tab='featured' {...props} />
  </AppLayout>
})

export default component({
  render ({props, context}) {
    const {isAnonymous} = context
    const userProfile = props.userProfile || {}
    const {bot} = userProfile
    return !isAnonymous && !bot
      ? <AppLayout {...props} >
          <ImagePicker/>
        </AppLayout>
      : router(context.url, props)
  }
})
