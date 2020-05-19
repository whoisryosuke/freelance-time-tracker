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
import { capitalize } from '../../helpers/capitalize'
import { TOKEN_COOKIES_KEY, COLOR_CATEGORIES } from '../../constants'

export const CreateProjectModal = ({ isOpen, onClose, updateData, projectId, projects }) => {
  const [clients, setClients] = useState([])
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Color: '',
    client: null,
  })
  const toast = useToast();
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
      if (projectId) {
        response = await strapi.updateEntry('projects', projectId, formData)
      } else {
        response = await strapi.createEntry('projects', formData)
      }
    } catch (e) {
      // Submission failed
    }

    // Submission succeeded
    if (response) {
      if(projectId) {
        toast({
          title: "Project edited.",
          description: "Client was successfully edited",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Project created.",
          description: "Client was successfully created",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      }
      updateData()
    }
  }

  useEffect(() => {
    const fetchClients = async () => {
      const latestClients = await strapi.getEntries('clients')
      setClients(latestClients)
    }
    fetchClients()
  }, [token])

  useEffect(() => {
    if (projectId) {
      const editProject = projects.filter(project => project.id === projectId)
      if(editProject.length > 0) {
        const { Name, Description, Color, client: { id } } = editProject[0]
        setFormData({ Name, Description, Color, client: id })
      }
    }
  }, [projectId])

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          {projectId ? 'Update' : 'Create new'}
          {' '}
          project
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          <form onSubmit={submitForm}>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel htmlFor="Name">Project name</FormLabel>
                <Input
                  name="Name"
                  placeholder="Project name"
                  defaultValue={formData.Name}
                  onChange={onChange}
                  isRequired
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="Description">Description</FormLabel>
                <Textarea
                  name="Description"
                  placeholder="Project description"
                  defaultValue={formData.Description}
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
                  defaultValue={formData.Color}
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
                  defaultValue={formData.client}
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
            {projectId ? 'Edit' : 'Create'}
            {' '}
            project
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateProjectModal
