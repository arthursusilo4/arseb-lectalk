'use client';

import { cn } from "@/lib/utils";
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
     {label: 'Home', href: '/'},
     {label: 'Buddies', href: '/buddies'},
     {label: 'My Track', href: '/my-track'}
]

const NavItems = () => {
     const pathname = usePathname();

  return (
     <nav className='flex items-center gap-4'>
          {navItems.map(({label, href}) => (
               <Link 
               href={href} 
               key={label} 
               className={cn(
               'nav-items',
               pathname === href && 'text-primary font-bold'
               )}
               >
               {label}
               </Link>
          ))}
     </nav>
  )
}

export default NavItems
