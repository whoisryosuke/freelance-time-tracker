import React, {createContext, useContext, useEffect, useState} from "react"
import Strapi from 'strapi-sdk-javascript'
import Cookies from 'js-cookie'
import { TOKEN_COOKIES_KEY } from '../constants'

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, updateUser] = useState({})
    const token = Cookies.get(TOKEN_COOKIES_KEY)

    useEffect(() => {
      const fetchUser = async () => {
        const strapi = new Strapi('http://localhost:1337/')
        strapi.setToken(token)

        const profile = await strapi.getEntries('users/me')
        if (profile) updateUser(profile)

      }
      if (Object.keys(user).length === 0) {
        fetchUser()
      }
    }, [user, token])

    return (
      <UserContext.Provider value={{ user, updateUser }}>
        {children}
      </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext)
}