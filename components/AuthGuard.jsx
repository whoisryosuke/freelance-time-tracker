import {useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { route } from 'next/dist/next-server/server/router'
import {TOKEN_COOKIES_KEY} from "../constants"

export default function AuthGuard({children}) {
    const [loggedIn, setLoggedIn] = useState(false)
    const router = useRouter()
    const token = Cookies.get(TOKEN_COOKIES_KEY)

    // Grab JWT from cookies
    // If no cookie, redirect to login page
    useEffect(() => {
      if (token && !loggedIn) {
        // Validate token here
        return setLoggedIn(true)
      }

      if(!loggedIn) router.push('/login')
      
    }, [loggedIn])


    if (loggedIn) return children
    return <div>Not authorized, redirecting to login</div>
}
