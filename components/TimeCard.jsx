import React from 'react'
import { differenceInHours } from 'date-fns'
import { Badge, Box, Heading, Text } from '@chakra-ui/core'

export const TimeCard = ({ data }) => {
  return (
    <Box
      p={3}
      borderRadius={8}
      bg={
        data.project && data.project.Color
          ? `${data.project.Color}.500`
          : 'gray.500'
      }
    >
      <Text mb={2}>{data.Description}</Text>
      <Badge mb={3}>{data.status}</Badge>
      <Heading as="h4" size="sm">
        ${data.rate} /{data.rate_type}
      </Heading>
      <Text mb={2}>
        {differenceInHours(new Date(data.start), new Date(data.end)) * -1} hours
      </Text>
    </Box>
  )
}

export default TimeCard
