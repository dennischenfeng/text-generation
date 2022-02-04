import React, { useState, useEffect } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';

function App() {
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
    .then(data => {setText(data.result);})
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <Slider>Slider1</Slider>
        <Button variant='contained'>Hello!</Button>
        <h1>test: {text}</h1>
        <h1 className="title">Text Autocomplete</h1>
        <div className="subtitle">
          Autocomplete your writing for machine learning paper abstracts,
          using a fine-tuned GPT2 model! As an example, start typing
          "We propose a method to" and click `Generate`.
        </div>
      </header>
      <main className="main">
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
            {/* <input type="range" class="slider" id="num-tokens-slider" step="5" value="10" min="5" max="100"> */}
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
            {/* <input type="range" class="slider" id="top-p-slider" step="0.01" value="1" min="0.01" max="1"> */}
          </div>
          <div className="setting">
            <div id="temperature-text" className="hover-for-tooltip">
              Temperature: <span id="temperature-value">1</span> 
              <span className="tooltip">
                Controls randomness of sampling. Higher temperature corresponds 
                to more randomness in generated tokens.
              </span>
            </div>
            {/* <input type="range" className="slider" id="temperature-slider" step="0.01" value="1" min="0.01" max="3"> */}
          </div>
        </div>
        <div className="text-panel">
          <textarea id="text-field"></textarea>
          <button id="generate-btn">Generate</button>
        </div>
        
      </main>
    </div>
  );
}

export default App;
