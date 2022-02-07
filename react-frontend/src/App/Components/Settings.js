import React from 'react'
import { Card, Box, Typography, Slider, Stack, Tooltip } from '@mui/material'

const styleSettings = {
  width: 200,
  padding: 20,
  margin: 20,
}

export default function Settings(
  {genLength, setGenLength, topP, setTopP, temperature, setTemperature}
) {
  const tooltipTextGenLength = <Typography variant='body1'>
    Length of sequence (number of tokens) to be generated.
    Rule of thumb: One token is about 4 characters, or 3/4 of a word, on average.
    Longer sequences will take longer durations to generate.
  </Typography>

  const tooltipTextTopP = <Typography variant='body1'>
    Sample only the tokens within the top p probability mass. 
    E.g. if top-p is 0.4, only the tokens within the top 40% of 
    probability mass will be sampled from. Top-p of 1.0 corresponds 
    to sampling from all tokens.
  </Typography>

  const tooltipTextTemperature = <Typography variant='body1'>
    Controls randomness of sampling. Higher temperature corresponds 
    to more randomness in generated tokens.
  </Typography>

  return (
    <Card style={styleSettings}>
      <Stack style={{gap: 10}}>
        <Tooltip title={tooltipTextGenLength} placement="left" arrow>
          <Stack alignItems='flex-start'>
            <Typography variant='body1'>Generation length: {genLength}</Typography>
            <Slider 
              defaultValue={10} 
              min={5} 
              max={100} 
              step={5}
              onChange={(e) => {setGenLength(e.target.value)}}
            />
          </Stack>
        </Tooltip>

        <Tooltip title={tooltipTextTopP} placement="left" arrow>
          <Stack alignItems='flex-start'>
            <Typography variant='body1'>Top-p: {topP}</Typography>
            <Slider 
              defaultValue={1} 
              step={0.01}
              min={0.01} 
              max={1}
              onChange={(e) => {setTopP(e.target.value)}}
            />
          </Stack>
        </Tooltip>

        <Tooltip title={tooltipTextTemperature} placement="left" arrow>
          <Stack alignItems='flex-start'>
            <Typography variant='body1'>Temperature: {temperature}</Typography>
            <Slider 
              defaultValue={1} 
              step={0.01}
              min={0.01} 
              max={3}
              onChange={(e) => {setTemperature(e.target.value)}}
            />
          </Stack>
        </Tooltip>
      </Stack>
    </Card>
  )
}
