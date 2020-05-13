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
  Select,
  Stack,
  Textarea,
} from '@chakra-ui/core'
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import { capitalize } from "../../helpers/capitalize"
import { TOKEN_COOKIES_KEY, COLOR_CATEGORIES } from '../../constants'

export const CreateClientDrawer = ({isOpen, onClose}) => {
    const [message, setMessage] = useState()
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
                <Input
                  name="Name"
                  placeholder="Client name"
                  onChange={onChange}
                  isRequired
                />
                <Textarea
                  name="Description"
                  placeholder="Client description"
                  size="sm"
                  onChange={onChange}
                  isRequired
                />
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

export default CreateClientDrawer