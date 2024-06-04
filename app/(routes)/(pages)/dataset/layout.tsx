import React from 'react';
import './style.css';


export const metadata = {
  title: "Dataset | Broadcast & Events",
  description: "Broadcast & media events",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <div className="bg-[var(--bgDark)]">
            {children}
        </div>
  );
}