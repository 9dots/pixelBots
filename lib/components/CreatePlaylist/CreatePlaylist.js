/**
 * Imports
 */

import ModalMessage from 'components/ModalMessage'
import createCode from 'utils/createShortCode'
import { component, element } from 'vdux'
import { Input } from 'vdux-containers'
import validator from 'schema/playlist'
import Button from 'components/Button'
import { Block } from 'vdux-ui'
import Form from 'vdux-form'

const inputProps = {
  p: true,
  border: ' 1px solid divider',
  autocomplete: 'off'
}

/**
 * <CreatePlaylist/>
 */

export default component({
  render ({ props, context, state, actions }) {
    const { handleDismiss, cancel = 'Cancel' } = props

    const body = (
      <Block>
        <Form
          id='create-playlist'
          onSubmit={actions.createPlaylist}
          validate={validator.playlist}>
          <Block>
            <Input
              h='42px'
              placeholder='Title'
              name='name'
              fontWeight='300'
              fs='s'
              required
              mb='l'
              inputProps={inputProps} />
            <Input
              h='42px'
              placeholder='Description'
              name='description'
              fontWeight='300'
              fs='s'
              required
              inputProps={inputProps} />
          </Block>
          <Block align='end center' py='20px'>
            <Button
              hoverProps={{ color: 'blue', borderColor: 'blue' }}
              onClick={handleDismiss || context.closeModal}
              color='#999'
              bgColor='transparent'>
              {cancel}
            </Button>
            <Button
              form='create-playlist'
              type='submit'
              ml='6px'
              bgColor='blue'>
              Save
            </Button>
          </Block>
        </Form>
      </Block>
    )

    return (
      <ModalMessage
        bgColor='#FAFAFA'
        header='Create'
        noFooter
        bodyProps={{ pb: '2em' }}
        body={body} />
    )
  },
  controller: {
    * createPlaylist ({ state, props, context }, { name, description }) {
      const { onSuccess } = props
      const { uid, username } = context
      const code = yield createCode()
      const { key } = yield context.firebasePush('/playlists', {
        followedBy: { [username]: true },
        imageUrl: '/animalImages/playlistImage.png',
        creatorUsername: username,
        lastEdited: Date.now(),
        shortLink: code,
        creatorID: uid,
        follows: 1,
        description,
        name
      })
      yield context.firebaseSet(`/links/${code}`, {
        type: 'playlist',
        payload: key
      })

      yield context.closeModal()

      if (onSuccess) {
        yield onSuccess()
      }
    }
  }
})
