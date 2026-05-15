import React, { useEffect, useMemo, useState } from 'react'
import useClass from '../hooks/useClass'
import Avatar from '../../../components/Avatar'

const ManageStudentsPage = () => {
  const { activeClass, loading, getAllMembers } = useClass()
  const [students, setStudents] = useState([])
  const [branchFilter, setBranchFilter] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudents = async () => {
      if (!activeClass?._id) {
        return
      }

      try {
        setError(null)
        const members = await getAllMembers(activeClass._id)
        const studentMembers = Array.isArray(members)
          ? members.filter((member) => member.role === 'student')
          : []
        setStudents(studentMembers)
      } catch (err) {
        setError(err.message || 'Unable to load students')
        setStudents([])
      }
    }
    fetchStudents()
  }, [activeClass, getAllMembers])

  const uniqueBranches = useMemo(
    () => [...new Set(students.map((student) => student.branch).filter(Boolean))],
    [students]
  )

  const filteredStudents = useMemo(
    () =>
      branchFilter
        ? students.filter((student) => student.branch === branchFilter)
        : students,
    [branchFilter, students]
  )

  const handleBranchFilter = (branch) => {
    setBranchFilter(branch)
  }

  const handleResetFilter = () => {
    setBranchFilter('')
  }

  const formatMobileNumber = (mobileNumber) => {
    if (!mobileNumber || mobileNumber.length < 4) return mobileNumber
    const visible = mobileNumber.substring(0, 4)
    const masked = 'X'.repeat(mobileNumber.length - 4)
    return visible + masked
  }

  return (
    <div className='p-5 max-w-full'>
      <div className='flex flex-col gap-3 mb-6'>
        <h2 className='text-4xl font-bold text-primary'>Manage Students</h2>
        <p className='text-base-content/70'>
          Class: <span className='font-semibold'>{activeClass?.className || 'Loading class...'}</span>
        </p>
      </div>

      <div className='bg-base-200/50 p-6 rounded-xl mb-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h3 className='text-xl font-semibold text-secondary mb-2'>Filter by Branch</h3>
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
              {uniqueBranches.length > 0 &&
                uniqueBranches.map((branch) => (
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
          <div className='text-sm text-base-content/70'>
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-10'>
          <div className='loading loading-spinner loading-lg text-primary'></div>
        </div>
      ) : error ? (
        <div className='w-full bg-error/10 border border-error/30 p-4 rounded-lg mb-4'>
          <p className='text-error font-medium'>❌ {error}</p>
        </div>
      ) : (
        <>
          {filteredStudents.length > 0 ? (
            <div className='bg-base-100 rounded-xl shadow-sm overflow-hidden border border-base-300 overflow-x-auto'>
              <table className='table w-full' style={{ minWidth: 900 }}>
                <thead>
                  <tr className='bg-base-200'>
                    <th className='p-4'>Student</th>
                    <th className='p-4'>Email</th>
                    <th className='p-4'>Mobile</th>
                    <th className='p-4'>Branch</th>
                    <th className='p-4'>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className='hover:bg-base-200/50 border-b border-base-300 last:border-0'>
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <Avatar avatarUrl={student.userId?.avatarUrl} name={student.userId?.name} size='md' />
                          <span className='font-medium text-base-content'>{student.userId?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className='p-4 text-base-content/70'>{student.userId?.email || 'N/A'}</td>
                      <td className='p-4 text-base-content/70 font-mono text-sm'>
                        {student.userId?.mobileNumber
                          ? formatMobileNumber(student.userId.mobileNumber)
                          : 'N/A'}
                      </td>
                      <td className='p-4 text-base-content/70'>
                        {student.branch ? <span className='badge badge-secondary'>{student.branch}</span> : 'N/A'}
                      </td>
                      <td className='p-4 text-base-content/70'>
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
                {branchFilter ? `No students found in ${branchFilter} branch` : 'No students found for this class.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ManageStudentsPage
