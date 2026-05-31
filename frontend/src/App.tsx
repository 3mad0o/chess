import { Route, Routes } from 'react-router'
import './App.css'
import { Layout } from '@/components/layout/Layout'
import { Game } from '@/pages/Game'
import { Home } from './pages/Home'
import { Store } from './pages/Store'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='game/:id' element={<Game />} />
            <Route path='store' element={<Store />} />
        
        </Route>
      </Routes>
   
   </>
  )
}

export default App
