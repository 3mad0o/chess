import { NavLink } from 'react-router'
import { NavRoutes } from '@/constants/routes'
import {
  Home,
  ShoppingBag,
  Info,
  Phone,
  Circle,
} from 'lucide-react'

const iconMap: Record<string, typeof Circle> = {
  home: Home,
  store: ShoppingBag,
  info: Info,
  contact: Phone,
}

export const BottomNav = () => {
  return (
    <nav className='fixed bottom-0 left-0 right-0 z-40 border-t
     border-border bg-background shadow-md md:hidden rounded-2xl'>
      <div className='mx-auto flex max-w-5xl items-center justify-between rounded-t-3xl px-4 py-3'>
        {NavRoutes.map((item) => {
          const Icon = iconMap[item.icon] ?? Circle
          return (
            <NavLink
              key={item.name}
              to={item.route}
              end={item.route === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(221,183,255,0.15)]'
                    : 'text-light hover:text-secondary'
                }`
              }
            >
              <Icon className='h-5 w-5' />
              {item.name}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
