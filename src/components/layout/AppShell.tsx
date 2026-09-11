import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-app-bg text-text-primary antialiased">
      <Sidebar />
      <div className="pl-72">
        <Header />
        <main className="relative pt-16 w-full min-h-screen bg-app-bg">
          {children}
        </main>
      </div>
    </div>
  );
};
