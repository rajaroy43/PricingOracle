import React, { useEffect } from "react"
import { subgraphClient } from "../../../client";
import { useGetUser } from "../../../queries/user";
import LoadingCircle from "../../atoms/Loading";
import Button from '../../atoms/inputs/buttons/Button'

const CheckUserRegistered = ({address, close, onSuccess}: {address: string, close: any, onSuccess: any}) => {
  const {loading, user} = useGetUser(subgraphClient, address);
  useEffect(() => {
    if (user) onSuccess(user)
  }, [user])
  return loading ?
    <LoadingCircle /> :
    user ?
      <div>User Registered</div> :
      <div>
        <div>
          You must have LITH to use this app
        </div>
        <Button onClick={close} label="OK" />
      </div>
}

export default CheckUserRegistered