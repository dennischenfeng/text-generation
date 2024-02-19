import React from 'react'
import { Typography, Link, Container, Box } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

const styleFooter = {
  textAlign: 'center',
  position: 'relative',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'white'
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <Container style={styleFooter}>
      <Typography>
        Copyright © {year} Dennis Feng
      </Typography>
      <Link href="https://github.com/dennischenfeng/text-generation" target="_blank">
        <GitHubIcon />
      </Link>
    </Container>
  )
}