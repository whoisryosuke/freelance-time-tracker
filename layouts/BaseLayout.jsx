import React from 'react'
import { motion } from 'framer-motion'
import { Box } from '@chakra-ui/core'

export default function BaseLayout({ children }) {
  return (
    <motion.main
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Box p={3} textAlign="center">
        {children}
      </Box>
    </motion.main>
  )
}
