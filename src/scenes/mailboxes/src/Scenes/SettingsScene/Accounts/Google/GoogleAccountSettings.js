import PropTypes from 'prop-types'
import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Row, Col } from 'Components/Grid'
import AccountAppearanceSettings from '../AccountAppearanceSettings'
import AccountAdvancedSettings from '../AccountAdvancedSettings'
import AccountBadgeSettings from '../AccountBadgeSettings'
import AccountNotificationSettings from '../AccountNotificationSettings'
import AccountServicesHeading from '../AccountServicesHeading'
import AccountServicesSettings from '../AccountServicesSettings'
import CoreService from 'shared/Models/Accounts/CoreService'
import ServiceFactory from 'shared/Models/Accounts/ServiceFactory'
import { userStore } from 'stores/user'
import { RaisedButton, Avatar, FontIcon } from 'material-ui'
import GoogleDefaultServiceSettings from './GoogleDefaultServiceSettings'
import GoogleServiceSettings from './GoogleServiceSettings'

const styles = {
  proServices: {
    textAlign: 'center'
  },
  proServiceAvatars: {
    marginTop: 8,
    marginBottom: 8
  }
}

export default class GoogleAccountSettings extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    mailbox: PropTypes.object.isRequired,
    showRestart: PropTypes.func.isRequired,
    onRequestEditCustomCode: PropTypes.func.isRequired
  }

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    userStore.listen(this.userUpdated)
  }

  componentWillUnmount () {
    userStore.unlisten(this.userUpdated)
  }

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  state = (() => {
    return {
      userHasServices: userStore.getState().user.hasServices
    }
  })()

  userUpdated = (userState) => {
    this.setState({
      userHasServices: userState.user.hasServices
    })
  }

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Opens wavebox purchase
  */
  openWaveboxPro = () => {
    window.location.hash = '/pro'
  }

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  /**
  * Renders the service type
  * @param mailbox: the current mailbox
  * @param serviceType: the type of service we are rendering for
  * @param onRequestEditCustomCode: the function call to open the edit custom code modal
  * @return jsx
  */
  renderServiceType (mailbox, serviceType, onRequestEditCustomCode) {
    switch (serviceType) {
      case CoreService.SERVICE_TYPES.DEFAULT:
        return (
          <GoogleDefaultServiceSettings
            key={serviceType}
            mailbox={mailbox}
            onRequestEditCustomCode={onRequestEditCustomCode} />)
      default:
        return (
          <GoogleServiceSettings
            key={serviceType}
            mailbox={mailbox}
            serviceType={serviceType}
            onRequestEditCustomCode={onRequestEditCustomCode} />)
    }
  }

  render () {
    const { mailbox, showRestart, onRequestEditCustomCode, ...passProps } = this.props
    const { userHasServices } = this.state

    return (
      <div {...passProps}>
        <Row>
          <Col md={6}>
            <AccountAppearanceSettings mailbox={mailbox} />
            <AccountBadgeSettings mailbox={mailbox} />
            <AccountNotificationSettings mailbox={mailbox} />
          </Col>
          <Col md={6}>
            <AccountAdvancedSettings mailbox={mailbox} showRestart={showRestart} />
            <AccountServicesSettings mailbox={mailbox} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <AccountServicesHeading mailbox={mailbox} />
          </Col>
        </Row>
        {userHasServices ? (
          <div>
            {mailbox.enabledServiceTypes.map((serviceType) => {
              return this.renderServiceType(mailbox, serviceType, onRequestEditCustomCode)
            })}
            {mailbox.disabledServiceTypes.map((serviceType) => {
              return this.renderServiceType(mailbox, serviceType, onRequestEditCustomCode)
            })}
          </div>
        ) : (
          <div>
            {this.renderServiceType(mailbox, CoreService.SERVICE_TYPES.DEFAULT, onRequestEditCustomCode)}
            <div style={styles.proServices}>
              <h3>Enjoy all these extra services when you purchase Wavebox...</h3>
              <div style={styles.proServiceAvatars}>
                {mailbox.supportedServiceTypes.map((serviceType) => {
                  if (serviceType === CoreService.SERVICE_TYPES.DEFAULT) { return undefined }
                  const serviceClass = ServiceFactory.getClass(mailbox.type, serviceType)
                  return (
                    <Avatar
                      key={serviceType}
                      size={40}
                      src={'../../' + serviceClass.humanizedLogo}
                      backgroundColor='white'
                      style={{ marginRight: 8, border: '2px solid rgb(139, 139, 139)' }} />)
                })}
              </div>
              <RaisedButton
                primary
                icon={(<FontIcon className='fa fa-diamond' />)}
                label='Purchase Wavebox'
                onClick={this.openWaveboxPro} />
            </div>
          </div>
        )}
      </div>
    )
  }
}
