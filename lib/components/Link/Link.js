/**
 * Imports
 */

import {preventDefault, component, element} from 'vdux'
import {CSSContainer} from 'vdux-containers'
import {Base} from 'vdux-ui'

/**
 * <Link/>
 */

export default component({
  render ({props, children, context}) {
    const {ui = InternalLink, current = isCurrent(props.href, context.url), href, disabled, replace, currentProps = {}, ...rest} = props
    let onClick = props.onClick

    if ((ui !== InternalLink && href && !disabled) || replace) {
      onClick = [context.setUrl(href, replace), preventDefault]
    }

    return (
      <CSSContainer
        ui={ui}
        {...rest}
        disabled={disabled}
        href={href}
        onClick={onClick}
        {...(current ? currentProps : {})}>
        {children}
      </CSSContainer>
    )
  }
})

/**
 * <InternalLink/>
 */

function InternalLink ({props, children}) {
  return (
    <Base tag='a' {...props}>
      {children}
    </Base>
  )
}

/**
 * Helpers
 */

function isCurrent (href = '', currentUrl = '') {
  return href && currentUrl.indexOf(href) === 0
}
