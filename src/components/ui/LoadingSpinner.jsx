import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', size = 'default' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    default: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-8">
      <div className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
