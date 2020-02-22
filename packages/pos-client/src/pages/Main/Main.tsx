import React, { useState } from 'react'
import { populate } from '../../services/populate'
import { SidebarNavigator } from '../../navigators'
import { Loading } from '../Loading/Loading'

export const Main: React.FC = () => {
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    const populateAsync = async () => {
      // TODO: use the dataId property to validate whether we need to re populate.
      try {
        await populate()
        setLoading(false)
      } catch (err) {
        console.log('Populating failed', err)
      }
    }
    populateAsync()
  }, [])

  return loading ? <Loading /> : <SidebarNavigator />
}
