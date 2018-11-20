import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Auth, PropsRoute } from './utils/routing'
import { graphql, compose } from 'react-apollo'
import { AUTOLOGIN } from './apollo/mutations/autoLogin'
import UserLanding from './containers/UserLanding'
import FacialRecTest from './containers/FacialRecTest'

class App extends Component {
  state = {
    loggedIn: false,
    user: null
  }

  componentDidMount() {}

  handleAutoLogin = async () => {
    const token = localStorage.getItem('TOKEN')
    if (!token) return
    let response = await this.props.autoLogin()
    const { success, user } = response.data.autoLogin
    if (success) Auth.authenticate()
    this.setState({ user, loggedIn: success })
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={FacialRecTest} />
          <PropsRoute path="/user/:userId" component={UserLanding} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default compose(graphql(AUTOLOGIN, { name: 'autoLogin' }))(App)
