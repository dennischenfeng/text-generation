import React from 'react'
import { Card, TextField, Button } from '@mui/material'

const styleTextPanel = {
  width: 400,
  padding: 20,
  margin: 20,
  textAlign: 'center',
}

export default function TextPanel({ text, setText, generateText, isLoading }) {
  return (
    <Card style={styleTextPanel} >
      <TextField
        multiline
        fullWidth
        rows={14}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          'Enter text here'
        }
      />

      <Button
        onClick={generateText}
        variant='contained'
        style={{ marginTop: 20 }}
        disabled={isLoading || (text == '')}
      >
        {isLoading ? 'Loading...' : 'Generate'}
      </Button>
    </Card>

  )
}