import React, { useState } from 'react';
import useClass from '../hooks/useClass';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { joinClassFormSchema } from '../schema/joinClassForm.schema'; // Alag schema use karein

const JoinClassForm = ({ setActiveClassForm }) => {
  const [error, setError] = useState('');
  const { joinClass, loading } = useClass(); // Sahi hook function liya

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    // Make sure joinClassFormSchema mein 'joinCode' field ho
    resolver: zodResolver(joinClassFormSchema) 
  });

  const joinCode = watch('joinCode');
  const isStudent = joinCode && joinCode.toUpperCase().startsWith('STD-');

  const onSubmit = async (data) => {
    setError('');
    console.log("Join class form submitted with data:", data);

  const codeRegex = /^(TCH|STD)-/i; 
  
  if (!codeRegex.test(data.joinCode)) {
    setError("Invalid Code! Make sure it starts with STD- or TCH-");
    return;
  }

    try {
      await joinClass(data); 
      console.log("Successfully joined class");
      setActiveClassForm(false); // Success ke baad form close
    } catch (err) {
      console.error("Error joining class:", err);
      // Error handling useClass hook ke toast se ho jayegi
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Join a Class</h2>
        <button 
          onClick={() => setActiveClassForm(false)} 
          className="text-gray-400 hover:text-gray-600 font-bold text-xl"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Enter the code provided by your teacher to access the classroom.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className='w-full'>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class Joining Code
          </label>
          <input
            type="text"
            placeholder="e.g. CLS-A1B2-STD"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all  ${
              errors.joinCode || error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
            {...register("joinCode")}
          />
          
          {/* Validation Errors */}
          {errors.joinCode && (
            <p className="mt-1 text-xs text-red-500">{errors.joinCode.message}</p>
          )}
          {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
          )}
        </div>

        {isStudent && (
          <div className='w-full'>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. CSE, ECE, Mechanical"
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-all  ${
                errors.branch ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              {...register("branch")}
            />
            {errors.branch && (
              <p className="mt-1 text-xs text-red-500">{errors.branch.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all ${
            loading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg'
          }`}
        >
          {loading ? 'Joining...' : 'Join Class'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
          Tip: You can recover your access within 7 days if you left by mistake.
        </p>
      </div>
    </div>
  );
};

export default JoinClassForm;