import {component, element} from 'vdux'
import nameToColor from 'utils/nameToColor'
import nameToIcon from 'utils/nameToIcon'
import TetrisL from './TetrisL'
import TetrisJ from './TetrisJ'
import TetrisI from './TetrisI'
import TetrisO from './TetrisO'
import TetrisS from './TetrisS'
import TetrisZ from './TetrisZ'
import TetrisT from './TetrisT'
import {Icon} from 'vdux-ui'

export default component ({
  render ({props}) {
    const {name} = props

    switch (name) {
      case 'paintL':
        return <TetrisL {...props}/>
      case 'paintJ':
        return <TetrisJ {...props}/>
      case 'paintI':
        return <TetrisI {...props}/>
      case 'paintO':
        return <TetrisO {...props}/>
      case 'paintS':
        return <TetrisS {...props}/>
      case 'paintZ':
        return <TetrisZ {...props}/>
      case 'paintT':
        return <TetrisT {...props}/>
      default:
        return <Icon {...props} bold fs='30px' name={nameToIcon(name)} />
    }
  }
})
