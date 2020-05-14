import React, { createContext, useContext, useState } from 'react'

export const ColumnContext = createContext()

export const ColumnProvider = ({ children }) => {
  const [column, updateColumn] = useState(new Date())

  return (
    <ColumnContext.Provider value={{ column, updateColumn }}>
      {children}
    </ColumnContext.Provider>
  )
}

export const useColumn = () => {
  return useContext(ColumnContext)
}
