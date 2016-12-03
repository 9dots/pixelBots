import {combineReducers} from 'redux'
import gameReducer from './game'
import mainReducer from './main'
import editorReducer from './editor'

export default combineReducers({
	game: gameReducer,
	editor: editorReducer,
	main: mainReducer
})