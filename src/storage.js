import {refMethod} from 'vdux-fire'

function * uploadImage (url, levelSize, targetPainted) {
	yield refMethod({
    ref: '/queue/tasks',
    updates: {
      method: 'push',
      value: {
        targetPainted,
        levelSize,
        url
      }
    }
  })
}

export {
	uploadImage
}