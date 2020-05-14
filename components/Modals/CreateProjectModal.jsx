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
} from '@chakra-ui/core'
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import { capitalize } from '../../helpers/capitalize'
import { TOKEN_COOKIES_KEY, COLOR_CATEGORIES } from '../../constants'

export const CreateProjectModal = ({ isOpen, onClose }) => {
  const [clients, setClients] = useState([])
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Color: '',
  })
  const token = Cookies.get(TOKEN_COOKIES_KEY)

    const strapi = new Strapi('http://localhost:1337/')
    strapi.setToken(token)

  const onChange = ({ currentTarget: { name, value } }) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const submitForm = async (e) => {
    e.preventDefault()

    let response
    try {
      response = await strapi.createEntry('projects', formData)
    } catch (e) {
      // Submission failed
    }

    // Submission succeeded
    if (response) {
      console.log(response)
    }
  }

  useEffect(() => {
    const fetchClients = async () => {
      const latestClients = await strapi.getEntries('clients')
      setClients(latestClients)
    }
    fetchClients()
  }, [token])

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Create new project</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          <form onSubmit={submitForm}>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel htmlFor="Name">Project name</FormLabel>
                <Input
                  name="Name"
                  placeholder="Project name"
                  onChange={onChange}
                  isRequired
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="Description">Description</FormLabel>
                <Textarea
                  name="Description"
                  placeholder="Project description"
                  size="sm"
                  onChange={onChange}
                  isRequired
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="Color">Color</FormLabel>
                <Select
                  name="Color"
                  placeholder="Select color"
                  onChange={onChange}
                  isRequired
                >
                  {COLOR_CATEGORIES.map((color) => (
                    <option value={color}>{capitalize(color)}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="client">Client</FormLabel>
                <Select
                  name="client"
                  placeholder="Select client"
                  onChange={onChange}
                  isRequired
                >
                  {clients.map((client) => (
                    <option value={client.id}>{client.Name}</option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button width="100%" variantColor="blue" onClick={submitForm}>
            Create project
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateProjectModal
