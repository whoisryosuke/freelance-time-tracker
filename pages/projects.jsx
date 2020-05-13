import { useEffect, useState } from 'react'
import Head from 'next/head'
import {
    Box,
  Button,
  Heading,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/core'
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import AuthGuard from '../components/AuthGuard'
import CreateClientModal from '../components/Modals/CreateClientModal'
import CreateProjectModal from '../components/Modals/CreateProjectModal'
import BaseLayout from '../layouts/BaseLayout'
import { TOKEN_COOKIES_KEY } from '../constants'

const Projects = () => {
  const [clients, setClients] = useState({})
  const [projects, setProjects] = useState({})
  const { isOpen: clientIsOpen, onOpen: clientOnOpen, onClose: clientOnClose } = useDisclosure()
  const { isOpen: projectIsOpen, onOpen: projectOnOpen, onClose: projectOnClose } = useDisclosure()
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

        <Heading as="h2" size="xl" mb={3}>
          Projects
        </Heading>
        <Stack spacing={3} mb={8}>
          {projects && projects.length === 0 && (
            <Text p={5}>No projects found</Text>
          )}
          {projects &&
            projects.length > 0 &&
            projects.map((project) => (
              <Box
                bg={project.Color ? `${project.Color}.500` : 'gray.200'}
                color="white"
                p={5}
                borderRadius={8}
              >
                <Heading as="h3" size="md">
                  {project.Name}
                </Heading>
                <Text>{project.Description}</Text>
              </Box>
            ))}
          <Button variantColor="blue" onClick={projectOnOpen}>
            Create new project
          </Button>
        </Stack>

        <Heading as="h2" size="xl" mb={3}>
          Clients
        </Heading>
        <Stack spacing={3} mb={8}>
          {clients && clients.length === 0 && (
            <Text p={5}>No clients found</Text>
          )}
          {clients &&
            clients.length > 0 &&
            clients.map((client) => (
              <Box
                bg={client.Color ? `${client.Color}.500` : 'gray.200'}
                color="white"
                p={5}
                borderRadius={8}
              >
                <Heading as="h3" size="md">
                  {client.Name}
                </Heading>
                <Text>{client.Description}</Text>
              </Box>
            ))}
          <Button variantColor="blue" onClick={clientOnOpen}>
            Create new client
          </Button>
        </Stack>

        <CreateClientModal isOpen={clientIsOpen} onClose={clientOnClose} />
        <CreateProjectModal isOpen={projectIsOpen} onClose={projectOnClose} />
      </BaseLayout>
    </AuthGuard>
  )
}

export default Projects
