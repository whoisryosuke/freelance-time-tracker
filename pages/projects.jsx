import { useEffect, useState } from 'react'
import Head from 'next/head'
import {
  Button,
  Heading,
  useDisclosure
} from '@chakra-ui/core'
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import AuthGuard from '../components/AuthGuard'
import CreateClientModal from '../components/Modals/CreateClientModal'
import BaseLayout from '../layouts/BaseLayout'
import { TOKEN_COOKIES_KEY } from '../constants'

const Projects = () => {
  const [clients, setClients] = useState({})
  const [projects, setProjects] = useState({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const token = Cookies.get(TOKEN_COOKIES_KEY)

  useEffect(() => {
    const fetchData = async () => {
      const strapi = new Strapi('http://localhost:1337/')
      strapi.setToken(token)
      const latestClients = await strapi.getEntries('clients')
      const latestProjects = await strapi.getEntries('projects')
      setClients(latestClients)
      setProjects(latestProjects)
    }
    fetchData()
  }, [token])

  return (
    <AuthGuard>
      <BaseLayout>
        <Head>
          <title>Projects &amp; Clients</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Heading as="h2" size="xl">
          Clients
        </Heading>
        <div>{JSON.stringify(clients)}</div>

        <Heading as="h2" size="xl">
          Projects
        </Heading>
        <div>{JSON.stringify(projects)}</div>

        <Button onClick={onOpen}>Create new client</Button>

        <CreateClientModal isOpen={isOpen} onClose={onClose} />
      </BaseLayout>
    </AuthGuard>
  )
}

export default Projects
