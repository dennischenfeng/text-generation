import React from 'react'
import { Card, Typography } from '@mui/material'

const styleInstructions = {
    width: 600,
    padding: 20,
    textAlign: 'center',
}

export default function Instructions() {
    return (
        <Card style={styleInstructions}>
            <Typography variant='body1'>
                Instructions: Start typing (e.g. "We propose a method to") and then click "Generate". Append to or modify the text in any fashion and hit "Generate" again, as many times as you want!
                <br />
                <br />
                Important tip: Don't include a space at the end of your input.
            </Typography>
        </Card>
    )
}