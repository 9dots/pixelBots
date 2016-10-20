/** @jsx element */

import element from 'vdux/element'
import {Block, Flex, Text} from 'vdux-ui'
import {Card} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import animalDescriptions from '../animalApis/animalDescriptions'
import reduce from '@f/reduce'
import {firebaseSet} from 'vdux-fire'

function render ({props}) {
  const {gameID, handleSave = setAnimal} = props

  return (
    <Flex absolute align='center center' tall wide>
      {reduce(makeCard, [], animalDescriptions)}
    </Flex>
  )

  function makeCard (cur, next, key) {
    return [
      ...cur,
      (<Card
        bgColor='secondary'
        hoverProps={{highlight: true}}
        cursor='pointer'
        onClick={() => handleSave(key)}
        sq='300px'
        mx='20px'
        color='white'>
        <Block p='20px' column align='center center'>
          <Block
            sq='100px'
            boxShadow='0 0 5px 2px rgba(0,0,0,0.2)'
            backgroundPosition='50%'
            backgroundSize='cover'
            backgroundImage={`url(${next.image})`}/>
          <Text mt='20px' fontWeight='800' fs='l'>{key}</Text>
          <Block mt='10px'>
            {next.description}
          </Block>
        </Block>
      </Card>)
    ]
  }

  function * setAnimal (animal) {
    yield firebaseSet({
      method: 'set',
      value: {
        animals: {
          0: {
            type: animal
          }
        }
      },
      ref: `/games/${gameID}`
    })
    yield setUrl(`/${gameID}/create/options`)
  }
}

export default {
  render
}
