import React from "react"
import { subgraphClient } from "../../../client";
import { useGetUser } from "../../../queries/user";
import LoadingCircle from "../../atoms/Loading";
import Button from '../../atoms/inputs/buttons/Button'

const CheckUserRegistered = ({address, close, onSuccess}: {address: string, close: any, onSuccess: any}) => {
  const {loading, user} = useGetUser(subgraphClient, address);

  return loading ?
    <LoadingCircle /> :
    user ?
      onSuccess(user) :
      <div>
        <div>
          You must have LITH to use this app
        </div>
        <Button onClick={close} label="OK" />
      </div>
}

export default CheckUserRegistered