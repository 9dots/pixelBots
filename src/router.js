// /** @jsx element */
//
// import {initializeApp, createNew, refresh, setToast, setModalMessage} from './actions'
// import HeaderElement from './components/HeaderElement'
// import PrintContainer from './pages/PrintContainer'
// import handleActions from '@f/handle-actions'
// import {setUrl} from 'redux-effects-location'
// import CodeLink from './components/CodeLink'
// import {Block, Text, Toast} from 'vdux-ui'
// import {signOut} from './middleware/auth'
// import Transition from 'vdux-transition'
// import Header from './components/Header'
// import HomePage from './pages/Explore'
// import isPromise from '@f/is-promise'
// import Auth from './components/Auth'
// import element from 'vdux/element'
// import enroute from 'enroute'
// import fire from 'vdux-fire'
//
// import createAction from '@f/create-action'
//
// const startLogin = createAction('START_LOGIN')
// const endLogin = createAction('END_LOGIN')
// const newRoute = createAction('<router/>: NEW_ROUTE')
//
// const initialState = ({props, local}) => ({
//   loggingIn: false,
//   route: <HomePage tab='featured'/>,
//   actions: {
//     newRoute: local(newRoute)
//   }
// })
//
// function loadRoute (promise, props) {
//   return new Promise((resolve, reject) => {
//     promise.then((module) => resolve(element(module.default, props)))
//   })
// }
//
// const router = enroute({
//   '/featured': () => loadRoute(
//     System.import('./pages/Explore'),
//     {tab: 'featured'}
//   ),
//   '/featured/:project': ({project}) => loadRoute(
//     System.import('./pages/Explore'),
//     {tab: 'featured', project}
//   ),
//   '/games/:gameID': ({gameID}, props) => (
//     loadRoute(
//       System.import('./pages/GameLoader'),
//       {...props, left: '60px', noSave: true, gameCode: gameID}
//     )
//   ),
//   '/create/:draftID': ({draftID, step}, props) => (
//     loadRoute(
//       System.import('./pages/Create.js'),
//       {...props, mine: true, new: true, left: '60px', draftID}
//     )
//   ),
//   '/create/:draftID/:step': (params, props) => (
//     loadRoute(
//       System.import('./pages/Create'),
//       {...props, ...params, mine: true, new: true, left: '60px'}
//     )
//   ),
//   '/search': (params, props) => (
//     loadRoute(
//       System.import('./pages/SearchPage'),
//       {user: props.user}
//     )
//   ),
//   '/search/:searchType': ({searchType}, props) => (
//     loadRoute(
//       System.import('./pages/SearchPage'),
//       {user: props.user, searchType}
//     )
//   ),
//   '/search/:searchType/:searchQ': (params, props) => (
//     loadRoute(
//       System.import('./pages/SearchPage'),
//       {user: props.user, ...params}
//     )
//   ),
//   '/:username/:activity': (params, props) => (
//     loadRoute(
//       System.import('./pages/ProfileLoader'),
//       {...params, currentUser: props.user}
//     )
//   ),
//   '/edit/:draftID/:step': (params, props) => (
//     loadRoute(
//       System.import('./pages/Create'),
//       {mine: true, left: '60px', ...params, ...props}
//     )
//   ),
//   '/edit/:draftID': (params, props) => (
//     loadRoute(
//       System.import('./pages/Create'),
//       {mine: true, left: '60px', ...params, ...props}
//     )
//   ),
//   '/playlist/:playlistID': ({playlistID, username}, props) => (
//     loadRoute(
//       System.import('./pages/PlaylistView'),
//       {activeKey: playlistID, uid: props.user.uid}
//     )
//   ),
//   '/:link': (params, props) => (
//     loadRoute(
//       System.import('./pages/LinkDecipher'),
//       {...params, ...props}
//     )
//   ),
//   '*': homePage
// })
//
// function homePage (params, props) {
//   return <HomePage {...props} />
// }
//
// function onCreate () {
//   return initializeApp()
// }
//
// function * onUpdate (prev, next) {
//   if (prev.props.url !== next.props.url) {
//     const result = router(next.props.url, next.props)
//     const module = isPromise(result)
//       ? yield result
//       : result
//     yield next.state.actions.newRoute(module)
//   }
// }
//
// function render ({props, state, local}) {
//   const {loggingIn, route} = state
//   const {message, url, toast, user, username} = props
//   const activeRoute = url.split('/')[1]
//
//   console.log(route)
//
//   return (
//     <Block>
//       <PrintContainer code={!!props.game && props.game.animals[0].sequence}/>
//       <Header w='90px' bgColor='primary' top='0' left='0'>
//         <Block flex>
//           <HeaderElement
//             text='Home'
//             icon='home'
//             active={activeRoute === 'featured'}
//             handleClick={[() => setUrl('/'), refresh]}/>
//           <HeaderElement active={activeRoute === 'search'} onClick={() => setUrl('/search/games')} text='Search' icon='search'/>
//           {(user && !user.isAnonymous) &&
//             <Block>
//               <HeaderElement active={activeRoute === username} onClick={() => setUrl(`/${username}/playlists`)} text='Your Stuff' icon='dashboard'/>
//               <HeaderElement active={activeRoute === 'create'} onClick={() => createNew(user.uid)} text='Create' icon='add'/>
//             </Block>
//           }
//         </Block>
//         <HeaderElement onClick={() => setModalMessage(<CodeLink/>)} mb='0' text='Code' icon='link'/>
//         {!user || user.isAnonymous
//           ? <HeaderElement handleClick={local(startLogin)} text='Sign In' icon='person_outline'/>
//           : <HeaderElement handleClick={signOut} text='Sign Out' icon='exit_to_app'/>
//         }
//       </Header>
//       <Block class='action-bar-holder' overflowY='auto' relative left='90px' column align='start' minHeight='100%' w='calc(100% - 90px)' h='100vh'>
//       {
//         (url && user) && route
//       }
//       </Block>
//       {
//         message && message
//       }
//       {
//         loggingIn && <Auth handleDismiss={local(endLogin)}/>
//       }
//       <Transition>
//         {toast !== '' && <Toast
//           fixed
//           minHeight='none'
//           w='200px'
//           textAlign='center'
//           bgColor='#333'
//           color='white'
//           top='none'
//           bottom='8px'
//           key='0'
//           onDismiss={() => setToast('')}>
//           <Text>{toast}</Text>
//         </Toast>}
//       </Transition>
//     </Block>
//   )
// }
//
// const reducer = handleActions({
//   [startLogin.type]: (state) => ({...state, loggingIn: true}),
//   [endLogin.type]: (state) => ({...state, loggingIn: false}),
//   [newRoute.type]: (state, route) => ({...state, route})
// })
//
// export default {
//   initialState,
//   onUpdate,
//   reducer,
//   onCreate,
//   render
// }
