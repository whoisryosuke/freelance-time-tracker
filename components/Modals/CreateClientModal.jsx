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

export const CreateClientModal = ({ isOpen, onClose, updateData, clientId, clients }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Color: '',
    client: null,
  })
  const toast = useToast();
  const token = Cookies.get(TOKEN_COOKIES_KEY)

  const onChange = ({ currentTarget: { name, value } }) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const submitForm = async (e) => {
    e.preventDefault()

    const strapi = new Strapi('http://localhost:1337/')
    strapi.setToken(token)

    let response
    try {
      if (clientId) {
        response = await strapi.updateEntry('clients', clientId, formData)
      } else {
        response = await strapi.createEntry('clients', formData)
      }
    } catch (e) {
      // Submission failed
    }

    // Submission succeeded
    if (response) {
      if (clientId) {
        toast({
          title: "Client edited.",
          description: "Client was successfully edited",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Client created.",
          description: "Client was successfully created",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      }
      updateData()
      // setMessage(response)
    }
  }

  useEffect(() => {
    if (clientId) {
      const editClient = clients.filter(client => client.id === clientId)
      if (editClient.length > 0) {
        const { Name, Description, Color } = editClient[0]
        setFormData({ Name, Description, Color })
      }
    }
  }, [clientId])

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Create new client</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          <form onSubmit={submitForm}>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel htmlFor="Name">Client name</FormLabel>
                <Input
                  name="Name"
                  placeholder="Client name"
                  defaultValue={formData.Name}
                  onChange={onChange}
                  isRequired
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="Description">Description</FormLabel>
                <Textarea
                  name="Description"
                  placeholder="Client description"
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
            </Stack>
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button width="100%" variantColor="blue" onClick={submitForm}>
            {clientId ? 'Update' : 'Create'}
            {' '}
            client
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateClientModal
