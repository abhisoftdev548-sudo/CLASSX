import React from 'react'
import DashboardLayout from './DashboardLayout'
import JoinedClasses from './components/JoinedClasses'
import CreatedClasses from './components/CreatedClasses'
import ProfileTab from './components/ProfileTab'
import ManageStudents from './components/ManageStudents'
import { Outlet } from 'react-router-dom'


const tabs = [
  {
    name: 'Joined Classes',
    path: 'joined-classes',
  },  
  {
    name: 'Created Classes',
    path: 'created-classes',
  },

  {
    name: 'Profile',
    path: 'profile',
  }
]
const Dashboard = () => {
  return (
    <div className='h-full'>
      <DashboardLayout  tabs={tabs} content={<Outlet/>}/>
    </div>
  )
}

export default Dashboard
