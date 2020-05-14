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
  Flex,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Textarea,
} from '@chakra-ui/core'
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import { addHours, parseISO } from 'date-fns'
import { DatePicker } from '../DatePicker'
import {useColumn } from "../../context/ColumnContext"
import { TOKEN_COOKIES_KEY, RATE_TYPES, STATUS } from '../../constants'
import { capitalize } from '../../helpers/capitalize'

export const CreateHoursModal = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState([])
  const [formData, setFormData] = useState({
    start: parseISO(new Date().toISOString()),
    end: addHours(new Date(), 1),
    rate: '',
    Description: '',
    rate_type: '',
    status: '',
    project: '',
  })
  const { column } = useColumn()
  const token = Cookies.get(TOKEN_COOKIES_KEY)

  const strapi = new Strapi('http://localhost:1337/')
  strapi.setToken(token)

  /**
   * Handle form changes
   */
  const onChange = ({ currentTarget: { name, value } }) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleStartDate = date => {
      setFormData((prevState) => ({ ...prevState, start: date }))
  }

  const handleEndDate = date => {
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
      response = await strapi.createEntry('hours', formData)
    } catch (e) {
      // Submission failed
    }

    // Submission succeeded
    if (response) {
      console.log(response)
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
    console.log('column context', column)
      const start = parseISO(new Date(column).toISOString())
      const end = addHours(new Date(column), 1)
      setFormData((prevState) => ({ ...prevState, start, end }))
  }, [column])

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Create new project</DrawerHeader>
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

              <Flex>
                <FormControl>
                  <FormLabel htmlFor="rate">Hourly Rate</FormLabel>
                  <Input
                    type="number"
                    name="rate"
                    placeholder="Hourly/flat rate"
                    value={formData.rate}
                    onChange={onChange}
                    isRequired
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="rate_type">Rate Type</FormLabel>
                  <Select
                    name="rate_type"
                    placeholder="Select rate type"
                    defaultValue="hourly"
                    onChange={onChange}
                    isRequired
                  >
                    {RATE_TYPES.map((rateType) => (
                      <option value={rateType}>{capitalize(rateType)}</option>
                    ))}
                  </Select>
                </FormControl>
              </Flex>

              <FormControl>
                <FormLabel htmlFor="status">Status</FormLabel>
                <Select
                  name="status"
                  placeholder="Select status"
                  defaultValue="pending"
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
                  value={formData.Description}
                  onChange={onChange}
                  isRequired
                />
              </FormControl>
            </Stack>
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button width="100%" variantColor="blue" onClick={submitForm}>
            Log hours
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateHoursModal
