import React from 'react'
import { subgraphClient } from '../../client'
import { useGetUser } from '../../queries/user'
import LoadingCircle from '../atoms/Loading'
import UserProfile from '../users/UserProfile'
import Base from './Base'

const Account = ({match}) => {
  const urlAddress = match.params.address
  const {loading, user} = useGetUser(subgraphClient, urlAddress)
  console.log(`in account loading ${loading} ${user}`)
  return (

    <Base>
     <h1>Lithium Profile for {urlAddress}</h1>
     {loading ?
        <LoadingCircle />
        :
        user ?
          <UserProfile user={user} />
          :
          <div>No user</div>
     }
    </Base>
   
  
    
  )
}

export default Account