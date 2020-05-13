import {useEffect, useState } from 'react'
import Head from 'next/head'
import { Box, Button, Flex, Heading } from "@chakra-ui/core"
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import { format, formatISO, addDays, subDays, parseISO } from 'date-fns'
import AuthGuard from '../components/AuthGuard'
import BaseLayout from '../layouts/BaseLayout'
import { useUser } from '../context/UserContext'
import { TOKEN_COOKIES_KEY } from '../constants'

const Dashboard = () => {
  // View = Day/Week/Month/etc
  const [view, setView] = useState({})
  const [dateRange, setDateRange] = useState({
    start: parseISO(new Date().toISOString()),
    end: addDays(new Date(), 7)
  })
  const [hours, setHours] = useState({})
  const { user } = useUser()
  const token = Cookies.get(TOKEN_COOKIES_KEY)
  console.log('dateRange',dateRange)

  const parseDate = (date) => {
    return format(date, 'MMM d, Y')
  }

  // Fetch hours
  useEffect(() => {
    const fetchData = async () => {
      const strapi = new Strapi('http://localhost:1337/')
      strapi.setToken(token)
      const latestHours = await strapi.getEntries('hours', {
        start_gte: formatISO(dateRange.start),
        end_lte: formatISO(dateRange.end),
      })
      setHours(latestHours)
    }
    fetchData()
  }, [dateRange, token])

  // Move forward dates
  const nextDay = (e) => {
    e.preventDefault()

    setDateRange(prevState => ({
      start: addDays(prevState.start, 1),
      end: addDays(prevState.end, 1)
    }))
  }

  // Move back dates
  const prevDay = (e) => {
    e.preventDefault()

    setDateRange(prevState => ({
      start: subDays(prevState.start, 1),
      end: subDays(prevState.end, 1)
    }))
  }

  return (
    <AuthGuard>
      <BaseLayout>
        <Head>
          <title>Dashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div>
          <Button onClick={prevDay}>PREV</Button>
          <div>
            {parseDate(dateRange.start)}
            {' '}
            -
            {' '}
            {parseDate(dateRange.end)}
          </div>
          <Button onClick={nextDay}>NEXT</Button>
        </div>

        <div>
          <Heading as="h2" size="xl">
            {user.username}
          </Heading>
          <Heading as="h4" size="md" fontWeight="normal">
            {user.email}
          </Heading>
        </div>
        <div>{JSON.stringify(hours)}</div>
      </BaseLayout>
    </AuthGuard>
  )
}

export default Dashboard
