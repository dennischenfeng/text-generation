import React, { useState, useEffect } from 'react'
import './App.css'
import { Header, Footer } from './Layouts'
import { Grid, Typography, Paper, Card, Box } from '@mui/material'
import Slider from '@mui/material/Slider'

export default function App() {
  const [text, setText] = useState('');
  useEffect(() => {
    fetch('/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        inputText: 'We propose a method to', //textField.value,
        numTokens: 5, //parseInt(numTokensVal.textContent),
        topP: 1.0, //parseFloat(topPVal.textContent),
        temperature: 1.0, //parseFloat(temperatureVal.textContent),
      })
    })
    .then(res => res.json())
    .then(data => {setText(data.result)})
  }, [])

  return (
    <div className="App">
      <Header/>
      
      {/* <div class="settings-panel">
        <div class="setting">
          <div id="num-tokens-text" class="hover-for-tooltip">
            Generation length: <span id="num-tokens-value">10</span> 
            <span class="tooltip">
              Length of sequence (number of tokens) to be generated. 
              Rule of thumb: One token is about 4 characters, or 3/4 of a word, on average.
              Longer sequences will take longer durations to generate.
            </span>
          </div>
          <input type="range" class="slider" id="num-tokens-slider" step="5" value="10" min="5" max="100">
        </div>
        <div class="setting">
          <div id="top-p-text" class="hover-for-tooltip">
            Top-p: <span id="top-p-value">1</span> 
            <span class="tooltip">
              Sample only the tokens within the top p probability mass. 
              E.g. if top-p is 0.4, only the tokens within the top 40% of 
              probabilitiy mass will be sampled from. Top-p of 1.0 corresponds 
              to sampling from all tokens.
            </span>
          </div>
          <input type="range" class="slider" id="top-p-slider" step="0.01" value="1" min="0.01" max="1">
        </div>
        <div class="setting">
          <div id="temperature-text" class="hover-for-tooltip">
            Temperature: <span id="temperature-value">1</span> 
            <span class="tooltip">
              Controls randomness of sampling. Higher temperature corresponds 
              to more randomness in generated tokens.
            </span>
          </div>
          <input type="range" class="slider" id="temperature-slider" step="0.01" value="1" min="0.01" max="3">
        </div>
      </div> */}


      {/* <Grid container spacing={2}>
        
        <Grid item xs={8}>
          <Card>
            <Typography variant='body1'>xs=8</Typography>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Typography variant='body1'>xs=4</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant='body1'>xs=4</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='body1'>xs=8</Typography>
        </Grid>
      </Grid> */}
      
      {/* <main className="main">
        <div className="settings-panel">
          <div className="setting">
            <div id="num-tokens-text" className="hover-for-tooltip">
              Generation length: <span id="num-tokens-value">10</span> 
              <span className="tooltip">
                Length of sequence (number of tokens) to be generated. 
                Rule of thumb: One token is about 4 characters, or 3/4 of a word, on average.
                Longer sequences will take longer durations to generate.
              </span>
            </div>
            <input type="range" class="slider" id="num-tokens-slider" step="5" value="10" min="5" max="100">
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
            <input type="range" class="slider" id="top-p-slider" step="0.01" value="1" min="0.01" max="1">
          </div>
          <div className="setting">
            <div id="temperature-text" className="hover-for-tooltip">
              Temperature: <span id="temperature-value">1</span> 
              <span className="tooltip">
                Controls randomness of sampling. Higher temperature corresponds 
                to more randomness in generated tokens.
              </span>
            </div>
            <input type="range" className="slider" id="temperature-slider" step="0.01" value="1" min="0.01" max="3">
          </div>
        </div>
        <div className="text-panel">
          <textarea id="text-field"></textarea>
          <button id="generate-btn">Generate</button>
        </div>
        
      </main> */}
      <div>Test: {text}</div>
      <Footer/>
    </div>
  )
}
