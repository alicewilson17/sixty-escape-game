import React from 'react'
import NavBar from '../Components/NavBar'

function MissionHome({teamData}) {

  return (
    <>
    <NavBar/>
    <div>Welcome, {teamData.team_name}</div>
    </>
  )
}

export default MissionHome