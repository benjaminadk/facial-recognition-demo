import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { S3_SIGN } from '../../apollo/mutations/s3Sign'
import { LOGIN_USER } from '../../apollo/mutations/loginUser'
import Webcam from 'react-webcam'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import axios from 'axios'

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  var byteString = atob(dataURI.split(',')[1])

  // separate out the mime component
  var mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var arrayBuffer = new ArrayBuffer(byteString.length)
  var _ia = new Uint8Array(arrayBuffer)
  for (var i = 0; i < byteString.length; i++) {
    _ia[i] = byteString.charCodeAt(i)
  }

  var dataView = new DataView(arrayBuffer)
  var blob = new Blob([dataView], { type: mimeString })
  return blob
}

class Login extends Component {
  state = {
    username: '',
    imageSrc: null,
    progress: 0
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.progress === 100 && prevState.progress !== 100) {
    }
  }

  setRef = webcam => {
    this.webcam = webcam
  }

  getPhoto = () => {
    if (this.state.imageSrc) {
      this.setState({ imageSrc: null })
    } else {
      const imageSrc = this.webcam.getScreenshot()
      this.setState({ imageSrc })
    }
  }

  handleLogin = async () => {
    const { username, imageSrc } = this.state
    const file = dataURItoBlob(imageSrc)
    const filename =
      username
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') + '-attempt'
    const filetype = file.type
    const response1 = await this.props.s3Sign({ variables: { filename, filetype } })
    const { requestUrl, avatarUrl } = response1.data.s3Sign
    await this.uploadToS3(file, requestUrl)

    const response2 = await this.props.loginUser({ variables: { username: this.state.username } })
    const { success, message } = response2.data.loginUser
    this.setState({ username: '', imageSrc: null })
    this.props.showSummary(success, message, avatarUrl)
  }

  uploadToS3 = async (file, url) => {
    const options = {
      headers: {
        'Content-Type': file.type
      },
      onUploadProgress: e => {
        const progress = Math.round((e.loaded * 100) / e.total)
        this.setState({ progress })
      }
    }
    await axios.put(url, file, options)
  }

  handleChange = e => this.setState({ username: e.target.value })

  render() {
    return (
      <div className="login">
        <div className="form">
          <Typography variant="h4">Login</Typography>
          <TextField
            variant="outlined"
            label="Username"
            value={this.state.username}
            onChange={this.handleChange}
            autoFocus
          />
          {this.state.imageSrc ? (
            <img src={this.state.imageSrc} />
          ) : (
            <Webcam
              audio={false}
              width={350}
              height={350}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ width: 1280, height: 720 }}
            />
          )}
          <div className="login-buttons">
            <Button
              variant="contained"
              color="primary"
              disabled={!this.state.username || !this.state.imageSrc}
              onClick={this.handleLogin}
              className="choice-button"
            >
              Login
            </Button>
            <Button variant="contained" color="primary" onClick={this.getPhoto}>
              {this.state.imageSrc ? 'Re-Take Photo' : 'Take Photo'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.props.setMode(0)}
              className="choice-button"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(S3_SIGN, { name: 's3Sign' }),
  graphql(LOGIN_USER, { name: 'loginUser' })
)(Login)
