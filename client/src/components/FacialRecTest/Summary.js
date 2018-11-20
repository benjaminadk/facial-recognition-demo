import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

export default function Summary({ success, message, url, setMode }) {
  const original = url.replace('attempt', 'original')
  return (
    <div className="summary">
      <Typography variant="h3">Facial Recognition Results</Typography>
      <div className="images">
        <div className="img">
          <img src={original} alt="" className="image" />
          <Typography variant="subtitle2">Original</Typography>
        </div>
        <div className="img">
          <img src={url} alt="" className="image" />
          <Typography variant="subtitle2">Login Attempt</Typography>
        </div>
      </div>
      <Typography variant="h4">{message}</Typography>
      <Typography variant="h4">{success ? 'User logged in' : 'Login Denied'}</Typography>
      <Button variant="contained" color="primary" onClick={() => setMode(0)}>
        Back
      </Button>
    </div>
  )
}
