var test = require('tape')
var {submit} = require('.')

const assignmentRef = '12345'
const textVal = ''
const listProps = {
	"creatorID" : "b1V2uAmlCieLOdP749PkdhGxfUw2",
  "creatorUsername" : "danleavitt0",
  "dateCreated" : 1480727820920,
  "description" : "",
  "followedBy" : {
    "danleavitt0" : true
  },
  "follows" : 1,
  "name" : "Zebra Stampede",
  "sequence" : [ "-KY1DhqqV1ZsD18L9DmP" ]
}

test('submit', (t) => {
	for (var i = 0; i < 100; i++) {
		let it = submit(listProps, assignmentRef, textVal)
		let result = it.next().value
		console.log(it.next('1234').value)
	}
	t.end()
})