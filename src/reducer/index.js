import {combineReducers} from 'redux'
import gameReducer from './game'
import mainReducer from './main'

export default combineReducers({
	game: gameReducer,
	main: mainReducer
})