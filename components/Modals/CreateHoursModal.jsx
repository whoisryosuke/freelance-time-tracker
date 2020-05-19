import React, { useEffect, useState } from 'react'
import {
  Button,
  Input,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Textarea,
  useToast
} from '@chakra-ui/core'
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import { addHours, parseISO } from 'date-fns'
import { DatePicker } from '../DatePicker'
import { useColumn } from '../../context/ColumnContext'
import { TOKEN_COOKIES_KEY, RATE_TYPES, STATUS } from '../../constants'
import { capitalize } from '../../helpers/capitalize'

export const CreateHoursModal = ({ isOpen, onClose, updateData, hours, hourId }) => {
  const [projects, setProjects] = useState([])
  const [formData, setFormData] = useState({
    start: parseISO(new Date().toISOString()),
    end: addHours(new Date(), 1),
    rate: '',
    Description: '',
    rate_type: 'hourly',
    status: 'pending',
    project: '',
  })
  const { column } = useColumn()
  const toast = useToast()
  const token = Cookies.get(TOKEN_COOKIES_KEY)

  const strapi = new Strapi('http://localhost:1337/')
  strapi.setToken(token)

  /**
   * Handle form changes
   */
  const onChange = ({ currentTarget: { name, value } }) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleStartDate = (date) => {
    setFormData((prevState) => ({ ...prevState, start: date }))
  }

  const handleEndDate = (date) => {
    setFormData((prevState) => ({ ...prevState, end: date }))
  }

  /**
   * Submit form data to Strapi API
   * @param {React.SyntheticEvent} e
   */
  const submitForm = async (e) => {
    e.preventDefault()

    let response
    try {
      if (hourId) {
        response = await strapi.updateEntry('hours', hourId, formData)
      } else {
        response = await strapi.createEntry('hours', formData)
      }
    } catch (e) {
      // Submission failed
    }

    // Submission succeeded
    if (response) {
      if (hourId) {
        toast({
          title: "Hours edited.",
          description: "Client was successfully edited",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Hours created.",
          description: "Hours was successfully created",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      }
      updateData()
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      const latestProjects = await strapi.getEntries('projects')
      setProjects(latestProjects)
    }
    fetchProjects()
  }, [token])

  useEffect(() => {
    const start = parseISO(new Date(column).toISOString())
    const end = addHours(new Date(column), 1)
    setFormData((prevState) => ({ ...prevState, start, end }))
  }, [column])

  // Hydrate form with edit data from props
  useEffect(() => {
    if (hourId) {
      let editHour
      // We group hours by day, so filter 2 levels down
      Object.keys(hours).filter(day => {
        const findHour = hours[day].find(hour => hour.id === hourId)
        if(findHour) {
          editHour = findHour
        }
      })
      if (editHour) {
        const { start,
          end,
            rate,
              Description,
                rate_type,
                  status,
                    project,
                  } = editHour
        setFormData({
          start: parseISO(start),
          end: parseISO(end),
          rate,
          Description,
          rate_type,
          status,
          project: project.id })
      }
    }
  }, [hourId])

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          {hourId ? 'Edit' : 'Create new'}
          {' '}
          hours
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          <form onSubmit={submitForm}>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel htmlFor="start">Start Time</FormLabel>
                <DatePicker
                  selected={formData.start}
                  onChange={handleStartDate}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="end">End Time</FormLabel>
                <DatePicker selected={formData.end} onChange={handleEndDate} />
              </FormControl>

              <Stack isInline>
                <FormControl>
                  <FormLabel htmlFor="rate">Hourly Rate</FormLabel>
                  <Input
                    type="number"
                    name="rate"
                    placeholder="Hourly/flat rate"
                    defaultValue={formData.rate}
                    onChange={onChange}
                    isRequired
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="rate_type">Rate Type</FormLabel>
                  <Select
                    name="rate_type"
                    placeholder="Select rate type"
                    defaultValue={formData.rate_type}
                    onChange={onChange}
                    isRequired
                  >
                    {RATE_TYPES.map((rateType) => (
                      <option value={rateType}>{capitalize(rateType)}</option>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <FormControl>
                <FormLabel htmlFor="status">Status</FormLabel>
                <Select
                  name="status"
                  placeholder="Select status"
                  defaultValue={formData.status}
                  onChange={onChange}
                  isRequired
                >
                  {STATUS.map((statusType) => (
                    <option value={statusType}>{capitalize(statusType)}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="project">Related project</FormLabel>
                <Select
                  name="project"
                  placeholder="Select project"
                  defaultValue={formData.project}
                  onChange={onChange}
                  isRequired
                >
                  {projects.map((project) => (
                    <option value={project.id}>{project.Name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="Description">Description</FormLabel>
                <Textarea
                  name="Description"
                  placeholder="Description"
                  size="sm"
                  defaultValue={formData.Description}
                  onChange={onChange}
                  isRequired
                />
              </FormControl>
            </Stack>
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button width="100%" variantColor="blue" onClick={submitForm}>
            {hourId ? 'Update' : 'Log'}
            {' '}
            hours
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateHoursModal
