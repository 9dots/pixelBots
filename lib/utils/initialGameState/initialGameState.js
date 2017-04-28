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
  editorState: [],
  activeLine: 0,
  cursor: 0,
  active: 0,
  steps: 0,
  speed: 1,
  frames: [],
  animals: [{
    type: 'zebra',
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
