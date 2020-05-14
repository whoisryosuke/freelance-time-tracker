import React, {useState} from 'react'
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
import { capitalize } from "../../helpers/capitalize"
import { TOKEN_COOKIES_KEY, COLOR_CATEGORIES } from '../../constants'

export const CreateClientModal = ({isOpen, onClose}) => {
    const [formData, setFormData] = useState({
        Name: "",
        Description: "",
        Color: ""
    })
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
        response = await strapi.createEntry(
          "clients",
          formData
        )
      } catch (e) {
        // Submission failed
      }

      // Submission succeeded
      if (response) {
        console.log(response)
        // setMessage(response)
      }
    }

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
                    onChange={onChange}
                    isRequired
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="Description">Description</FormLabel>
                  <Textarea
                    name="Description"
                    placeholder="Client description"
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
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button width="100%" variantColor="blue" onClick={submitForm}>
              Create client
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
}

export default CreateClientModal