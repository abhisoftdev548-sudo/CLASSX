import React from 'react'
import  useAuth  from '../../../auth/hooks/useAuth';
const ProfileTab = () => {
  const {logout, logoutFromAllDevices, user, loading} = useAuth();

 
  return (
    <div className='w-full flex flex-col h-full p-6'>
      <h2 className='text-4xl font-bold text-primary mb-6'>Your Profile</h2>

      <div className='flex items-center gap-5 mb-6'>
        <div className='h-20 w-20 rounded-full border border-primary flex items-center justify-center text-2xl font-bold capitalize text-base-100 bg-primary/20'>{user.name.slice(0,2)}</div>
        <div>
            <h3 className='text-3xl font-black text-secondary'>{user?.name}</h3>
        </div>
      </div>
      
      <hr className='w-full border border-secondary/20 mb-6' />
      
      <div className='flex-1 flex flex-col gap-6'>
        <div className='bg-base-200/50 p-6 rounded-xl'>
          <h4 className='text-2xl font-medium text-base-content mb-4'>Contact Details:</h4>
          <ul className='ml-5 flex flex-col gap-3'>
              <li><b>Email:</b> {user?.email}</li>
              <li><b>Phone:</b> {user?.mobileNumber}</li>
          </ul>
        </div>

        <div className='bg-error/10 p-6 rounded-xl'>
          <h3 className='text-2xl font-medium text-error'>Danger Zone</h3>
          <p className='text-sm text-error/70 mt-2'>Account deletion and security settings</p>

          <div className='flex gap-4 mt-4'>
            <button className='btn btn-error text-base-100' onClick={()=>logout()}>Logout</button>
            <button className='btn btn-error text-base-100' onClick={()=>logoutFromAllDevices()}>Logout From All Devices</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileTab
