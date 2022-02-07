import React from 'react'
import { Card, TextField, Button } from '@mui/material'

const styleTextPanel = {
  width: 400,
  padding: 20,
  margin: 20,
}

export default function TextPanel({text, setText, generateText}) {
  return (
    <Card style={styleTextPanel}>
      <TextField 
        multiline 
        fullWidth 
        rows={14} 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder={
          'Start typing (e.g. "We propose a method to") and then click "Generate". ' + 
          'Tip: don\'t include a space at the end of your input.'
        }
      />

      <Button onClick={generateText} variant='contained' style={{marginTop: 10}}>
        Generate
      </Button>
    </Card>

  )
}