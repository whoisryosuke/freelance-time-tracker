import { useState} from "react"
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Cookies from "js-cookie"
import Strapi from "strapi-sdk-javascript"
import { motion } from 'framer-motion'
import { Box, Button, Input, Stack } from '@chakra-ui/core'
import {TOKEN_COOKIES_KEY} from "../constants"
import {useUser} from "../context/UserContext"
import BaseLayout from "../layouts/BaseLayout"

const Login = () => {
    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    })
  const router = useRouter()
  const {updateUser} = useUser()

    const onChange = ({currentTarget: { name, value }}) => {
        setFormData((prevState) => ({ ...prevState, [name]: value}))
    }

    const submitForm = async e => {
        e.preventDefault()
        
        const strapi = new Strapi('http://localhost:1337/')

        let response
        try {
            response = await strapi.login(
            formData.identifier,
            formData.password
            )
        } catch (e) {
            // Login failed
        }

        // Login succeeded
        if(response) {
            // Save JWT in cookies
            Cookies.set(TOKEN_COOKIES_KEY, response.jwt)

            // Save user info to context
            updateUser(response.user)

            // Redirect user to dashboard
            router.push('/')
        }
    }

    return (
      <BaseLayout>
        <Head>
          <title>Login</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Box textAlign="center">
          <form method="POST" onSubmit={submitForm}>
            <Stack spacing={3}>
              <Input
                name="identifier"
                placeholder="Username"
                value={formData.identifier}
                onChange={onChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={onChange}
              />
              <Button type="submit" onClick={submitForm}>
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </BaseLayout>
    )}

export default Login
