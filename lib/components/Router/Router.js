/**
 * Imports
 */

import ChallengeLoader from '../ChallengeLoader/ChallengeLoader'
import ChallengeResults from 'pages/ChallengeResults'
import PixelGradient from 'components/PixelGradient'
import LinkDecipher from 'components/LinkDecipher'
import ImagePicker from 'components/ImagePicker'
import AnimationView from 'pages/AnimationView'
import GameLoader from 'components/GameLoader'
import PlaylistView from 'pages/PlaylistView'
import SchoolSignIn from 'pages/SchoolSignIn'
import SandboxView from 'pages/SandboxView'
import Redirect from 'components/Redirect'
import CoursePage from 'pages/CoursePage'
import AppLayout from 'layouts/AppLayout'
import SearchPage from 'pages/SearchPage'
import { component, element } from 'vdux'
import NotFound from 'pages/NotFound'
import Progress from 'pages/Progress'
import Playlist from 'pages/Playlist'
import Explore from 'pages/Explore'
import Profile from 'pages/Profile'
import Privacy from 'pages/Privacy'
import Create from 'pages/Create'
import parseQs from '@f/parse-qs'
import Terms from 'pages/Terms'
import Docs from 'pages/Docs'
import { Block } from 'vdux-ui'
import enroute from 'enroute'

/**
 * <Router/>
 */

const router = enroute({
  '/': track('Home', (params, props) => (
    <AppLayout {...params} {...props}>
      {props.isAnonymous ? (
        <Redirect to='/courses' />
      ) : (
        <Progress {...props} {...params} />
      )}
    </AppLayout>
  )),
  '/courses': track('Courses', (params, props) => (
    <AppLayout {...params} {...props}>
      <Explore {...props} />
    </AppLayout>
  )),
  '/terms': track('Terms', (params, props) => (
    <AppLayout {...params} {...props}>
      <Terms {...props} />
    </AppLayout>
  )),
  '/privacy': track('Privacy', (params, props) => (
    <AppLayout {...params} {...props}>
      <Privacy {...props} />
    </AppLayout>
  )),
  '/course/:course': track('Course Details', (params, props) => (
    <AppLayout {...params} {...props}>
      <CoursePage course={params.course} {...props} {...params} />
    </AppLayout>
  )),
  '/search': track('Search', (params, props) => (
    <AppLayout {...params} {...props}>
      <SearchPage />
    </AppLayout>
  )),
  '/game/:gameRef': track('Challenge Preview', (params, props) => (
    <GameLoader {...params} isSingleChallenge />
  )),
  '/game/:gameRef/instance/:saveRef': track(
    'Challenge Instance',
    (params, props) => <GameLoader {...params} isSingleChallenge />
  ),
  '/game/:gameRef/instance/:saveRef/results': track(
    'Challenge Results',
    (params, props) => <ChallengeResults {...params} isSingleChallenge />
  ),
  '/search/:searchType': track('Search Results', (params, props) => (
    <AppLayout {...params} {...props}>
      <SearchPage {...params} />
    </AppLayout>
  )),
  '/search/:searchType/:searchQ': track('Search Results', (params, props) => (
    <AppLayout {...params} {...props}>
      <SearchPage {...params} />
    </AppLayout>
  )),
  '/create/:draftID': track('Create Challenge', ({ draftID, step }, props) => (
    <AppLayout {...props}>
      <Create new draftID={draftID} {...props} />
    </AppLayout>
  )),
  '/create/:draftID/:step': track(
    'Create Challenge',
    ({ draftID, step }, props) => (
      <AppLayout {...props}>
        <Create new draftID={draftID} step={step} {...props} />
      </AppLayout>
    )
  ),
  '/edit/:draftID/:step': track(
    'Edit Challenge',
    ({ draftID, step }, props) => (
      <AppLayout {...props}>
        <Create draftID={draftID} step={step} {...props} />
      </AppLayout>
    )
  ),
  '/edit/:draftID': track('Edit Challenge', ({ draftID, step }, props) => (
    <AppLayout {...props}>
      <Create left='60px' draftID={draftID} {...props} />
    </AppLayout>
  )),
  '/playlist/:playlistRef': track('Playlist View', (params, props) => (
    <AppLayout {...params} {...props}>
      <Redirect to={`/playlist/${params.playlistRef}/view`} />
    </AppLayout>
  )),
  '/playlist/:playlistRef/:editable': track(
    'Playlist View',
    (params, props) => (
      <AppLayout {...params} {...props}>
        <PlaylistView {...params} {...props} />
      </AppLayout>
    )
  ),
  '/sandbox/:sandboxRef': track('Animation View', (params, props) => (
    <AppLayout {...params} {...props}>
      <Redirect to={`/sandbox/${params.sandboxRef}/view`} />
    </AppLayout>
  )),
  '/sandbox/:sandboxRef/:editable': track('Sandbox Mode', (params, props) => (
    <AppLayout {...params} {...props}>
      {params.editable === 'edit' &&
      props.userProfile &&
      params.sandboxRef in props.userProfile.sandbox ? (
          <SandboxView {...params} {...props} />
        ) : params.editable === 'view' ? (
          <AnimationView {...params} {...props} />
        ) : (
          <Redirect to={`/sandbox/${params.sandboxRef}/view`} />
        )}
    </AppLayout>
  )),
  '/activity/:playlistRef/instance/:instanceRef': track(
    'Playlist Play',
    (params, props) => (
      <AppLayout {...props}>
        <Playlist {...props} {...params} />
      </AppLayout>
    )
  ),
  '/activity/:playlistRef/instance/:instanceRef/:current': track(
    'Playlist Play',
    (params, props) => (
      <AppLayout {...props}>
        <Playlist {...props} {...params} />
      </AppLayout>
    )
  ),
  '/activity/:playlistRef/instance/:instanceRef/:current/:subpage': track(
    'Playlist Play',
    (params, props) => (
      <AppLayout {...props}>
        <Playlist {...props} {...params} />
      </AppLayout>
    )
  ),
  '/activity/:playlistRef/:current': track('Playlist Play', (params, props) => (
    <AppLayout {...props}>
      <Playlist {...props} {...params} />
    </AppLayout>
  )),
  '/activity/:playlistRef/:current/:subpage': track(
    'Playlist Play',
    (params, props) => (
      <AppLayout {...props}>
        <Playlist {...props} {...params} />
      </AppLayout>
    )
  ),
  '/schools/:schoolId': track('Student Log In', (params, props) => (
    <PixelGradient animate fixed sq='100%' {...props} {...params}>
      <SchoolSignIn {...props} {...params} />
    </PixelGradient>
  )),
  '/schools/:schoolId/:classId': track(
    'Student Log In: Class',
    (params, props) => (
      <PixelGradient animate fixed sq='100%' {...props} {...params}>
        <SchoolSignIn {...props} {...params} />
      </PixelGradient>
    )
  ),
  '/docs': track('Docs', (params, props) => <Docs />),
  '/404': track('404', (params, props) => (
    <AppLayout {...props}>
      <NotFound />
    </AppLayout>
  )),
  '/:profileName/:category': track('Profile', (params, props) => (
    <AppLayout {...params} {...props}>
      <Profile key={params.profileName} {...params} {...props} />
    </AppLayout>
  )),
  '/:profileName/:category/:subcategory': track('Profile', (params, props) => (
    <AppLayout {...params} {...props}>
      <Profile key={params.profileName} {...params} {...props} />
    </AppLayout>
  )),
  // Student Sign In
  '/:link': track('Short Code', (params, props) => (
    <AppLayout {...params} {...props}>
      <LinkDecipher link={params.link} {...props} />
    </AppLayout>
  )),
  '*': track('Default', (params, props) => (
    <AppLayout {...params} {...props}>
      <Explore tab='featured' {...props} />
    </AppLayout>
  ))
})

function track (name, route) {
  return (params, props) => ({
    name: typeof name === 'function' ? name(params, props) : name,
    params,
    props,
    route: route(params, props)
  })
}

export default component({
  * onCreate ({ props, context }) {
    const { name, params } = router(props.url, { ...props, uid: context.uid })
    yield context.page({ name, params })
  },
  render ({ props, context }) {
    const { isAnonymous } = context
    const userProfile = props.userProfile || {}
    const { bot } = userProfile

    const [path, query] = context.url.split('?')
    const qparams = parseQs(query)
    const route = router(path, { ...qparams, ...props, uid: context.uid })

    return !isAnonymous && !bot ? (
      <AppLayout {...props}>
        <Block fixed top left zIndex={9999}>
          <ImagePicker />
        </Block>
      </AppLayout>
    ) : (
      route.route || route
    )
  },
  * onUpdate (prev, next) {
    const { context } = next

    if (prev.props.url !== next.props.url) {
      const [path, query] = next.props.url.split('?')
      const qparams = parseQs(query)
      const { name, params } = router(path, {
        ...qparams,
        ...next.props,
        uid: context.uid
      })
      yield context.page({ name, params })
    }
  }
})
