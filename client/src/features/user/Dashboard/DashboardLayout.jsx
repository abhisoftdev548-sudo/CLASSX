import React, { useState } from 'react'
import { ImExit } from "react-icons/im";
import useAuth from "../../auth/hooks/useAuth";
import { Link, Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = ({tabs}) => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop();
    const [activeTab, setActiveTab] = useState(currentTab);
    const { user, logout, loading } = useAuth();

    const activeTabstyles = 'bg-linear-to-r from-primary to-secondary text-white'
  return (
        <div className='w-screen h-screen flex'>
      <div className='p-5 w-[20%] border-r border-primary/60 h-full flex flex-col gap-3'>
        <div className='pb-5'>
         <h2 className=' font-extrabold text-3xl text-primary'>
  CLASS<span className='text-4xl font-black bg-linear-to-r from-primary to-secondary text-transparent bg-clip-text'>X</span>
</h2>
        </div>
        
        <div className='flex items-center gap-2 p-2 mb-5'>
          <div className='h-10 w-10 rounded-full border border-primary flex items-center justify-center text-xl font-bold capitalize text-base-100 bg-primary/20'>{user.name.slice(0,2)}</div>
          <div>
            <h3 className='text-md font-bold text-secondary'>{user?.name}</h3>
            <p className='text-xs font-medium text-primary'>{user?.email}</p>
          </div>
        </div>
        <hr className='mb-5 border border-secondary/20' />
        <div className='flex flex-col gap-5 items-center h-full'>
            {tabs.map((tab, index) => {

        return (
        <Link to={tab.path} key={index} onClick={()=>setActiveTab(tab.path)} className={`w-full flex justify-between items-center p-2  rounded-lg ${activeTab === tab.path ? activeTabstyles : 'hover:bg-primary/20'}`}>
            <span>{tab.name}</span>
          </Link>
          )
        })}
        </div>

        <div>
          <hr />
          <button onClick={logout} className='text-red-500 font-medium text-lg flex items-center justify-between w-full p-4'>Logout <ImExit /></button>
        </div>
      </div>

      <div className='p-5 w-full h-full overflow-auto'>
        {/* {
            tabs.map((tabs, index) => {
                return(
                    <div key={index} >
                        {activeTab === tabs.name && tabs.component}
                    </div>
                )
            })
        } */}
        <Outlet/>
      </div>
    </div>
  )
}

export default DashboardLayout
