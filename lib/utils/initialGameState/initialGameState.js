/**
 * Imports
 */

import {blackAndWhite} from 'utils/palette'

/**
 * initialGameState
 */

export default ({
  type: 'write',
  runners: null,
  title: 'Untitled',
  description: 'Use code to draw the image.',
  inputType: 'icons',
  levelSize: [5, 5],
  painted: {},
  selected: [],
  targetPainted: {},
  initialPainted: {},
  initialData: {},
  saveRef: null,
  solution: null,
  solutionSteps: null,
  saveRef: null,
  imageUrl: '/animalImages/teacherBot.png',
  editorState: [],
  activeLine: 0,
  cursor: 0,
  active: 0,
  advanced: null,
  steps: 0,
  speed: 1,
  frames: [],
  palette: blackAndWhite,
  capabilities: {
    paint: [true],
    block_end: true
  },
  animals: [{
    type: 'penguin',
    sequence: [],
    initial: {
      location: [4, 0],
      dir: 0,
      rot: 0
    },
    current: {
      location: [4, 0],
      dir: 0,
      rot: 0
    }
  }]
})
