/**
 * Imports
 */

import LinkDecipher from 'components/LinkDecipher'
import ImagePicker from 'components/ImagePicker'
import GameLoader from 'components/GameLoader'
import PlaylistView from 'pages/PlaylistView'
import Redirect from 'components/Redirect'
import CoursePage from 'pages/CoursePage'
import AppLayout from 'layouts/AppLayout'
import SearchPage from 'pages/SearchPage'
import {component, element} from 'vdux'
import NotFound from 'pages/NotFound'
import Progress from 'pages/Progress'
import Playlist from 'pages/Playlist'
import Explore from 'pages/Explore'
import Profile from 'pages/Profile'
import Create from 'pages/Create'
import parseQs from '@f/parse-qs'
import Docs from 'pages/Docs'
import {Block} from 'vdux-ui'
import enroute from 'enroute'

/**
 * <Router/>
 */

const router = enroute({
  '/': (params, props) => <AppLayout {...params} {...props}>
    {
      props.isAnonymous
        ? <Redirect to='/courses' />
        : <Progress {...props} {...params} />
    }
  </AppLayout>,
  '/courses': (params, props) => <AppLayout {...params} {...props}>
    <Explore {...props} />
  </AppLayout>,
  '/course/:course': (params, props) => <AppLayout {...params} {...props}>
    <CoursePage course={params.course} {...props} {...params} />
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
  '/play/:gameRef': (params, props) => <AppLayout {...params} {...props}>
    <GameLoader {...params} {...props} />
  </AppLayout>,
  '/play/:gameRef/finished/:saveRef': (params, props) => <AppLayout {...params} {...props}>
    <GameLoader {...params} {...props} finished />
  </AppLayout>,
  '/playlist/:playlistRef': (params, props) => <AppLayout {...params} {...props} >
    <Redirect to={`/playlist/${params.playlistRef}/view`} />
  </AppLayout>,
  '/playlist/:playlistRef/:editable': (params, props) => <AppLayout {...params} {...props} >
    <PlaylistView {...params} {...props} />
  </AppLayout>,
  '/playlist/:playlistRef/play/:instanceRef/:current': (params, props) => <AppLayout {...props} >
    <Playlist {...props} {...params}/>
  </AppLayout>,
  '/playlist/:playlistRef/play/:instanceRef/:current/:subpage': (params, props) => <AppLayout {...props} >
    <Playlist {...props} {...params}/>
  </AppLayout>,
  '/docs': (params, props) => <Docs />,
  '/404': (params, props) => <AppLayout {...props}>
    <NotFound />
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

    const [path, query] = context.url.split('?')
    const qparams = parseQs(query)

    return !isAnonymous && !bot
      ? <AppLayout {...props} >
          <Block fixed top left zIndex={9999}>
            <ImagePicker />
          </Block>
        </AppLayout>
      : router(path, {...qparams, ...props, uid: context.uid})
  }
})
