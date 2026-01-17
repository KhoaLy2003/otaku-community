import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  const mainRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [location.pathname])

  return (
    <div className="h-screen flex flex-col bg-[#dae0e6] overflow-hidden">
      <Header />

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main
          ref={mainRef}
          id="main-scroll"
          className="flex-1 overflow-y-auto min-h-0"
        >
          <div className="mx-auto max-w-6xl px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}