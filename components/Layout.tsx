
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden mr-64">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
