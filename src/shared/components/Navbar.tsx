import React from 'react';
import { NavLink } from 'react-router-dom';
import DarkmodeToggle from './DarkmodeToggle';


const navItems = [
    { to: '/', label: 'Home' },
    { to: '/media', label: 'Media' },
    { to: '/platform', label: 'Platform' }
];

const Navbar: React.FC = () => {

    return (
        <nav className='bg-white dark:bg-gray-900 shadow-md'>
            <div className='mx-auto flex items-center justify-between py-3 px-4'>
                <NavLink to="/" className="text-2xl font-bold text-gray-600 dark:text-white">
                    StorageBucket
                </NavLink>

                <ul className='flex space-x-6'>
                <DarkmodeToggle/>
                {navItems.map((item) => (
                    <li key={item.to}>
                        <NavLink to={item.to}
                        end
                        className={({ isActive }) => [
                            'text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-300 mt-4 transition-colors',
                            isActive ? 'font-semibold border-b-2' : ''
                        ].join(' ')}>
                            {item.label}
                        </NavLink>
                    </li>
                ))}
                </ul>
            </div>
        </nav>
    )
};

export default Navbar;