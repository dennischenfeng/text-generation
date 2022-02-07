import React from 'react'
import { Card, Box, Typography, Slider, Stack } from '@mui/material'

const styleSettingsPanel = {
  width: 300,
  height: 300,
  padding: 20,
  margin: 20,
}

export default function Settings(
  {genLength, setGenLength, topP, setTopP, temperature, setTemperature}
) {
  return (
    <Card style={styleSettingsPanel}>
      <Stack style={{gap: 10}}>
        <Stack alignItems='flex-start'>
          <Typography variant='body1'>Generation length: {genLength}</Typography>
          <Slider defaultValue={10} min={5} max={100} />
        </Stack>

        <Stack alignItems='flex-start'>
          <Typography variant='body1'>Top-p: {topP}</Typography>
          <Slider></Slider>
        </Stack>

        <Stack alignItems='flex-start'>
          <Typography variant='body1'>Temperature: {temperature}</Typography>
          <Slider></Slider>
        </Stack>
      </Stack>


      {/* <div className="setting">
        <div id="num-tokens-text" className="hover-for-tooltip">
          Generation length: <span id="num-tokens-value">10</span> 
          <span className="tooltip">
            Length of sequence (number of tokens) to be generated. 
            Rule of thumb: One token is about 4 characters, or 3/4 of a word, on average.
            Longer sequences will take longer durations to generate.
          </span>
        </div>
      </div>
      <div className="setting">
        <div id="top-p-text" className="hover-for-tooltip">
          Top-p: <span id="top-p-value">1</span> 
          <span className="tooltip">
            Sample only the tokens within the top p probability mass. 
            E.g. if top-p is 0.4, only the tokens within the top 40% of 
            probabilitiy mass will be sampled from. Top-p of 1.0 corresponds 
            to sampling from all tokens.
          </span>
        </div>
      </div>
      <div className="setting">
        <div id="temperature-text" className="hover-for-tooltip">
          Temperature: <span id="temperature-value">1</span> 
          <span className="tooltip">
            Controls randomness of sampling. Higher temperature corresponds 
            to more randomness in generated tokens.
          </span>
        </div>
      </div> */}

    </Card>
  )
}