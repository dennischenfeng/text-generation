import React from 'react'
import { Typography, AppBar } from '@mui/material'

export default function Header() {
  return (
    <AppBar position='static' style={{ textAlign: 'center' }}>
      <Typography variant='h2'>
        Text Autocomplete (ML Abstracts)
      </Typography>
      <Typography variant='h5'>
        Autocomplete your writing for machine learning paper abstracts,
        using a fine-tuned GPT2 model!
      </Typography>
    </AppBar>
  )
}