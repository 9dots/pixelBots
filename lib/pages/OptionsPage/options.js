import { Text } from 'vdux-ui'
import { element } from 'vdux'

const paints = [
  'paint',
  'paint O',
  'paint I',
  'paint S',
  'paint Z',
  'paint L',
  'paint J',
  'paint T'
]

const structural = [
  {
    key: 'ifStatement',
    label: (
      <span>
        Conditional Statements <Text fontFamily='monospace'>(if)</Text>
      </span>
    )
  },
  {
    key: 'ifColor'
  },
  {
    key: 'repeat',
    label: (
      <span>
        Loops <Text fontFamily='monospace'>(repeat)</Text>
      </span>
    )
  },
  {
    key: 'createFunction',
    label: 'Create Functions'
  }
]

const animations = [
  'draw',
  'frameOf',
  'frameVar',
  'setFrameRate',
  'setNumFrames',
  'rand'
]
const turning = ['turnLeft', 'turnRight', 'faceNorth']
const movements = ['up', 'down', 'left', 'right', 'forward']

export { paints, turning, movements, structural, animations }
