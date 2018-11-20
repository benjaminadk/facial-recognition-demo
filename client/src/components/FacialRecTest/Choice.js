import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

export default function Choice({ setMode }) {
  return (
    <div className="choice">
      <Typography variant="h3">Facial Recognition Password Demo</Typography>
      <div className="choice-buttons">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setMode(1)}
          className="choice-button"
        >
          Sign Up
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setMode(2)}
          className="choice-button"
        >
          Log In
        </Button>
      </div>
    </div>
  )
}
