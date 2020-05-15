import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/core'
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import { formatISO, addDays, subDays, parseISO } from 'date-fns'
import { TOKEN_COOKIES_KEY } from '../constants'
import { ColumnProvider } from '../context/ColumnContext'
import AuthGuard from '../components/AuthGuard'
import { CreateHoursModal } from '../components/Modals/CreateHoursModal'
import { WeeklyView } from '../components/WeeklyView'
import { parseDate, parseMonthDate } from '../helpers/parseDates'
import BaseLayout from '../layouts/BaseLayout'

const Dashboard = () => {
  // View = Day/Week/Month/etc
  const [view, setView] = useState('week')
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 6),
    end: parseISO(new Date().toISOString()),
  })
  const [hours, setHours] = useState({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const token = Cookies.get(TOKEN_COOKIES_KEY)

  const fetchData = async () => {
    const strapi = new Strapi('http://localhost:1337/')
    strapi.setToken(token)
    const latestHours = await strapi.getEntries('hours', {
      start_gte: formatISO(dateRange.start),
      end_lte: formatISO(dateRange.end),
    })

    // Sort hours by date
    const sortedHours = []
    latestHours.map((hourLog) => {
      const date = parseMonthDate(new Date(hourLog.start))
      if (!Array.isArray(sortedHours[date])) {
        sortedHours[date] = []
      }
      sortedHours[date].push(hourLog)
    })
    setHours(sortedHours)
  }

  // Fetch hours
  useEffect(() => {
    fetchData()
  }, [dateRange, token])

  // Move forward dates
  const nextDay = (e) => {
    e.preventDefault()

    setDateRange((prevState) => ({
      start: addDays(prevState.start, 1),
      end: addDays(prevState.end, 1),
    }))
  }

  // Move back dates
  const prevDay = (e) => {
    e.preventDefault()

    setDateRange((prevState) => ({
      start: subDays(prevState.start, 1),
      end: subDays(prevState.end, 1),
    }))
  }

  const updateData = () => {
    fetchData()
  }

  return (
    <AuthGuard>
      <BaseLayout>
        <Head>
          <title>Dashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <ColumnProvider>
          <Flex>
            <Button onClick={prevDay}>PREV</Button>
            <Box p={2} mx={3}>
              {parseDate(dateRange.start)} - {parseDate(dateRange.end)}
            </Box>
            <Button onClick={nextDay}>NEXT</Button>
          </Flex>

          <WeeklyView
            dateRange={dateRange}
            hours={hours}
            openHourModal={onOpen}
          />

          <CreateHoursModal
            isOpen={isOpen}
            onClose={onClose}
            updateData={updateData}
          />
        </ColumnProvider>
      </BaseLayout>
    </AuthGuard>
  )
}

export default Dashboard
