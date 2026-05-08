import React, { useEffect, useState } from 'react'
import useClass from '../../../classroom/hooks/useClass';
import { useNavigate } from 'react-router-dom';
const CreatedClasses = () => {
const {getAllClasses, allCreatedClass, loading, setActiveClass, getActiveClass} = useClass();
const navigate = useNavigate()
const [error, setError] = useState(null);

  async function getClasses(category){

    try {
      const enrollment = await getAllClasses({category});

    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err.message || 'Failed to fetch classes');
   
      return [];
    }
  }

  useEffect(() => {
    getClasses("created");
  }, []);

  const classrooms = allCreatedClass


  return (
   <div className='p-5'>
      <div className='flex justify-between items-center'>

      <h2 className='text-4xl font-bold text-primary'>Created Classes</h2>
      <button className='text-center  px-5 py-2 rounded bg-primary text-base-100 text-lg flex items-center justify-center'><span className='text-2xl'>+</span> <span>Create a Class</span></button>
      </div>

      {loading && (
        <div className='flex justify-center items-center py-10'>
          <div className='loading loading-spinner loading-lg text-primary'></div>
        </div>
      )}

      {error && (
        <div className='w-full bg-error/10 border border-error/30 p-4 rounded-lg mb-4'>
          <p className='text-error font-medium'>❌ {error}</p>
        </div>
      )}

      <div className='flex  flex-wrap gap-10 mt-10'>
        {classrooms && classrooms.length > 0 ? (
          classrooms.map((classroom, index) => (
            <div onClick={async ()=>{
              setActiveClass(classroom?.class)
              navigate(`/class/${classroom?.enrollmentId}`)
              }} key={index} className='bg-base-200 border border-primary/30 rounded-lg p-5 flex gap-5'>
              <div>
                <div className='w-20 h-20 bg-error text-base-100 flex items-center justify-center text-2xl rounded-full capitalize'>{classroom?.class.className?.slice(0, 2)}</div>
              </div>
              <div>
              <h3 className='font-bold text-secondary capitalize text-xl'>{classroom?.class.className}</h3>
              <p className='text-sm text-primary/80 font-bold capitalize'>{classroom?.class.classSubject}</p>
              <p className='text-xs text-base-content/50'>{classroom?.class.classSession}</p>
              <p><span className='text-sm text-secondary/80 font-medium'>Created On:</span> <span className='text-xs text-primary/60 '>{new Date(classroom?.joinedAt).toDateString()}</span></p>
              </div>
            </div>
          ))
        ) : (
          <div className='w-full border-2 border-primary/50 p-10 text-center mt-20 rounded-xl'>
            <p>Not any classes created yet</p>
          </div>
        )}
      </div>      

    </div>
  )
}

export default CreatedClasses
