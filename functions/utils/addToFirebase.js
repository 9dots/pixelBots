const admin = require('firebase-admin')

module.exports = function (ref, imageUrl) {
  return new Promise((resolve, reject) => {
    admin.database().ref(ref).set(imageUrl)
			.then(() => resolve(imageUrl))
			.catch(reject)
  })
}
