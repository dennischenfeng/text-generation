import React from 'react'
import { Typography, AppBar } from '@mui/material'

export default function Header() {
  return (
    <AppBar position='static' style={{ textAlign: 'center', padding: '20px' }}>
      <Typography variant='h3'>
        Autocomplete ML Abstracts
      </Typography>
      <Typography variant='h5'>
        GPT2-powered text autocomplete for machine learning abstracts
      </Typography>
    </AppBar>
  )
}