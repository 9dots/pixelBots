const { levelThumb } = require('../utils/createImage')
const { upload } = require('../utils/storage')

const game = {
  name: '-KYVzT0rUWN3JhxeR_Mr',
  gridSize: 6,
  targetPainted: {
    '1,1': 'lightBlue',
    '1,2': 'lightBlue',
    '1,3': 'lightBlue',
    '1,4': 'green',
    '2,1': 'lightBlue',
    '2,4': 'lightBlue',
    '3,1': 'lightBlue',
    '3,4': 'lightBlue',
    '4,1': 'lightBlue',
    '4,2': 'lightBlue',
    '4,3': 'lightBlue',
    '4,4': 'lightBlue'
  },
  dir: '',
  palette: [
    { name: 'pink', value: '#e91e63' },
    { name: 'purple', value: '#9c27b0' },
    { name: 'deepPurple', value: '#673ab7' },
    { name: 'indigo', value: '#3f51b5' },
    { name: 'blue', value: '#2196f3' },
    { name: 'lightBlue', value: '#03a9f4' },
    { name: 'cyan', value: '#00bcd4' },
    { name: 'teal', value: '#009688' },
    { name: 'green', value: '#4caf50' },
    { name: 'lightGreen', value: '#8bc34a' },
    { name: 'lime', value: '#cddc39' },
    { name: 'yellow', value: '#ffeb3b' },
    { name: 'amber', value: '#ffc107' },
    { name: 'orange', value: '#ff9800' },
    { name: 'deepOrange', value: '#ff5722' },
    { name: 'brown', value: '#795548' },
    { name: 'grey', value: '#9e9e9e' },
    { name: 'blueGrey', value: '#607d8b' },
    { name: 'black', value: '#000000' },
    { name: 'white', value: '#FFFFFF' }
  ]
}

levelThumb(game.name, game.gridSize, game.targetPainted, game.dir, game.palette)
  .then(upload)
  .catch(console.error)
