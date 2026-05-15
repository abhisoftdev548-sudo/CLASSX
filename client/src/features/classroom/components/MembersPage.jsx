import React, { useEffect, useState } from 'react'
import useClass from '../hooks/useClass';
import Avatar from '../../../components/Avatar';

const MembersPage = () => {
  const { activeClass, loading, getAllMembers } = useClass();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      console.log(activeClass)
      if (activeClass?._id) {
        const res = await getAllMembers(activeClass._id); 
        console.log(res)
        if (res) {
          setMembers(res);
        }
      }
    };
    fetchMembers();
  }, [activeClass]);

  // Data Filtering by Role
  const creator = members.find(m => m.role === 'creator');
  const teachers = members.filter(m => m.role === 'teacher');
  const students = members.filter(m => m.role === 'student');

  // Format mobile number to show first 4 digits with X's
  const formatMobileNumber = (mobileNumber) => {
    if (!mobileNumber || mobileNumber.length < 4) return mobileNumber;
    const visible = mobileNumber.substring(0, 4);
    const masked = 'X'.repeat(mobileNumber.length - 4);
    return visible + masked;
  };

  // Reusable Table Component for Teachers and Students
  const MemberTable = ({ title, data, badgeColor }) => (
    <div className='mb-10'>
      <h3 className='text-2xl font-semibold mb-4 text-secondary border-b-2 border-base-300 pb-2'>
        {title} <span className='text-sm font-normal text-gray-500'>({data.length})</span>
      </h3>
      {data.length > 0 ? (
        <div className='bg-base-100 rounded-xl shadow-sm overflow-hidden border border-base-300 overflow-x-auto'>
          <table className='table w-full min-w-[600px]'>
            <thead>
              <tr className='bg-base-200'>
                <th className='p-4 min-w-[150px]'>Name</th>
                <th className='p-4 min-w-[200px]'>Email</th>
                <th className='p-4 min-w-[120px]'>Mobile</th>
                {title === 'Students' && <th className='p-4 min-w-[100px]'>Branch</th>}
                <th className='p-4 min-w-[100px]'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((member) => (
                <tr key={member._id} className='hover:bg-base-200/50 border-b border-base-300 last:border-0'>
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <Avatar avatarUrl={member.userId?.avatarUrl} name={member.userId?.name} size="md" />
                      <span className='font-medium text-base-content'>{member.userId?.name}</span>
                    </div>
                  </td>
                  <td className='p-4 text-base-content/70'>{member.userId?.email}</td>
                  <td className='p-4 text-base-content/70 font-mono text-sm'>
                    {member.userId?.mobileNumber ? formatMobileNumber(member.userId.mobileNumber) : 'N/A'}
                  </td>
                  {title === 'Students' && (
                    <td className='p-4 text-base-content/70'>
                      {member.branch || 'N/A'}
                    </td>
                  )}
                  <td className='p-4'>
                    <button className='btn btn-xs btn-error btn-outline'>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className='text-base-content/50 italic p-4'>No {title.toLowerCase()} added yet.</p>
      )}
    </div>
  );

  return (
    <div className='p-8 max-w-7xl mx-auto'>
      <h2 className='text-4xl font-bold text-primary mb-8'>Class Directory</h2>

      {loading ? (
        <div className='flex justify-center items-center py-20'>
          <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          {/* 1. Creator Section (No Table) */}
          {creator && (
            <div className='mb-12 p-6 bg-primary/5 rounded-2xl border-l-8 border-primary flex items-center justify-between'>
              <div className='flex items-center gap-5'>
                <Avatar avatarUrl={creator.userId?.avatarUrl} name={creator.userId?.name} size="lg" />
                <div>
                  <div className='badge badge-primary font-bold mb-1 uppercase'>{creator.role}</div>
                  <h3 className='text-2xl font-bold text-base-content'>{creator.userId?.name}</h3>
                  <p className='text-base-content/60'>{creator.userId?.email}</p>
                </div>
              </div>
              <div className='hidden md:block'>
                <span className='text-sm text-base-content/40 italic'>Created on: {new Date(creator.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* 2. Teachers Table */}
          <MemberTable title="Teachers" data={teachers} badgeColor="badge-secondary" />

          {/* 3. Students Table */}
          <MemberTable title="Students" data={students} badgeColor="badge-accent" />
        </>
      )}
    </div>
  );
};

export default MembersPage;