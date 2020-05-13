import React from 'react'
import Link from 'next/link'
import { Box, Heading, IconButton, Flex, Stack, Text, Button } from '@chakra-ui/core'

const MenuItems = ({ children }) => (
  <Box mb={3}>
    {children}
  </Box>
)

const Header = (props) => {
  const [show, setShow] = React.useState(false)
  const handleToggle = () => setShow(!show)

  return (
    <Flex
      as="nav"
      wrap="wrap"
      flexDirection="column"
      width="75px"
      height="100vh"
      position="fixed"
      padding={4}
      bg="teal.500"
      color="white"
      {...props}
    >
      <Flex align="center" mb={5}>
        <Heading as="h1" size="lg" letterSpacing="-.1rem">
          <Link href="/">
            <a>FTT</a>
          </Link>
        </Heading>
      </Flex>

      <Stack spacing={3}>
        <MenuItems>
          <Link href="/about">
            <IconButton
              as="a"
              variant="outline"
              variantColor="teal.300"
              aria-label="Send email"
              icon="calendar"
            />
          </Link>
        </MenuItems>
        <MenuItems>
          <Link href="/about">
            <IconButton
              as="a"
              variant="outline"
              variantColor="teal.300"
              aria-label="Send email"
              icon="info"
            />
          </Link>
        </MenuItems>
      </Stack>
    </Flex>
  )
}

export default Header
