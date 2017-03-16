  const {uid, saveRef, gameRef} = data
    const userRef = usersRef.child(uid)
    const saveR = savedRef.child(saveRef)
    saveR.child('shared').set(true)
      .then(() => saveR.child('firstShared').transaction((val) => val ? val : Date.now()))
      .then(() => userRef.child('completed').child(gameRef).once('value'))
      .then(addToShowcase)
      .then(() => resolve({saveID: saveRef}))
      .catch(reject)

    function addToShowcase (game) {
      return saveR.child('firstShared').once('value')
        .then((snap) => userRef.child('showcase').child(gameRef).set(Object.assign({}, game.val(), {firstAdded: snap.val()})))
    }
  })