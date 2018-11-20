import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { CREATE_USER } from '../../apollo/mutations/createUser'
import { S3_SIGN } from '../../apollo/mutations/s3Sign'
import Dropzone from 'react-dropzone'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import axios from 'axios'

class Signup extends Component {
  state = {
    username: '',
    file: null,
    progress: 0
  }

  handleChange = e => this.setState({ username: e.target.value })

  handleDrop = files => this.setState({ file: files[0] })

  handleCreateUser = async () => {
    const { file, username } = this.state
    const filename =
      username
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') + '-original'
    const filetype = file.type
    const response1 = await this.props.s3Sign({ variables: { filename, filetype } })
    const { requestUrl, avatarUrl } = response1.data.s3Sign

    try {
      await this.uploadToS3(file, requestUrl)
    } catch (error) {
      console.error(error)
    }

    const response2 = await this.props.createUser({ variables: { username, avatar: avatarUrl } })
    const { message } = response2.data.createUser
    this.setState({ username: '', file: null, progress: 0 })
    this.props.showNotification(message)
    setTimeout(() => {
      this.props.setMode(0)
    }, 1000)
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

  render() {
    return (
      <div className="signup">
        <div className="form">
          <Typography variant="h4">Signup</Typography>
          <TextField
            variant="outlined"
            label="Username"
            value={this.state.username}
            onChange={this.handleChange}
            autoFocus
          />
          <Dropzone
            accept="image/jpeg, image/png"
            multiple={false}
            onDrop={this.handleDrop}
            className="dropzone"
            style={{
              backgroundImage: this.state.file && `url(${URL.createObjectURL(this.state.file)})`
            }}
          >
            {!this.state.file && (
              <Typography variant="subtitle2">Add image of your face</Typography>
            )}
          </Dropzone>
          <LinearProgress
            variant="determinate"
            color="primary"
            value={this.state.progress}
            style={{ width: '80%' }}
          />
          <div className="signup-buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleCreateUser}
              disabled={!this.state.file || !this.state.username}
              className="choice-button"
            >
              Signup
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
  graphql(CREATE_USER, { name: 'createUser' }),
  graphql(S3_SIGN, { name: 's3Sign' })
)(Signup)
