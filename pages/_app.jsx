import React from 'react'
import { AnimatePresence } from 'framer-motion'
import MDXProvider from '../components/MDXProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import { UserProvider } from '../context/UserContext'
import 'react-datepicker/dist/react-datepicker.css'

export default ({ Component, pageProps }) => (
  <ThemeProvider>
    <MDXProvider>
      <UserProvider>
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} />
        </AnimatePresence>
      </UserProvider>
    </MDXProvider>
  </ThemeProvider>
)
