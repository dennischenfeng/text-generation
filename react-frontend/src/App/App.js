import React, { useState } from 'react'
import theme from './theme'
import { Header, Footer, Settings, TextPanel, Instructions } from './Components'
import { Stack, ThemeProvider } from '@mui/material'

export default function App() {
  const [genLength, setGenLength] = useState(10)
  const [topP, setTopP] = useState(1.0)
  const [temperature, setTemperature] = useState(1.0)
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function generateText() {
    setIsLoading(true)

    // trim trailing whitespace as is recommended by the GPT2 model
    let trimmedText = text.trimEnd()

    fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputText: trimmedText,
        numTokens: genLength,
        topP: topP,
        temperature: temperature,
      })
    })
      .then(res => res.json())
      .then(data => {
        setText(`${trimmedText}${data.result}`)
        setIsLoading(false)
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <Header />

      <Stack direction='column' alignItems='center' justifyContent='center' sx={{ margin: '20px' }}>
        <Instructions />

        <Stack direction='row' alignItems='center' justifyContent='center'>
          <Settings
            genLength={genLength}
            setGenLength={setGenLength}
            topP={topP}
            setTopP={setTopP}
            temperature={temperature}
            setTemperature={setTemperature}
          />
          <TextPanel
            text={text}
            setText={setText}
            generateText={generateText}
            isLoading={isLoading}
          />
        </Stack>
      </Stack>

      <Footer />
    </ThemeProvider >
  )
}
