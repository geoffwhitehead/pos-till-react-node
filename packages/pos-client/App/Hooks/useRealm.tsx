import { useState, useEffect } from 'react'

export const useRealmQuery = (query) => {
  const [data, setData] = useState(query())

  useEffect(
    () => {
      const handleChange = (newData) => {
        // Not working even that data !== newData
        console.warn(data === newData)
        setData(newData)
        // With [...newData] works
        // setData(newData);
      }
      const dataQuery = query()
      dataQuery.addListener(handleChange)
      return () => {
        dataQuery.removeAllListeners()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query]
  )

  return data
}
