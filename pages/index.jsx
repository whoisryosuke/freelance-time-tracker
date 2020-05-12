import {useEffect, useState } from 'react'
import Head from 'next/head'
import { Heading } from "@chakra-ui/core"
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import AuthGuard from '../components/AuthGuard'
import BaseLayout from '../layouts/BaseLayout'
import { useUser } from '../context/UserContext'
import { TOKEN_COOKIES_KEY } from '../constants'

const Dashboard = () => {
  const [clients, setClients] = useState({})
  const { user } = useUser()
  const token = Cookies.get(TOKEN_COOKIES_KEY)

  useEffect(() => {
    const fetchClients = async () => {
      const strapi = new Strapi('http://localhost:1337/')
      strapi.setToken(token)
      const latestClients = await strapi.getEntries('clients')
      setClients(latestClients)
    }
    fetchClients()
  }, [token])

  return (
    <AuthGuard>
      <BaseLayout>
        <Head>
          <title>Dashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div>Private dashboard</div>
        <div>
          <Heading as="h2" size="xl">
            {user.username}
          </Heading>
          <Heading as="h4" size="md" fontWeight="normal">
            {user.email}
          </Heading>
        </div>
        <div>
          {JSON.stringify(clients)}
        </div>
      </BaseLayout>
    </AuthGuard>
  )
}

export default Dashboard
