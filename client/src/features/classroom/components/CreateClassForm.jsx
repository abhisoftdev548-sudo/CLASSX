import React, { useState } from 'react'
import useClass from '../hooks/useClass';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClassFormSchema } from '../schema/createClassForm.schema'
const CreateClassForm = ({ setActiveClassForm }) => {
  // State handling for form inputs
const {createClass, loading} = useClass()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createClassFormSchema)
  });

  const onSubmit = async (data) => {
    console.log("Creating class with data:", data);
    await createClass(data);
  }

  return (
    <div className='max-w-2xl mx-auto mt-10 p-8 bg-base-200 border border-primary/20 rounded-2xl shadow-xl'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-3xl font-bold text-primary italic'>Create New Class</h2>
        <button 
          onClick={() => setActiveClassForm(false)} 
          className='btn btn-circle btn-ghost btn-sm text-error'
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Class Name Input */}
        <div className='form-control w-full'>
          <label className='label' htmlFor="className">
            <span className='label-text font-bold text-secondary text-lg'>Class Name</span>
          </label>
          <input 
            type="text" 
            id='className' 
            placeholder='e.g. Computer Science - A' 
            className='input input-bordered input-primary w-full bg-base-100 focus:outline-offset-2'
            {...register('className')}
            required
          />
        </div>

        {/* Subject Input */}
        <div className='form-control w-full'>
          <label className='label' htmlFor="classSubject">
            <span className='label-text font-bold text-secondary text-lg'>Subject</span>
          </label>
          <input 
            type="text" 
            id='classSubject' 
            placeholder='e.g. Data Structures' 
            className='input input-bordered input-primary w-full bg-base-100'
            {...register('classSubject')}
            required
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Session Input */}
          <div className='form-control w-full'>
            <label className='label' htmlFor="classSession">
              <span className='label-text font-bold text-secondary text-lg'>Session</span>
            </label>
            <input 
              type="text" 
              id='classSession' 
              placeholder='e.g. 2025-26' 
              className='input input-bordered input-primary w-full bg-base-100'
              {...register('classSession')}
            />
          </div>

          {/* Avatar Input */}
          <div className='form-control w-full'>
            <label className='label' htmlFor="classAvatar">
              <span className='label-text font-bold text-secondary text-lg'>Class Avatar</span>
            </label>
            <input 
              type="file" 
              id='classAvatar' 
              className="file-input file-input-bordered file-input-primary w-full bg-base-100"
              {...register('classAvatar')}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 pt-4'>
            <button 
                type="submit" 
                className='btn btn-primary flex-1 text-lg text-base-100'
            >
                Create Class
            </button>
            <button 
                type="button"
                onClick={() => setActiveClassForm(false)}
                className='btn btn-outline btn-secondary'
            >
                Cancel
            </button>
        </div>
      </form>
    </div>
  )
}

export default CreateClassForm