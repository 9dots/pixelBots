const admin = require('firebase-admin')

module.exports = function (queue, pushID) {
	return function () {
    return admin.database().ref('/queue/tasks').child(queue).child(pushID).remove()
	}
}
