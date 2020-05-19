import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Box, Button, Flex, Stack, Select, useDisclosure } from '@chakra-ui/core'
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import { formatISO, addDays, subDays, subWeeks, parseISO } from 'date-fns'
import { TOKEN_COOKIES_KEY } from '../constants'
import { ColumnProvider } from '../context/ColumnContext'
import AuthGuard from '../components/AuthGuard'
import { CreateHoursModal } from '../components/Modals/CreateHoursModal'
import { DatePicker } from '../components/DatePicker'
import { WeeklyView } from '../components/WeeklyView'
import { parseDate, parseMonthDate } from '../helpers/parseDates'
import BaseLayout from '../layouts/BaseLayout'

const Dashboard = () => {
  // View = Day/Week/Month/etc
  const [view, setView] = useState('week')
  const [editHourId, setEditHourId] = useState(null)
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState({
    type: 'project',
    value: ''
  })
  const [dateRange, setDateRange] = useState({
    start: subWeeks(new Date(), 1),
    end: parseISO(new Date().toISOString()),
  })
  const [hours, setHours] = useState({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const token = Cookies.get(TOKEN_COOKIES_KEY)

  const fetchData = async () => {
    const strapi = new Strapi('http://localhost:1337/')
    strapi.setToken(token)

    const apiFilters = {
      start_gte: formatISO(dateRange.start),
      end_lte: formatISO(dateRange.end),
    }
    // Filter by project if dropdown selected
    if(filter.value !== '') {
      apiFilters[filter.type] = filter.value
    }

    const latestHours = await strapi.getEntries('hours', apiFilters)

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
  
  const fetchProjects = async () => {
    const strapi = new Strapi('http://localhost:1337/')
    strapi.setToken(token)
    const latestProjects = await strapi.getEntries('projects')

    setProjects(latestProjects)
  }

  // Fetch hours
  useEffect(() => {
    fetchData()
  }, [dateRange, filter, token])

  // Fetch projects for list
  useEffect(() => {
    fetchProjects()
  }, [token])

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

  // Handle date range form
  const handleDateInput = (date, name) => {
    setDateRange((prevState) => ({
      ...prevState,
      [name]: date,
    }))
  }
  const handleStartDateInput = (date) => {
    handleDateInput(date, 'start')
  }
  const handleEndDateInput = (date) => {
    handleDateInput(date, 'end')
  }

  // Handle select input
  const onChange = ({ currentTarget: { value } }) => {
    setFilter((prevState) => ({...prevState, value}))
  }

  // Handle edit hours button
  const handleEdit = (id) => {
    setEditHourId(id)
    onOpen()
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
            <Stack isInline p={2} mx={3}>
              <DatePicker
                selected={dateRange.start}
                onChange={handleStartDateInput}
              />
              <DatePicker
                selected={dateRange.end}
                onChange={handleEndDateInput}
              />
            </Stack>
            <Button onClick={nextDay}>NEXT</Button>
            <Box>
              <Select
                name="project"
                placeholder="Filter by project"
                onChange={onChange}
                isRequired
                mx={3}
              >
                {projects.map((project) => (
                  <option value={project.id}>{project.Name}</option>
                ))}
              </Select>
            </Box>
          </Flex>

          <WeeklyView
            dateRange={dateRange}
            hours={hours}
            openHourModal={onOpen}
            handleEdit={handleEdit}
          />

          <CreateHoursModal
            isOpen={isOpen}
            onClose={onClose}
            updateData={updateData}
            hours={hours}
            hourId={editHourId}
          />
        </ColumnProvider>
      </BaseLayout>
    </AuthGuard>
  )
}

export default Dashboard
