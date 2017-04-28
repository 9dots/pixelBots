import filter from '@f/filter'

const filterValues = ['white', '#FFF', '#FFFFFF']

export default (grid) => filter((val) => (
	!!val && filterValues.indexOf(val) === -1
), grid)