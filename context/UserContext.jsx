import React, {createContext, useContext, useState} from "react"

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, updateUser] = useState({})

    return (
      <UserContext.Provider value={{ user, updateUser }}>
        {children}
      </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext)
}