import { NavRoutes } from '@/constants/routes'
import { Link, useLocation } from 'react-router'
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import profilePng from "/profile.png";

export const Header = () => {
    const location = useLocation();

    return (
        <header className='bg-background shadow-sm shadow-gray-700 p-4 flex flex-row items-center justify-between fixed top-0 left-0 right-0 z-50 '>
            <div className='flex flex-row items-center gap-10'>
                <h1 className='text-primary font-bold text-3xl tracking-tighter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'>
                    Chess io
                </h1>

                <div className='md:flex flex-row items-center gap-6 ml-auto hidden'>
                    {
                        NavRoutes.map((item) => (
                            <Link key={item.name} to={item.route}
                                className={`text-light hover:text-secondary transition-colors duration-200 font-bold ${location.pathname === item.route ? ' underline underline-offset-4' : ''}`}>
                                {item.name}
                            </Link>
                        ))
                    }
                </div>
            </div>

            <div className='flex flex-row gap-4 items-center'>
                <IoIosNotificationsOutline size={24} className='text-light' />
                <IoSettingsOutline size={24} className='text-light' />
                {/* profile dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <img src={profilePng} alt="profile image" className='w-10 h-10 rounded-lg 
                        border border-primary/70 ring-2 ring-primary/20 
                        shadow-[0_0_18px_rgba(168,85,247,0.55)] 
                        transition duration-200 
                        hover:shadow-[0_0_26px_rgba(168,85,247,0.75)]' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

        </header>
    )
}


