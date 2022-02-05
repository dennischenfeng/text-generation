import React from 'react'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'

export default function Header() {
  return (
    

    <header className="header">
      <h1 className="title">Text Autocomplete</h1>
      <div className="subtitle">
        Autocomplete your writing for machine learning paper abstracts,
        using a fine-tuned GPT2 model! As an example, start typing
        "We propose a method to" and click `Generate`.
      </div>
    </header>
  )
}