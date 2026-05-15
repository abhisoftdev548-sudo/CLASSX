import React, { useEffect, useState } from 'react'
import { classService } from '../../../classroom/api/classServices'
import Avatar from '../../../../components/Avatar'

const ManageStudents = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [branchFilter, setBranchFilter] = useState('')
  const [uniqueBranches, setUniqueBranches] = useState([])

  const fetchStudents = async (branch = '') => {
    try {
      setLoading(true)
      const { response, error: err } = await classService.getAllStudents(branch)
      console.log('API Response:', response)
      if (err) {
        setError(err)
        setStudents([])
        setFilteredStudents([])
      } else {
        // Handle different response structures
        const studentsData = Array.isArray(response) ? response : (response?.data || [])
        setStudents(studentsData)
        setFilteredStudents(studentsData)

        // Extract unique branches from the response
        if (!branch && studentsData) {
          const branches = [...new Set(studentsData.map(student => student.branch).filter(Boolean))]
          setUniqueBranches(branches)
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch students')
      setStudents([])
      setFilteredStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleBranchFilter = (branch) => {
    setBranchFilter(branch)
    fetchStudents(branch)
  }

  const handleResetFilter = () => {
    setBranchFilter('')
    fetchStudents('')
  }

  // Format mobile number to show first 4 digits with X's
  const formatMobileNumber = (mobileNumber) => {
    if (!mobileNumber || mobileNumber.length < 4) return mobileNumber
    const visible = mobileNumber.substring(0, 4)
    const masked = 'X'.repeat(mobileNumber.length - 4)
    return visible + masked
  }

  return (
    <div className='p-5'>
      <h2 className='text-4xl font-bold text-primary mb-6'>Manage Students</h2>

      {/* Branch Filter Section */}
      <div className='bg-base-200/50 p-6 rounded-xl mb-6'>
        <h3 className='text-xl font-semibold text-secondary mb-4'>Filter by Branch</h3>
        <div className='flex flex-wrap gap-3'>
          <button
            onClick={handleResetFilter}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !branchFilter
                ? 'bg-primary text-base-100'
                : 'bg-base-300 text-base-content hover:bg-base-300/80'
            }`}
          >
            All Branches
          </button>
          {uniqueBranches.map((branch) => (
            <button
              key={branch}
              onClick={() => handleBranchFilter(branch)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                branchFilter === branch
                  ? 'bg-primary text-base-100'
                  : 'bg-base-300 text-base-content hover:bg-base-300/80'
              }`}
            >
              {branch}
            </button>
          ))}
        </div>
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

      {!loading && !error && (
        <>
          {filteredStudents.length > 0 ? (
            <div className='bg-base-100 rounded-xl shadow-sm overflow-hidden border border-base-300 overflow-x-auto'>
              <table className='table w-full min-w-[800px]'>
                <thead>
                  <tr className='bg-base-200'>
                    <th className='p-4 min-w-[200px]'>Student Name</th>
                    <th className='p-4 min-w-[250px]'>Email</th>
                    <th className='p-4 min-w-[150px]'>Mobile</th>
                    <th className='p-4 min-w-[150px]'>Branch</th>
                    <th className='p-4 min-w-[200px]'>Class</th>
                    <th className='p-4 min-w-[120px]'>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className='hover:bg-base-200/50 border-b border-base-300 last:border-0'>
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <Avatar avatarUrl={student.userId?.avatarUrl} name={student.userId?.name} size="md" />
                          <span className='font-medium text-base-content'>{student.userId?.name}</span>
                        </div>
                      </td>
                      <td className='p-4 text-base-content/70'>{student.userId?.email}</td>
                      <td className='p-4 text-base-content/70 font-mono text-sm'>
                        {student.userId?.mobileNumber ? formatMobileNumber(student.userId.mobileNumber) : 'N/A'}
                      </td>
                      <td className='p-4 text-base-content/70'>
                        {student.branch ? (
                          <span className='badge badge-secondary'>{student.branch}</span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className='p-4 text-base-content/70'>
                        <div>
                          <p className='font-medium'>{student.classId?.className}</p>
                          <p className='text-xs text-base-content/50'>{student.classId?.classSubject}</p>
                        </div>
                      </td>
                      <td className='p-4 text-base-content/70 text-sm'>
                        {student.joinedAt ? new Date(student.joinedAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='w-full border-2 border-primary/50 p-10 text-center mt-10 rounded-xl'>
              <p className='text-lg text-base-content/70'>
                {branchFilter ? `No students found in ${branchFilter} branch` : 'No students found'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ManageStudents
