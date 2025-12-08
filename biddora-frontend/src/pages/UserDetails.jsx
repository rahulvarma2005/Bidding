import React from 'react'
import UserCard  from '../components/UserDetails/UserCard'
import UserOtherListings from '../components/UserOtherListings'
import { useParams } from "react-router-dom";

const UserDetails = () => {
  
  const { userId } = useParams();

  return (
      <div className="px-20 py-10">
        <UserCard userId={userId}></UserCard>
        <UserOtherListings userId={userId}></UserOtherListings>
      </div>
  )
}

export default UserDetails
