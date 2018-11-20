import React, { Component } from 'react'
import Choice from '../components/FacialRecTest/Choice'
import Signup from '../components/FacialRecTest/Signup'
import Login from '../components/FacialRecTest/Login'
import Summary from '../components/FacialRecTest/Summary'
import Notification from '../components/Notification'

export default class FacialRecTest extends Component {
  state = {
    mode: 0,
    notification: false,
    success: null,
    message: '',
    url: ''
  }

  setMode = mode => this.setState({ mode })

  showNotification = message => this.setState({ notification: true, message })

  showSummary = (success, message, url) => {
    this.setState({
      success,
      message,
      url,
      mode: 3
    })
  }

  closeNotification = () => this.setState({ notification: false, message: '' })

  render() {
    const { mode, notification, success, message, url } = this.state
    return (
      <>
        {mode === 0 ? (
          <Choice setMode={this.setMode} />
        ) : mode === 1 ? (
          <Signup setMode={this.setMode} showNotification={this.showNotification} />
        ) : mode === 2 ? (
          <Login
            setMode={this.setMode}
            showNotification={this.showNotification}
            showSummary={this.showSummary}
          />
        ) : (
          <Summary success={success} message={message} url={url} setMode={this.setMode} />
        )}
        {notification && (
          <Notification open={notification} message={message} onClose={this.closeNotification} />
        )}
      </>
    )
  }
}
