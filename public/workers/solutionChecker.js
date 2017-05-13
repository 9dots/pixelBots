onmessage = function (e) {
  console.log('message recieved from main script')
  postMessage('return a message')
}
