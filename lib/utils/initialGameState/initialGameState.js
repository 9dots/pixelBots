export default ({
	permissions: ['Run Button', 'Edit Code'],
  runners: null,
  title: 'Untitled',
  description: 'Use code to draw the image.',
  inputType: 'icons',
  levelSize: [5, 5],
  painted: {},
  selected: [],
  targetPainted: {},
  initialPainted: {},
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
      location: [0, 0],
      dir: 0,
      rot: 0
    },
    current: {
      location: [0, 0],
      dir: 0,
      rot: 0
    }
  }]
})
