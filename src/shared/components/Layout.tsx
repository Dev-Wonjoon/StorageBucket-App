import React from 'react';
import Navbar from './Navbar';


interface LayoutProps {
    children: React.ReactNode
}


const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div className='flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800'>
        <Navbar />
        <main className='flex mx-auto p-4'>
            {children}
        </main>
    </div>
)

export default Layout;