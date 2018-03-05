/**
 * Imports
 */

import colors, { blackAndWhite } from 'utils/palette'

/**
 * initialGameState
 */

const initialGameState = {
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
  imageUrl: '/animalImages/teacherBot.png',
  editorState: [],
  docs: {},
  activeLine: 0,
  loops: {},
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
  animals: [
    {
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
    }
  ]
}

const sandboxCapabilites = {
  block_end: true,
  down: [true],
  draw: [true],
  faceNorth: true,
  forward: [true],
  frameOf: [true],
  setFrameRate: [true],
  left: [true],
  moveTo: [true, true],
  paint: [true],
  repeat: [true],
  right: [true],
  turnLeft: true,
  turnRight: true,
  up: [true],
  rand: [true, true]
}

const initialSandboxState = {
  ...initialGameState,
  animals: [
    {
      type: 'penguin',
      sequence: 'draw(() => {\n\t\n})',
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
    }
  ],
  speed: 1.9,
  imageUrl: '/animalImages/projectImage.png',
  inputType: 'code',
  title: null,
  description: null,
  type: 'sandbox',
  advanced: false,
  capabilities: sandboxCapabilites,
  palette: colors
}

/**
 * Exports
 */

export default initialGameState
export { initialSandboxState }
