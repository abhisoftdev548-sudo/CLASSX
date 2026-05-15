import React from 'react';

const Avatar = ({ avatarUrl, name, size = 'md' }) => {
  const initials = name?.slice(0, 2)?.toUpperCase() ?? '??';

  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-32 h-32 text-5xl',
    responsive: 'w-full h-full text-xl md:text-2xl',
  };

  const sizeClass = sizeMap[size] || sizeMap.md;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'User avatar'}
        className={`rounded-full object-cover ${sizeClass}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold capitalize text-white bg-gradient-to-br from-primary to-secondary ${sizeClass}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
