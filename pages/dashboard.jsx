import Head from 'next/head'
import AuthGuard from '../components/AuthGuard'
import BaseLayout from '../layouts/BaseLayout'

const Dashboard = () => {

  return (
    <AuthGuard>
      <BaseLayout>
        <Head>
          <title>Dashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div>Private dashboard</div>
      </BaseLayout>
    </AuthGuard>
  )
}

export default Dashboard
