import React, { useEffect, useState } from 'react'
import { ImExit, ImMenu } from "react-icons/im";
import { IoArrowBack, IoClose } from "react-icons/io5";

import { Link, Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import useAuth from '../auth/hooks/useAuth';
import useClass from './hooks/useClass';
import MembersPage from './components/MembersPage';
import Avatar from '../../components/Avatar';

const ClassDashboardLayout = ({tabs}) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.split('/').pop();
    const [activeTab, setActiveTab] = useState(currentTab);
const {enrollmentId} = useParams();
    const {getActiveClass, loading, activeClass} = useClass();
    const { user, logout, loading: authLoading } = useAuth();

    // Get all available tabs
    const allTabs = [
        {
            name: 'Members',
            path: 'members',
            component: <MembersPage/>
        },
        {
            name: 'Chat',
            path: 'chat',
        },
          {
    name: 'Manage Students',
    path: 'manage-students',
    visibleFor: ['teacher', 'creator']
  },
        {
            name: 'Assignments',
            path: 'assignments',
            component: <div className='p-6'><h2 className='text-2xl font-bold'>Assignments</h2></div>
        },
        {
            name: 'Settings',
            path: 'settings',
            component: <div className='p-6'><h2 className='text-2xl font-bold'>Settings</h2></div>
        }
    ];

    // Filter tabs based on user role
    const classTabs = allTabs.filter(tab => {
      if (tab.visibleFor) {
        return tab.visibleFor.includes(activeClass?.role);
      }
      return true;
    });

    const getClass = async () => {
        try{
            await getActiveClass(enrollmentId)
        }catch(err){
            console.log("Error getting class:", err);
            // Error silently handled
        }
    }

    useEffect(()=>{
        if(enrollmentId) {
            getClass();
        }
    },[enrollmentId])

    const activeTabstyles = 'bg-linear-to-r from-primary to-secondary text-white'
  return (
        <div className='w-screen h-screen flex flex-col md:flex-row'>
      {/* Mobile Header */}
      <div className='md:hidden flex items-center justify-between p-4 border-b border-primary/60 bg-base-100'>
        <Avatar avatarUrl={user?.avatarUrl} name={user?.name} size="md" />
        <h2 className='font-extrabold text-xl text-primary capitalize'>{activeClass?.className}</h2>
        <button onClick={() => setSidebarOpen(true)} className='p-2'>
          <ImMenu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className='md:hidden fixed inset-0 bg-black/50 z-50' onClick={() => setSidebarOpen(false)}>
          <div className='w-64 h-full bg-base-100 p-5 absolute right-0 top-0 transform transition-transform duration-300 ease-in-out' onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between pb-5'>
              <h2 className='font-extrabold text-2xl text-primary capitalize'>{activeClass?.className}</h2>
              <button onClick={() => setSidebarOpen(false)} className='p-2'>
                <IoClose size={24} />
              </button>
            </div>
            <p>{activeClass?.classSubject}</p>
            <p>{activeClass?.classSession}</p>
            <div className='flex items-center gap-2 p-2 mb-5'>
              <Avatar avatarUrl={user?.avatarUrl} name={user?.name} size="md" />
              <div>
                <h3 className='text-md font-bold text-secondary'>{user?.name}</h3>
                <p className='text-xs font-medium text-primary'>{user?.email}</p>
              </div>
            </div>
            <hr className='mb-5 border border-secondary/20' />
            <div className='flex flex-col gap-5 items-center h-full'>
              <button onClick={() => {navigate('/dashboard'); setSidebarOpen(false)}} className='w-full flex justify-between items-center p-2 rounded-lg hover:bg-primary/20'>
                <span className='flex items-center gap-2'>
                  <IoArrowBack size={18} />
                  Back to Dashboard
                </span>
              </button>
              {classTabs.map((tab, index) => (
                <Link to={tab.path} key={index} onClick={()=>{setActiveTab(tab.path); setSidebarOpen(false)}} className={`w-full flex justify-between items-center p-2 rounded-lg ${activeTab === tab.path ? activeTabstyles : 'hover:bg-primary/20'}`}>
                  <span>{tab.name}</span>
                </Link>
              ))}
            </div>
            <div className='mt-5'>
              <hr />
              <button onClick={logout} className='text-red-500 font-medium text-lg flex items-center justify-between w-full p-4'>Logout <ImExit /></button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className='hidden md:flex p-5 w-[20%] border-r border-primary/60 h-full flex-col gap-3'>
        <div className='pb-5'>
         <button onClick={() => navigate('/dashboard')} className='flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors mb-3'>
            <IoArrowBack size={20} />
            <span className='text-sm font-medium'>Back to Dashboard</span>
          </button>
         <h2 className=' font-extrabold text-3xl text-primary capitalize'>{activeClass?.className}</h2>
         <p>{activeClass?.classSubject}</p>
         <p>{activeClass?.classSession}</p>
        </div>
        
        <div className='flex items-center gap-2 p-2 mb-5'>
          <Avatar avatarUrl={user?.avatarUrl} name={user?.name} size="md" />
          <div>
            <h3 className='text-md font-bold text-secondary'>{user?.name}</h3>
            <p className='text-xs font-medium text-primary'>{user?.email}</p>
          </div>
        </div>
        <hr className='mb-5 border border-secondary/20' />
        <div className='flex flex-col gap-5 items-center h-full'>
            {classTabs.map((tab, index) => {
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
        <Outlet />
      </div>
    </div>
  )
}

export default ClassDashboardLayout
