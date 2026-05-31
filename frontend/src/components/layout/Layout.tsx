import { Outlet } from 'react-router'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

export const Layout = () => {
  return (
    <>
      <Header />
      <main className='pb-24 pt-24 px-4 min-h-screen bg-slate-950'>
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}
