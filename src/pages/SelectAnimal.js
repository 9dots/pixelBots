/** @jsx element */

import element from 'vdux/element'
import {Block, Flex, Text} from 'vdux-ui'
import {Card} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import animalDescriptions from '../animalApis/animalDescriptions'
import reduce from '@f/reduce'
import {firebaseSet} from 'vdux-fire'

function render ({props}) {
  const {gameID, title, handleSave = setAnimal} = props

  return (
    <Flex absolute column align='center center'  tall wide>
      <Block absolute top='1em'>
        <Text color='#666' fs='l'>{title}</Text>
      </Block>
      <Flex align='center center'>
        {reduce(makeCard, [], animalDescriptions)}
      </Flex>
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
