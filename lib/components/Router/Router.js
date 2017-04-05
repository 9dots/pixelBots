/**
 * Imports
 */
import LinkDecipher from 'components/LinkDecipher'
import PlaylistView from 'pages/PlaylistView'
import ProjectPage from 'pages/ProjectPage'
import Redirect from 'components/Redirect'
import AppLayout from 'layouts/AppLayout'
import SearchPage from 'pages/SearchPage'
import {component, element} from 'vdux'
import Playlist from 'pages/Playlist'
import Explore from 'pages/Explore'
import Profile from 'pages/Profile'
import Create from 'pages/Create'
import Game from 'pages/Game'
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
    <Game {...params} {...props}/>
  </AppLayout>,
  '/play/:gameRef/finished': (params, props) => <AppLayout {...params} {...props}>
    <Game {...params} {...props} finished/>
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
  '/404': (params, props) => <AppLayout {...props}>
    <div> Page Not Found </div>
  </AppLayout>,
  '/:profileName/:category': (params, props) => <AppLayout {...params} {...props} >
    <Profile {...params} {...props} />
  </AppLayout>,
  '/:profileName/:category/:subcategory': (params, props) => <AppLayout {...params} {...props} >
    <Profile {...params} {...props} />
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
    return (
      router(context.url, props)
    )
  }
})
