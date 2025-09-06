
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  headerActions?: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, title, className = '', headerActions }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
