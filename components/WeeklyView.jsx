import React from 'react'
import { eachDayOfInterval, differenceInHours } from 'date-fns'
import { Box, Heading, Stack } from '@chakra-ui/core'
import { parseDay, parseMonthDate } from '../helpers/parseDates'
import { useColumn } from '../context/ColumnContext'
import TimeCard from './TimeCard'

export const WeeklyView = ({ dateRange, hours, openHourModal }) => {
  const { updateColumn } = useColumn()
  const clickColumn = (date) => {
    updateColumn(date)
    openHourModal()
  }
  return (
    <Box width="100%" height="90vh" overflowX="scroll" whiteSpace="nowrap">
      {eachDayOfInterval({
        start: dateRange.start,
        end: dateRange.end,
      }).map((date) => {
        const dateKey = parseMonthDate(date)
        const arrayCheck =
          Array.isArray(hours[dateKey]) && hours[dateKey].length > 0
        let totalHours = 0
        let totalRate = 0

        if (arrayCheck) {
          // Get total hours and profits for each day
          hours[dateKey].map((hourPost) => {
            const hoursLogged =
              differenceInHours(
                new Date(hourPost.start),
                new Date(hourPost.end)
              ) * -1
            // Determine hourly or flat rate
            const profit =
              hourPost.rate_type === 'hourly'
                ? hoursLogged * hourPost.rate
                : hourPost.rate

            totalHours += hoursLogged
            totalRate += profit
          })
        }
        return (
          <Box
            width={['100%', 1 / 4]}
            height={['auto', '100%']}
            p={3}
            display={['block', 'inline-block']}
            verticalAlign="top"
            onClick={() => clickColumn(date)}
          >
            <Heading size="md" mb={3}>
              {parseDay(date)}
            </Heading>
            <Heading size="sm" mb={3}>
              {totalHours} hours - ${totalRate}
            </Heading>
            {arrayCheck && (
              <Stack spacing={3}>
                {hours[dateKey].map((hourPost) => (
                  <TimeCard data={hourPost} />
                ))}
              </Stack>
            )}
          </Box>
        )
      })}
    </Box>
  )
}

export default WeeklyView
