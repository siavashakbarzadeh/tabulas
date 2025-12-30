import React, { Fragment } from 'react'
import { Menu } from '@headlessui/react'
import { Avatar, Icon } from '../../componenets'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme, useThemeUpdate } from '../context'
import { useAuth } from '../../contexts/AuthContext'
import { useMsal } from "@azure/msal-react"

const UserDropdown = () => {
    const theme = useTheme();
    const themeUpdate = useThemeUpdate();
    const { user, logout } = useAuth();
    const { instance } = useMsal();
    const navigate = useNavigate();

    const handleLogout = async () => {
        // Logout from MSAL first
        try {
            await instance.logoutPopup();
        } catch (e) {
            console.warn("MSAL logout failed:", e);
        }
        // Then logout locally
        logout();
        navigate('/login');
    };

    // Get user initials for avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const userInitials = getInitials(user?.name);
    const userName = user?.name || 'User';
    const userEmail = user?.email || '';

    return (
        <Menu as="div" className="dropdown relative">
            {({ open }) => (
                <>
                <Menu.Button className={`dropdown-toggle [&>*]:pointer-events-none peer inline-flex items-center group`}>
                    <div className="flex items-center">
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#97002D] text-white">
                            <span className="text-sm font-bold">{userInitials}</span>
                        </div>
                        <div className="hidden md:block ms-4 text-start">
                            <div className="text-slate-600 dark:text-white text-xs font-extrabold flex items-center">
                                {userName}
                                <em className="text-sm leading-none ms-1 ni ni-chevron-down"></em>
                            </div>
                        </div>
                    </div>
                </Menu.Button>
                <Menu.Items modal={false} className="dropdown-menu absolute end-0 top-full mt-2.5 max-xs:min-w-[240px] max-xs:max-w-[240px] min-w-[280px] max-w-[280px] border border-t-3 border-gray-200 dark:border-gray-800 border-t-primary-600 dark:border-t-primary-600 bg-white dark:bg-gray-950 rounded shadow z-[1000]">
                    <div className="hidden sm:block px-7 py-5 bg-slate-50 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center">
                            <Avatar rounded text={userInitials} size="rg" variant="primary"/>
                            <div className="ms-4 flex flex-col text-start">
                                <span className="text-sm font-bold text-slate-700 dark:text-white">{userName}</span>
                                <span className="text-xs text-slate-400 mt-1">{userEmail}</span>
                            </div>
                        </div>
                    </div>
                    <ul className="py-3">
                        <li>
                            <Menu.Item as={Fragment}>
                                <Link className="relative px-7 py-2.5 flex items-center rounded-[inherit] text-sm leading-5 font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:dark:text-primary-600 transition-all duration-300" to="/account">
                                    <Icon className="text-lg leading-none w-7" name="user-alt" />
                                    <span>Account</span>
                                </Link>
                            </Menu.Item>
                        </li>
                        <li>
                            <button onClick={()=> theme.skin !== "dark" ? themeUpdate.skin('dark') : themeUpdate.skin('light')} className="w-full relative px-7 py-2.5 flex items-center rounded-[inherit] text-sm leading-5 font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:dark:text-primary-600 transition-all duration-300">
                                <div className="flex dark:hidden items-center">    
                                    <Icon className="text-start text-lg leading-none w-7" name="moon"></Icon>
                                    <span>Dark Mode</span>
                                </div>
                                <div className="hidden dark:flex items-center">    
                                    <Icon className="text-start text-lg leading-none w-7" name="sun"></Icon>
                                    <span>Light Mode</span>
                                </div>
                                <div className="ms-auto relative h-6 w-12 rounded-full border-2 border-gray-200 dark:border-primary-600 bg-white dark:bg-primary-600">
                                    <div className="absolute start-0.5 dark:start-6.5 top-0.5 h-4 w-4 rounded-full bg-gray-200 dark:bg-white transition-all duration-300"></div>
                                </div>
                            </button>
                        </li>
                        <li className="block border-t border-gray-200 dark:border-gray-800 my-3"></li>
                        <li>
                            <Menu.Item as={Fragment}>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full relative px-7 py-2.5 flex items-center rounded-[inherit] text-sm leading-5 font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:dark:text-primary-600 transition-all duration-300"
                                >
                                    <Icon className="text-lg leading-none w-7" name="signout" />
                                    <span>Esci</span>
                                </button>
                            </Menu.Item>
                        </li>
                    </ul>
                </Menu.Items>
                </>
            )}
        </Menu>
    )
}

export default UserDropdown