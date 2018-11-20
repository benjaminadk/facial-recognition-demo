import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

export default function Notification({ open, message, onClose }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open}
      autoHideDuration={8000}
      onClose={onClose}
      message={<span>{message}</span>}
      action={
        <IconButton color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      }
    />
  )
}
