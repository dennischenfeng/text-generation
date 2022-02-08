import React from 'react'
import { Typography, AppBar } from '@mui/material'

export default function Header() {
  return (
    <AppBar position='static' style={{textAlign: 'center'}}>
      <Typography variant='h2'>
        Text Autocomplete
      </Typography>
      <Typography variant='subtitle1'>
        Autocomplete your writing for machine learning paper abstracts,
        using a fine-tuned GPT2 model! 
        {/* As an example, start typing
        "We propose a method to" and click `Generate`. */}
      </Typography>
    </AppBar>
  )
}